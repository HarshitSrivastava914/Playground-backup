// /* eslint-disable @typescript-eslint/no-explicit-any */
// "use client";

// import React, { useState } from "react";
// import CardPaymentForm from "./CardPaymentForm";

// import { createOrder } from "@/services/razorpayService";
// import { loadRazorpay } from "@/services/razorpay";
// import { RazorpayPollingRedirect } from "./RazorpayPollingRedirect";
// import ThankYou from "./Thankyou";
// import { CardFormData, getCardFormData } from "@/services/paymentData";
// import { UPIPaymentForm } from "./UPIPaymentForm";
// interface CustomCheckoutProps {
//   customerId: string;
//   customerData: any;
//   onSuccess: () => void;
//   onFailure: () => void;
//   paymentStatus: "idle" | "pending" | "success" | "failed";
//   setPaymentStatus: React.Dispatch<
//     React.SetStateAction<"idle" | "pending" | "success" | "failed">
//   >;
//   selectedMethod: string | null;
//   isMethodQR: boolean;
//   setIsMethodQR: (value: boolean) => void;
// }

// export default function CustomCheckout({
//   customerId,
//   customerData,
//   onSuccess,
//   onFailure,
//   paymentStatus,
//   setPaymentStatus,
//   selectedMethod,
//   isMethodQR,
//   setIsMethodQR,
// }: CustomCheckoutProps) {
//   const [formData, setFormData] = useState<CardFormData>(getCardFormData());
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [paymentId, setPaymentId] = useState<string | null>(null);

//   const handlePayment = async (formData: any) => {
//     try {
//       setIsProcessing(true);

//       // Load Razorpay SDK dynamically
//       const razorpay = await loadRazorpay();
//       if (!razorpay) throw new Error("Razorpay SDK failed to load.");

//       // --------------------------
//       // 1️⃣ CREATE ORDER
//       // --------------------------
//       const orderResponse = await createOrder({
//         amount: formData.amount,
//         customer_id: customerId,
//         method: formData.method, // card | upi
//         frequency: formData.frequency,
//       });

//       if (!orderResponse?.id) throw new Error("Order creation failed");

//       // --------------------------
//       // 2️⃣ PREPARE PAYMENT PAYLOAD
//       // --------------------------

//       let paymentData: any = {
//         amount: formData.amount,
//         currency: process.env.NEXT_PUBLIC_currency,
//         email: customerData?.email,
//         contact: customerData?.contact,
//         order_id: orderResponse.id,
//         customer_id: customerId,
//         method: formData.method, // dynamic
//         recurring: "1",
//       };
//       console.log("FormData for Harshit Srivastava", formData);

//       // --------------------------
//       // ⭐ CARD FLOW
//       // --------------------------
//       if (formData.method === "card") {
//         paymentData = {
//           ...paymentData,
//           save: 1,
//           consent_to_save_card: 1,
//           "card[name]": formData.cardHolder,
//           "card[number]": formData.cardNumber,
//           "card[cvv]": formData.cvv,
//           "card[expiry_month]": formData.expiryMonth,
//           "card[expiry_year]": formData.expiryYear,
//         };
//       }

//       // --------------------------
//       // ⭐ UPI FLOW
//       // formData.upiFlow = "collect" | "intent"
//       // --------------------------
//       if (formData.method === "upi" && formData.flow === "collect") {
//         paymentData.recurring = "1";

//         // Build the UPI object
//         paymentData.upi = {
//           flow: formData.flow, // "collect" or "intent"
//         };

//         // Add VPA only for collect flow
//         if (formData.flow === "collect") {
//           paymentData.upi.vpa = formData.vpa; // payer VPA
//         }
//       }

//       if (formData.method === "upi" && formData.flow === "qr") {
//         paymentData.recurring = "1";

//         // Build the UPI object
//         paymentData.upi = {
//           qr: true,
//           timeout: 1, // "collect" or "intent"
//         };
//       }

//       console.log("🚀 Payment payload:", paymentData);

//       // --------------------------
//       // 3️⃣ INITIATE PAYMENT
//       // --------------------------
//       razorpay.createPayment(paymentData);

