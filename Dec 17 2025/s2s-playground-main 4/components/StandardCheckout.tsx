/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { createOrder } from "@/services/razorpayService";
import { CardFormData, getCardFormData } from "@/services/paymentData";
import ThankYou from "./Thankyou";
import CardPaymentForm from "./CardPaymentForm";
import { UPIPaymentForm } from "./UPIPaymentForm";

interface StandardCheckoutProps {
  customerId: string;
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
}: StandardCheckoutProps) {
  const [formData, setFormData] = useState(getCardFormData());
  const [isLoading, setIsLoading] = useState(false);

  const handleFormSubmit = async (data: CardFormData) => {
    // ✅ Instead of just saving data, trigger actual payment flow
    setFormData(data);
  };

  // ✅ Load Razorpay script dynamically
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // ✅ Payment initialization
  const openRazorpay = async (formData: any) => {
    try {
      setIsLoading(true);
      setPaymentStatus("pending");

      // 1️⃣ Create order from backend
      console.log("🧾 Creating Razorpay order for customer:", customerId);
      console.log("standard checkout form data:", formData);
      const order = await createOrder({
        amount: formData.amount,
        customer_id: customerId,
        method: selectedMethod,
        frequency: formData.frequency,
      });

      if (!order?.id) throw new Error("Order creation failed");
      console.log("✅ Order created successfully:", order.id);

      // 2️⃣ Prepare Razorpay options
      const options: any = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: process.env.currency,
        order_id: order.id,
        customer_id: customerId,
        recurring: "1",
        prefill: {
          name: customerData.name,
          email: customerData.email,
          contact: customerData.contact,
        },
        handler: function (response: any) {
          console.log("✅ Razorpay Success Response:", response);
          setPaymentStatus("success");
          onSuccess();
        },
      };

      // 3️⃣ Payment failure handling
      const rzp1 = new (window as any).Razorpay(options);
      rzp1.on("payment.failed", function (response: any) {
        console.error("❌ Razorpay Payment Failed:", response.error);
        setPaymentStatus("failed");
        onFailure();
      });

      // 4️⃣ Open Razorpay popup
      rzp1.open();
    } catch (err: any) {
      console.error("💥 Error initiating Razorpay:", err.message);
      setPaymentStatus("failed");
      onFailure();
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Show Thank You page when successful
  useEffect(() => {
    if (paymentStatus === "success") {
      console.log("🎉 Payment successful — rendering ThankYou page");
    }
  }, [paymentStatus]);

  // ✅ UI
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 bg-[#1e1e1e] rounded-2xl shadow-md w-full max-w-md mx-auto">
      <div style={{ fontSize: "60px", color: "teal" }}>💳</div>
      <h1 className="text-2xl font-bold mt-4">Standard Checkout</h1>
      <p className="text-gray-400 mt-2 mb-6">
        You’ve chosen the standard Razorpay checkout flow. Click below to pay.
      </p>

      {paymentStatus === "idle" && (
        <>
          {selectedMethod === "card" && (
            <CardPaymentForm
              onSubmit={openRazorpay}
              selectedCheckout="Standard Checkout"
            />
          )}

          {selectedMethod === "upi" && (
            <UPIPaymentForm
              onSubmit={openRazorpay}
              selectedCheckout="Standard Checkout"
              setIsMethodQR={setIsMethodQR}
            />
          )}
        </>
      )}

      {/* Thank You Page */}
      {paymentStatus === "success" && (
        <>
          {console.log("✅ Rendering ThankYou Component")}
          <ThankYou
            onStart={() => {
              console.log("🚀 Start Streaming button clicked.");
              alert("Start Streaming");
            }}
          />
        </>
      )}
    </div>
  );
}
