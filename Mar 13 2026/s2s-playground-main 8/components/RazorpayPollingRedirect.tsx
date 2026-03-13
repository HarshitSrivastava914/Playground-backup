"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  fetchPaymentStatus,
  fetchTokenByCustomer,
  fetchTokenBypayment,
} from "@/services/razorpayService";

type RazorpayPollingRedirectProps = {
  paymentId: string;
  customerId: string | null;
  redirectUrl: string | null;
  checkoutType?: "Custom Checkout" | "Standard Checkout" | "S2S Checkout";
  onSuccess?: () => void;
  onFailure?: () => void;
  selectedProduct: string | null;
};

type PaymentStatus = "idle" | "polling" | "success" | "failed" | "timeout";

export const RazorpayPollingRedirect: React.FC<
  RazorpayPollingRedirectProps
> = ({
  paymentId,
  customerId,
  redirectUrl,
  checkoutType = "Standard Checkout",
  onSuccess,
  onFailure,
  selectedProduct,
}) => {
  const [status, setStatus] = useState<PaymentStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [finalStatus, setFinalStatus] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  //  Verify eMandate token status
  const verifyEmandateToken = async () => {
    if (!customerId || selectedProduct === "one-time") {
      return true;
    }

    setInfoMessage(" Verifying mandate approval from bank...");

    //  Fetch token details
    const tokenByPayment = await fetchTokenBypayment(paymentId);
    const tokenByCustomer = await fetchTokenByCustomer(customerId);

    //  Extract token_id from payment
    const tokenId = tokenByPayment?.token_id;

    if (!tokenId) {
      throw new Error(" Token ID not found in payment response");
    }

    //  Validate customer token response shape
    const tokens = tokenByCustomer?.items;

    if (!Array.isArray(tokens)) {
      throw new Error(" Invalid customer token response format");
    }

    //  Find matching token
    const matchedToken = tokens.find((token: any) => token.id === tokenId);

    if (!matchedToken) {
      throw new Error(" Mandate token not found for this customer");
    }

    //  Check mandate status
    const mandateStatus = matchedToken?.recurring_details?.status;
    const failureReason = matchedToken?.recurring_details?.failure_reason;

    if (mandateStatus === "confirmed") {
      setInfoMessage(" Mandate successfully approved by bank");
      return true;
    }

    //  Handle rejected / pending cases
    if (mandateStatus === "rejected") {
      throw new Error(failureReason || " Mandate rejected by bank");
    }

    throw new Error(
      ` Mandate not confirmed yet (status: ${mandateStatus || "unknown"})`
    );
  };

  //  Core polling logic
  const startPolling = async () => {
    const startTime = Date.now();
    setStatus("polling");
    setError(null);
    setInfoMessage(" Waiting for payment confirmation...");

    //  Custom Checkout → single poll
    if (checkoutType === "Custom Checkout") {
      try {
        const data = await fetchPaymentStatus(paymentId);
        const paymentStatus = data.status;
        setFinalStatus(paymentStatus);

        if (["captured", "authorized"].includes(paymentStatus)) {
          setStatus("success");
          setInfoMessage(" Payment successful");
          onSuccess?.();
        } else {
          setStatus("failed");
          setInfoMessage(" Payment failed");
          onFailure?.();
        }
      } catch (err: any) {
        setStatus("failed");
        setError(err.message);
        setInfoMessage(" Error while checking payment status");
        onFailure?.();
      }
      return;
    }

    //  Standard / S2S Checkout → continuous polling
    intervalRef.current = setInterval(async () => {
      const elapsed = Date.now() - startTime;

      if (elapsed >= 10 * 60 * 1000) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setStatus("timeout");
        setInfoMessage(" Payment verification timed out");
        return;
      }

      try {
        const data = await fetchPaymentStatus(paymentId);
        const paymentStatus = data.status;
        setFinalStatus(paymentStatus);

        if (["captured", "authorized"].includes(paymentStatus)) {
          if (intervalRef.current) clearInterval(intervalRef.current);

          setInfoMessage(" Payment successful. Verifying mandate with bank...");

          try {
            await verifyEmandateToken();
            setStatus("success");
            onSuccess?.();
          } catch (mandateErr: any) {
            setError(mandateErr.message);
            setInfoMessage(` Mandate failed: ${mandateErr.message}`);
            setStatus("failed");
            onFailure?.();
          }
        }

        if (["failed", "refunded", "cancelled"].includes(paymentStatus)) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setStatus("failed");
          setInfoMessage(" Payment failed or cancelled");
          onFailure?.();
        }
      } catch (err: any) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setStatus("failed");
        setError(err.message);
        setInfoMessage(" Error while polling payment status");
        onFailure?.();
      }
    }, 1000);
  };

  //  Redirect handler
  const handleRedirectClick = () => {
    setInfoMessage(" Redirecting to bank page...");
    startPolling();

    if (redirectUrl) {
      window.open(redirectUrl, "_blank", "noopener,noreferrer");
    }
  };

  //  Auto-start polling when redirect is not required
  useEffect(() => {
    if (!redirectUrl) {
      startPolling();
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [paymentId]);

  return (
    <div className="mt-4 text-center space-y-2">
      {redirectUrl && (
        <button
          onClick={handleRedirectClick}
          disabled={status === "polling"}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
        >
          Proceed to Bank Page
        </button>
      )}

      {infoMessage && <p className="text-sm text-gray-300">{infoMessage}</p>}

      {status === "polling" && (
        <p className="text-blue-400"> Verifying payment...</p>
      )}

      {status === "success" && (
        <p className="text-green-500 font-semibold">
          Payment & Mandate Successful
        </p>
      )}

      {status === "failed" && (
        <p className="text-red-500 font-semibold">
          {error || "Payment or mandate failed"}
        </p>
      )}

      {status === "timeout" && (
        <p className="text-yellow-500"> Payment verification timed out</p>
      )}

      {checkoutType === "Custom Checkout" && finalStatus && (
        <p className="text-gray-400">
          Payment status: <strong>{finalStatus}</strong>
        </p>
      )}
    </div>
  );
};