//       // --------------------------
//       // 4️⃣ SUCCESS HANDLER
//       // --------------------------
//       razorpay.on("payment.success", function (resp: any) {
//         console.log("✅ Payment Success:", resp);
//         const payment_id = resp.razorpay_payment_id;
//         if (payment_id) setPaymentId(payment_id);
//       });

//       // --------------------------
//       // 5️⃣ ERROR HANDLER
//       // --------------------------
//       razorpay.on("payment.error", function (resp: any) {
//         console.error("❌ Payment Failed:", resp.error.description);
//         alert(`Payment Failed: ${resp.error.description}`);
//         onFailure?.();
//       });
//     } catch (err: any) {
//       console.error("❌ Payment process failed:", err.message);
//       alert("Payment initialization failed. Please try again.");
//       onFailure?.();
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   return (
//     <div className="flex flex-col items-center justify-center text-center p-8 bg-[#1e1e1e] rounded-2xl shadow-md w-full max-w-md mx-auto">
//       <div style={{ fontSize: "60px", color: "green" }}>💳</div>
//       <h1 className="text-2xl font-bold mt-4">Custom Checkout</h1>
//       <p className="text-gray-400 mt-2 mb-6">
//         Enter your card details and proceed to payment.
//       </p>

//       {/* ✅ Payment Form triggers handlePayNow automatically */}
//       {paymentStatus !== "success" && (
//         <div className="bg-[#2a2a2a] w-full rounded-xl p-4 mb-6">
//           {selectedMethod === "card" && (
//             <CardPaymentForm
//               onSubmit={handlePayment}
//               selectedCheckout="Custom Checkout"
//             />
//           )}
//         </div>
//       )}

//       <div className="bg-[#2a2a2a] w-full rounded-xl p-4 mb-6">
//         {selectedMethod === "upi" && (
//           <UPIPaymentForm
//             onSubmit={handlePayment}
//             selectedCheckout="S2S Checkout"
//             setIsMethodQR={setIsMethodQR}
//           />
//         )}
//       </div>

//       {/* ✅ Payment Summary */}
//       <div className="bg-[#2a2a2a] text-left w-full rounded-xl p-4 mb-6">
//         <h2 className="text-lg font-semibold mb-2 text-teal-400">
//           Payment Summary
//         </h2>
//         <p>
//           <strong>Amount:</strong> ₹{formData.amount}
//         </p>
//         <p>
//           <strong>Frequency:</strong> {formData.frequency || "One-time"}
//         </p>
//         <p>
//           <strong>Card Holder:</strong> {formData.cardHolder || "-"}
//         </p>
//         <p>
//           <strong>Card Number:</strong>{" "}
//           {formData.cardNumber
//             ? `**** **** **** ${formData.cardNumber.slice(-4)}`
//             : "-"}
//         </p>
//         <p>
//           <strong>Expiry:</strong>{" "}
//           {formData.expiryMonth && formData.expiryYear
//             ? `${formData.expiryMonth}/${formData.expiryYear}`
//             : "-"}
//         </p>
//       </div>

//       {/* ✅ Poll payment status */}
//       {paymentId && (
//         <RazorpayPollingRedirect
//           paymentId={paymentId}
//           redirectUrl=""
//           onSuccess={onSuccess}
//           onFailure={onFailure}
//         />
//       )}

//       {isProcessing && (
//         <p className="text-gray-400 mt-4">Processing your payment...</p>
//       )}

//       {paymentStatus === "success" && (
//         <ThankYou onStart={() => alert("Start Streaming")} />
//       )}
//     </div>
//   );
// }

/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import CardPaymentForm from "./CardPaymentForm";
import { createOrder } from "@/services/razorpayService";
import { loadRazorpay } from "@/services/razorpay";
import { RazorpayPollingRedirect } from "./RazorpayPollingRedirect";
import ThankYou from "./Thankyou";
import { CardFormData, getCardFormData } from "@/services/paymentData";
import { UPIPaymentForm } from "./UPIPaymentForm";

interface CustomCheckoutProps {
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
}: CustomCheckoutProps) {
  const [formData, setFormData] = useState<CardFormData>(getCardFormData());
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);

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
      // 1️⃣ CREATE ORDER
      // --------------------------
      const orderResponse = await createOrder({
        amount: formData.amount,
        customer_id: customerId,
        method: formData.method,
        frequency: formData.frequency,
      });

      if (!orderResponse?.id) throw new Error("Order creation failed");

      // --------------------------
      // 2️⃣ PREPARE PAYMENT PAYLOAD
      // --------------------------
      let paymentData: any = {
        amount: formData.amount,
        currency: process.env.NEXT_PUBLIC_currency,
        email: customerData?.email,
        contact: customerData?.contact,
        order_id: orderResponse.id,
        customer_id: customerId,
        method: selectedMethod,
        recurring: "1",
      };

      // --------------------------
      // ⭐ CARD FLOW
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

      // --------------------------
      // ⭐ UPI COLLECT
      // --------------------------
      if (selectedMethod === "upi" && formData.flow === "collect") {
        paymentData.upi = {
          flow: "collect",
          vpa: formData.vpa,
        };
      }

      // --------------------------
      // ⭐ UPI QR
      // --------------------------
      if (selectedMethod === "upi" && isMethodQR) {
        // Have used isMethodQR for qr to work in CustomCheckout(we are getting flow as intent in s2s checkout)
        paymentData.upi = {
          qr: true,
          timeout: 1,
        };
      }

      console.log("🚀 Payment payload for card:", paymentData);

      // --------------------------
      // 3️⃣ INITIATE PAYMENT
      // --------------------------
      razorpay.createPayment(paymentData);

      // --------------------------
      // 4️⃣ SUCCESS HANDLER
      // --------------------------
      razorpay.on("payment.success", function (resp: any) {
        console.log("✅ Payment Success:", resp);

        if (resp.razorpay_payment_id) {
          setPaymentId(resp.razorpay_payment_id);
        }

        if (resp.redirect_url) {
          setRedirectUrl(resp.redirect_url);
        }
      });

      // --------------------------
      // 5️⃣ ERROR HANDLER
      // --------------------------
      razorpay.on("payment.error", function (resp: any) {
        console.error("❌ Payment Failed:", resp.error?.description);
        setPaymentStatus("failed");
        onFailure?.();
      });
      console.log("Harshit method qr", isMethodQR);
    } catch (err: any) {
      console.error("❌ Payment process failed:", err.message);
      setPaymentStatus("failed");
      onFailure?.();
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center text-center p-8 bg-[#1e1e1e] rounded-2xl shadow-md w-full max-w-md mx-auto">
      <div style={{ fontSize: "60px", color: "green" }}>💳</div>
      <h1 className="text-2xl font-bold mt-4">Custom Checkout</h1>

      {paymentStatus === "idle" && (
        <>
          {selectedMethod === "card" && (
            <CardPaymentForm
              onSubmit={handlePayment}
              selectedCheckout="Custom Checkout"
            />
          )}

          {selectedMethod === "upi" && (
            <UPIPaymentForm
              onSubmit={handlePayment}
              selectedCheckout="Custom Checkout"
              setIsMethodQR={setIsMethodQR}
            />
          )}
        </>
      )}

      {/* 👉 CARD redirect + polling */}
      {paymentId &&
        selectedMethod === "card" &&
        paymentStatus === "pending" && (
          <RazorpayPollingRedirect
            paymentId={paymentId}
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

      {/* 👉 UPI direct polling */}
      {paymentId && selectedMethod === "upi" && paymentStatus === "pending" && (
        <RazorpayPollingRedirect
          paymentId={paymentId}
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

      {paymentStatus === "pending" && (
        <p className="text-gray-400 mt-4">Processing your payment...</p>
      )}

      {paymentStatus === "failed" && (
        <div className="text-red-500 mt-4">
          ❌ Payment Failed.
          <button
            onClick={handleRetry}
            className="ml-3 px-4 py-2 bg-blue-600 text-white rounded"
          >
            Retry
          </button>
        </div>
      )}

      {paymentStatus === "success" && (
        <ThankYou onStart={() => alert("Start Streaming")} />
      )}
    </div>
  );
}
