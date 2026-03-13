// "use client";

import React, { useEffect, useState } from "react";
import { createOrder } from "@/services/razorpayService";
import { CardFormData, getCardFormData } from "@/services/paymentData";
import ThankYou from "./Thankyou";
import CardPaymentForm from "./CardPaymentForm";
import { UPIPaymentForm } from "./UPIPaymentForm";
import EmandatePaymentForm from "./EmandatePaymentForm";
import WalletPaymentForm from "./WalletPaymentForm";
import { log } from "console";
import StandardPaymentForm from "./StandardPaymentForm";

interface StandardCheckoutProps {
  customerId: string | null;
  customerData: any;
  selectedProduct: string | null;
  onSuccess: () => void;
  onFailure: () => void;
  paymentStatus: "idle" | "pending" | "success" | "failed";
  setPaymentStatus: React.Dispatch<
    React.SetStateAction<"idle" | "pending" | "success" | "failed">
  >;
  selectedMethod: string | null;
  isMethodQR: boolean;
  setIsMethodQR: (value: boolean) => void;
}

export default function StandardCheckout({
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
}: StandardCheckoutProps) {
  const [formData, setFormData] = useState(getCardFormData());
  const [isLoading, setIsLoading] = useState(false);

  const handleFormSubmit = async (data: CardFormData) => {
    //  Instead of just saving data, trigger actual payment flow
    setFormData(data);
  };

  //  Load Razorpay script dynamically
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  //  Payment initialization
  const openRazorpay = async (formData: any) => {
    try {
      setIsLoading(true);
      setPaymentStatus("pending");

      //  Create order from backend
      const order = await createOrder({
        amount: formData.amount * 100,
        ...(selectedProduct !== "one-time" && {
          method: selectedMethod,
          max_amount: formData.max_amount,
          expire_at: formData.expire_at,
        }), // Only include method for recurring
        customer_id: customerId,
        receipt: formData.receipt,
        notes: formData.notes,

        ...(selectedMethod === "emandate" && {
          beneficiary_name: formData.beneficiary_name,
          account_number: formData.account_number,
          account_type: formData.account_type,
          ifsc: formData.ifsc,
          auth_type: formData.bank_details.auth_type,
        }),
      });

      if (!order?.id) throw new Error("Order creation failed");

      //  Prepare Razorpay options
      const options: any = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: process.env.NEXT_PUBLIC_currency,
        order_id: order.id,
        customer_id: customerId,
        ...(selectedProduct !== "one-time" && {
          recurring: 1,
        }),
        prefill: {
          name: customerData.name,
          email: customerData.email,
          contact: customerData.contact,
        },
        handler: function (response: any) {
          setPaymentStatus("success");
          onSuccess();
        },
      };
      console.log("Razorpay options:", options);
      //  Payment failure handling
      const rzp1 = new (window as any).Razorpay(options);
      rzp1.on("payment.failed", function (response: any) {
        setPaymentStatus("failed");
        onFailure();
      });

      //  Open Razorpay popup
      rzp1.open();
    } catch (err: any) {
      setPaymentStatus("failed");
      onFailure();
    } finally {
      setIsLoading(false);
    }
  };

  //  Show Thank You page when successful
  useEffect(() => {
    if (paymentStatus === "success") {
    }
  }, [paymentStatus]);

  //  UI
  return (
    <div>
      {paymentStatus === "idle" && (
        <>
          {selectedMethod === "card" && selectedProduct === "recurring" && (
            <CardPaymentForm
              onSubmit={openRazorpay}
              selectedCheckout="Standard Checkout"
              selectedProduct={selectedProduct}
            />
          )}

          {selectedMethod === "wallet" && selectedProduct === "recurring" && (
            <WalletPaymentForm
              onSubmit={openRazorpay}
              selectedCheckout="Standard Checkout"
              selectedProduct={selectedProduct}
            />
          )}

          {selectedProduct === "one-time" && (
            <StandardPaymentForm
              onSubmit={openRazorpay}
              selectedCheckout="Standard Checkout"
              selectedProduct={selectedProduct}
            />
          )}

          {selectedMethod === "upi" && selectedProduct === "recurring" && (
            <UPIPaymentForm
              onSubmit={openRazorpay}
              selectedCheckout="Standard Checkout"
              setIsMethodQR={setIsMethodQR}
            />
          )}

          {selectedMethod === "emandate" && selectedProduct === "recurring" && (
            <EmandatePaymentForm
              onSubmit={openRazorpay}
              selectedCheckout="Standard Checkout"
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
                  openRazorpay({
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

      {/* Thank You Page */}
      {paymentStatus === "success" && (
        <>
          <ThankYou
            onStart={() => {
              alert("Start Streaming");
            }}
          />
        </>
      )}
    </div>
  );
}
