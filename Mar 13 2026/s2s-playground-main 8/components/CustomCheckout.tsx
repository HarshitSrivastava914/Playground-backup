"use client";

import React, { useState } from "react";
import CardPaymentForm from "./CardPaymentForm";
import { createOrder } from "@/services/razorpayService";
import { loadRazorpay } from "@/services/razorpay";
import { RazorpayPollingRedirect } from "./RazorpayPollingRedirect";
import ThankYou from "./Thankyou";
import { CardFormData, getCardFormData } from "@/services/paymentData";
import { UPIPaymentForm } from "./UPIPaymentForm";
import EmandatePaymentForm from "./EmandatePaymentForm";
import WalletPaymentForm from "./WalletPaymentForm";
import FPXPaymentForm from "./FPXPaymentForm";

interface CustomCheckoutProps {
  customerId: string | null;
  customerData: any;
  onSuccess: () => void;
  onFailure: () => void;
  paymentStatus: "idle" | "pending" | "success" | "failed";
  setPaymentStatus: React.Dispatch<
    React.SetStateAction<"idle" | "pending" | "success" | "failed">
  >;
  selectedMethod: string | null;
  isMethodQR: boolean;
  setIsMethodQR: (value: boolean) => void;
  selectedProduct: string | null;
}

export default function CustomCheckout({
  customerId,
  customerData,
  onSuccess,
  onFailure,
  paymentStatus,
  setPaymentStatus,
  selectedMethod,
  isMethodQR,
  setIsMethodQR,
  selectedProduct,
}: CustomCheckoutProps) {
  const [formData, setFormData] = useState<CardFormData>(getCardFormData());
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);
  const [emandateTokenStatus, setEmandateTokenStatus] = useState<string | null>(
    null
  );

  const handleRetry = () => {
    setPaymentId(null);
    setRedirectUrl(null);
    setPaymentStatus("idle");
  };

  const handlePayment = async (formData: any) => {
    try {
      setIsProcessing(true);
      setPaymentStatus("pending");

      const razorpay = await loadRazorpay();
      if (!razorpay) throw new Error("Razorpay SDK failed to load.");

      // --------------------------
      //  CREATE ORDER
      // --------------------------
      const orderResponse = await createOrder({
        amount: formData.amount,
        customer_id: customerId,
        notes: formData.notes,
        receipt: formData.receipt,

        ...(selectedProduct !== "one-time" && {
          frequency: formData.frequency,
          expire_at: formData.expire_at,
          max_amount: formData.max_amount,
          method: selectedMethod,
        }),
        ...(selectedMethod === "emandate" && {
          beneficiary_name: formData.beneficiary_name,
          account_number: formData.account_number,
          account_type: formData.account_type,
          ifsc: formData.ifsc,
          auth_type: formData.bank_details.auth_type,
        }),
      });

      if (!orderResponse?.id) throw new Error("Order creation failed");

      // --------------------------
      //  PREPARE PAYMENT PAYLOAD
      // --------------------------
      let paymentData: any = {
        amount: formData.amount,
        currency: process.env.NEXT_PUBLIC_currency,
        email: customerData?.email,
        contact: customerData?.contact,
        order_id: orderResponse.id,
        customer_id: customerId,
        method: selectedMethod,
        ...(selectedProduct !== "one-time" && {
          recurring: 1,
        }),
      };

      // --------------------------
      //  CARD FLOW
      // --------------------------
      if (selectedMethod === "card") {
        paymentData = {
          ...paymentData,
          save: 1,
          consent_to_save_card: 1,
          "card[name]": formData.cardHolder,
          "card[number]": formData.cardNumber,
          "card[cvv]": formData.cvv,
          "card[expiry_month]": formData.expiryMonth,
          "card[expiry_year]": formData.expiryYear,
        };
      }

      if (selectedMethod === "wallet") {
        paymentData = {
          ...paymentData,
          wallet: formData.wallet,
        };
      }
      if (selectedMethod === "fpx") {
        paymentData = {
          ...paymentData,
          fpx: formData.fpx_bank,
          callback_url: "https://www.youtube.com/",
        };
      }

      // --------------------------
      //  UPI COLLECT
      // --------------------------
      if (selectedMethod === "upi" && formData.flow === "collect") {
        paymentData.upi = {
          flow: "collect",
          vpa: formData.vpa,
        };
      }

      // --------------------------
      //  UPI QR
      // --------------------------
      if (selectedMethod === "upi" && isMethodQR) {
        // Have used isMethodQR for qr to work in CustomCheckout(we are getting flow as intent in s2s checkout)
        paymentData.upi = {
          qr: true,
          timeout: 1,
        };
      }

      if (selectedMethod === "emandate") {
        paymentData = {
          ...paymentData,
          bank: formData.bank_details.bank_code,
          auth_type: formData.bank_details.auth_type,
          "bank_account[name]": formData.beneficiary_name,
          "bank_account[account_number]": formData.account_number,
          "bank_account[account_type]": formData.account_type,
          "bank_account[ifsc]": formData.ifsc,
        };
      }

      // --------------------------
      //  INITIATE PAYMENT
      // --------------------------
      razorpay.createPayment(paymentData);

      // --------------------------
      //  SUCCESS HANDLER
      // --------------------------
      razorpay.on("payment.success", function (resp: any) {
        if (resp.razorpay_payment_id) {
          setPaymentId(resp.razorpay_payment_id);
        }

        if (resp.redirect_url) {
          setRedirectUrl(resp.redirect_url);
        }
      });

      // --------------------------
      //  ERROR HANDLER
      // --------------------------
      razorpay.on("payment.error", function (resp: any) {
        setPaymentStatus("failed");
        onFailure?.();
      });
    } catch (err: any) {
      setPaymentStatus("failed");
      onFailure?.();
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div>
      {paymentStatus === "idle" && (
        <>
          {selectedMethod === "card" && (
            <CardPaymentForm
              onSubmit={handlePayment}
              selectedCheckout="Custom Checkout"
              selectedProduct={selectedProduct}
            />
          )}
          {selectedMethod === "wallet" && (
            <WalletPaymentForm
              onSubmit={handlePayment}
              selectedCheckout="Custom Checkout"
              selectedProduct={selectedProduct}
            />
          )}
          {selectedMethod === "fpx" && (
            <FPXPaymentForm
              onSubmit={handlePayment}
              selectedCheckout="Custom Checkout"
              selectedProduct={selectedProduct}
            />
          )}

          {selectedMethod === "upi" && (
            <UPIPaymentForm
              onSubmit={handlePayment}
              selectedCheckout="Custom Checkout"
              setIsMethodQR={setIsMethodQR}
            />
          )}
          {selectedMethod === "emandate" && (
            <EmandatePaymentForm
              onSubmit={handlePayment}
              selectedCheckout="Custom Checkout"
            />
          )}
          {["grabpay", "fpx", "paynow", "tng"].includes(
            selectedMethod || ""
          ) && (
            <div className="bg-white/5 p-6 rounded-2xl border border-white/10 text-center w-full">
              <p className="text-gray-300 mb-6">
                You are about to pay using{" "}
                <span className="text-white font-semibold uppercase">
                  {selectedMethod}
                </span>
                .
              </p>
              <button
                onClick={() =>
                  handlePayment({
                    amount: 100,
                    notes: { method: selectedMethod },
                  })
                }
                className="w-full bg-teal-500 hover:bg-teal-600 text-white py-3 rounded-xl font-semibold transition-all shadow-lg shadow-teal-500/20"
              >
                Pay Now
              </button>
            </div>
          )}
        </>
      )}
      {/*  CARD redirect + polling */}
      {paymentId &&
        selectedMethod === "card" &&
        paymentStatus === "pending" && (
          <RazorpayPollingRedirect
            paymentId={paymentId}
            customerId={customerId}
            selectedProduct={selectedProduct}
            redirectUrl={null}
            onSuccess={() => {
              setPaymentStatus("success");
              onSuccess();
            }}
            onFailure={() => {
              setPaymentStatus("failed");
              onFailure();
            }}
          />
        )}

      {paymentId &&
        selectedMethod === "wallet" &&
        paymentStatus === "pending" && (
          <RazorpayPollingRedirect
            paymentId={paymentId}
            customerId={customerId}
            selectedProduct={selectedProduct}
            redirectUrl={null}
            onSuccess={() => {
              setPaymentStatus("success");
              onSuccess();
            }}
            onFailure={() => {
              setPaymentStatus("failed");
              onFailure();
            }}
          />
        )}

      {/*  FPX redirect + polling */}
      {paymentId &&
        selectedMethod === "fpx" &&
        redirectUrl &&
        paymentStatus === "pending" && (
          <RazorpayPollingRedirect
            paymentId={paymentId}
            customerId={customerId}
            redirectUrl={redirectUrl}
            selectedProduct={selectedProduct}
            onSuccess={() => setPaymentStatus("success")}
            onFailure={() => setPaymentStatus("failed")}
          />
        )}

      {/*  UPI direct polling */}
      {paymentId && selectedMethod === "upi" && paymentStatus === "pending" && (
        <RazorpayPollingRedirect
          paymentId={paymentId}
          customerId={customerId}
          selectedProduct={selectedProduct}
          redirectUrl={null}
          onSuccess={() => {
            setPaymentStatus("success");
            onSuccess();
          }}
          onFailure={() => {
            setPaymentStatus("failed");
            onFailure();
          }}
        />
      )}
      {paymentId &&
        selectedMethod === "emandate" &&
        paymentStatus === "pending" && (
          <RazorpayPollingRedirect
            paymentId={paymentId}
            customerId={customerId}
            selectedProduct={selectedProduct}
            redirectUrl={null}
            onSuccess={() => {
              setPaymentStatus("success");
              setEmandateTokenStatus("success");
            }}
            onFailure={() => {
              setPaymentStatus("failed");
              setEmandateTokenStatus("failed");
            }}
          />
        )}
      <div className="mt-4 flex flex-col items-center w-full gap-3">
        {paymentStatus === "pending" && (
          <p className="text-gray-200 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-2 w-full text-center max-w-sm">
            Processing your payment...
          </p>
        )}
        {paymentStatus === "failed" && (
          <div className="bg-white/10 backdrop-blur-sm border border-red-500/50 rounded-lg p-4 flex flex-col items-center gap-3 w-full max-w-sm">
            Payment Failed.
            <button
              onClick={handleRetry}
              className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded transition"
            >
              Retry
            </button>
          </div>
        )}
      </div>
      {paymentStatus === "success" && (
        <ThankYou onStart={() => alert("Start Streaming")} />
      )}
    </div>
  );
}
