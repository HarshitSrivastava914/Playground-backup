/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useRef, useEffect } from "react";
import { fetchPaymentStatus } from "@/services/razorpayService";

type RazorpayPollingRedirectProps = {
  paymentId: string;
  redirectUrl: string | null;
  checkoutType?: "Custom Checkout" | "Standard Checkout" | "S2S Checkout"; // ✅ new prop to identify checkout type
  onSuccess?: () => void;
  onFailure?: () => void;
};

type PaymentStatus = "idle" | "polling" | "success" | "failed" | "timeout";

export const RazorpayPollingRedirect: React.FC<
  RazorpayPollingRedirectProps
> = ({
  paymentId,
  redirectUrl,
  checkoutType = "Standard",
  onSuccess,
  onFailure,
}) => {
  console.log("Printing inside RazorpayPollingRedirect", redirectUrl);
  const [status, setStatus] = useState<PaymentStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [finalStatus, setFinalStatus] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // ✅ Core polling logic
  const startPolling = async () => {
    const startTime = Date.now();
    setStatus("polling");

    // 🟡 CUSTOM CHECKOUT → poll once only
    if (checkoutType === "Custom Checkout") {
      try {
        const data = await fetchPaymentStatus(paymentId);
        const paymentStatus = data.status;
        setFinalStatus(paymentStatus);

        if (["captured", "authorized"].includes(paymentStatus)) {
          setStatus("success");
          onSuccess?.();
        } else if (
          ["failed", "refunded", "cancelled"].includes(paymentStatus)
        ) {
          setStatus("failed");
          onFailure?.();
        } else {
          setStatus("idle");
        }
      } catch (err: any) {
        setStatus("failed");
        setError(err.message);
        onFailure?.();
      }
      return;
    }

    // 🔵 NON-CUSTOM (STANDARD / S2S) → poll every 1s for 10 mins
    intervalRef.current = setInterval(async () => {
      const elapsed = Date.now() - startTime;

      // ⏱ Stop after 10 minutes
      if (elapsed >= 10 * 60 * 1000) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setStatus("timeout");
        return;
      }

      try {
        const data = await fetchPaymentStatus(paymentId);
        const paymentStatus = data.status;
        setFinalStatus(paymentStatus);

        if (["captured", "authorized"].includes(paymentStatus)) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setStatus("success");
          onSuccess?.();
        } else if (
          ["failed", "refunded", "cancelled"].includes(paymentStatus)
        ) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setStatus("failed");
          onFailure?.();
        }
      } catch (err: any) {
        if (intervalRef.current) clearInterval(intervalRef.current);
        setStatus("failed");
        setError(err.message);
        onFailure?.();
      }
    }, 1000); // ✅ Poll every second
  };

  // ✅ Handle redirect click + start polling
  const handleRedirectClick = () => {
    startPolling();
    if (redirectUrl) {
      window.open(redirectUrl, "_blank", "noopener,noreferrer");
    }
  };

  // ✅ Auto-start polling when no redirect URL is present
  useEffect(() => {
    if (!redirectUrl) {
      startPolling();
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [paymentId]);

  return (
    <div className="mt-4 text-center">
      {redirectUrl && (
        <button
          onClick={handleRedirectClick}
          disabled={status === "polling"}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
        >
          Proceed to Bank Page
        </button>
      )}

      {/* Status messages */}
      {status === "polling" && (
        <p className="mt-2 text-blue-400">🔄 Checking payment status...</p>
      )}
      {status === "success" && (
        <p className="mt-2 text-green-500">✅ Payment Successful!</p>
      )}
      {status === "failed" && (
        <p className="mt-2 text-red-500">
          ❌ Payment Failed. {error && `(${error})`}
        </p>
      )}
      {status === "timeout" && (
        <p className="mt-2 text-yellow-500">
          ⏱️ Payment timed out after 10 minutes.
        </p>
      )}
      {checkoutType === "Custom" && finalStatus && (
        <p className="mt-2 text-gray-300">
          🧾 Current payment status: <strong>{finalStatus}</strong>
        </p>
      )}
    </div>
  );
};
