// "use client";

// import { useState, useEffect } from "react";
// import {
//   createOrder,
//   createPayment,
//   submitOtp,
//   resendOtp,
//   generateQR,
//   validateVPA,
//   fetchMethod,
//   fetchTokenByCustomer,
//   fetchTokenBypayment,
// } from "../services/razorpayService";

// import { RazorpayPollingRedirect } from "./RazorpayPollingRedirect";
// import CardPaymentForm from "./CardPaymentForm";
// import { UPIPaymentForm } from "./UPIPaymentForm";
// import { CardFormData, UPIFormData } from "../services/paymentData";
// import ThankYou from "./Thankyou";
// import { isMobileDevice } from "@/services/isMobileDevice";
// import S2S_qr from "./S2S_qr";
// import EmandatePaymentForm from "./EmandatePaymentForm";
// interface S2SCheckoutProps {
//   customerId: string;
//   customerData: any;
//   selectedProduct: string | null;
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

// export default function S2SCheckout({
//   customerId,
//   customerData,
//   onSuccess,
//   onFailure,
//   paymentStatus,
//   setPaymentStatus,
//   selectedMethod,
//   isMethodQR,
//   selectedProduct,
//   setIsMethodQR,
// }: S2SCheckoutProps) {
//   const [paymentId, setPaymentId] = useState<string | null>(null);
//   const [redirectUrl, setRedirectUrl] = useState<string | null>(null);
//   const [otpSubmitUrl, setOtpSubmitUrl] = useState<string | null>(null);
//   const [otpResendUrl, setOtpResendUrl] = useState<string | null>(null);
//   const [otp, setOtp] = useState("");
//   const [emandateTokenStatus, setEmandateTokenStatus] = useState<string | null>(
//     null
//   );

//   const [step, setStep] = useState<number>(1);
//   const [qrCode, setQrCode] = useState<string>("");

//   console.log("Selected Method:", selectedMethod);

//   // 🔄 Payment status watcher
//   useEffect(() => {
//     if (paymentStatus === "success") onSuccess();
//     if (paymentStatus === "failed") onFailure();
//   }, [paymentStatus]);

//   useEffect(() => {
//     console.log("QR stored in state:", qrCode.length > 0, qrCode);
//   }, [qrCode]);

//   const handlePayment = async (formData: any) => {
//     try {
//       setPaymentStatus("pending");
//       console.log("printing form data in S2S Checkout:", formData);
//       console.log("notes:", formData.notes);
//       // 1️⃣ Create ORDER
//       const order = await createOrder({
//         amount: formData.amount,
//         method: selectedMethod,
//         customer_id: customerId,
//         receipt: formData.receipt,
//         notes: formData.notes,

//         ...(selectedProduct !== "one-time" && {
//           frequency: formData.frequency,
//           expire_at: formData.expire_at,
//           max_amount: formData.max_amount,

//           ...(selectedMethod === "upi" && {
//             recurring_value: formData.recurring_value,
//             recurring_type: formData.recurring_type,
//           }),

//           ...(selectedMethod === "emandate" && {
//             beneficiary_name: formData.beneficiary_name,
//             account_number: formData.account_number,
//             account_type: formData.account_type,
//             ifsc: formData.ifsc,
//             auth_type: formData.bank_details.auth_type,
//           }),

//         })

//       })

//       let vpaValidate = null;
//       if (
//         selectedMethod === "upi" &&
//         formData.flow === "collect" &&
//         formData.vpa
//       ) {
//         vpaValidate = await validateVPA(formData.vpa);
//         console.log("VPA Validation Result:", vpaValidate);
//       }

//       console.log("VPA Validation Result:", vpaValidate);

//       // 2️⃣ Build Payload
//       let paymentPayload: any = {
//         amount: formData.amount,
//         method: selectedMethod,
//         order_id: order.id,
//         customer_id: customerId,
//         email: customerData.email,
//         contact: customerData.contact,
//       };

//       if (selectedMethod === "card") {
//         paymentPayload.card = {
//           number: formData.cardNumber ?? "",
//           cvv: formData.cvv ?? "",
//           expiry_month: formData.expiryMonth ?? "",
//           expiry_year: formData.expiryYear ?? "",
//           name: formData.cardHolder ?? "",
//         };
//       }

//       if (selectedMethod === "upi") {
//         paymentPayload.upi = {
//           flow: formData.flow,
//           vpa: formData.flow === "collect" ? formData.vpa : undefined,
//         };
//       }

//       if (selectedMethod === "emandate") {
//         paymentPayload.emandate = {
//           bank_code: formData.bank_details.bank_code,
//           auth_type: formData.bank_details.auth_type,
//           name: formData.beneficiary_name,
//           account_number: formData.account_number,
//           account_type: formData.account_type,
//           ifsc: formData.ifsc,
//         };
//       }

//       console.log(
//         "Payment Payload for UPI before passing in API:",
//         paymentPayload
//       );

//       if (formData.flow === "collect" && !vpaValidate.success) {
//         console.error("❌ VPA Validation Failed");
//         setPaymentStatus("failed");
//         return;
//       }

//       // 3️⃣ Create Payment
//       const payment = await createPayment(paymentPayload);
//       console.log("Payment response:", payment);

//       // 4️⃣ Test failure
//       if (
//         formData.vpa === "failure@razorpay" &&
//         process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID?.startsWith("rzp_test")
//       ) {
//         setPaymentStatus("failed");
//         return;
//       }

//       // ⭐⭐⭐ QR FLOW MUST RUN BEFORE UPI-COLLECT LOGIC ⭐⭐⭐
//       if (isMethodQR) {
//         console.log("⚡ QR mode enabled — extracting intent link...");

//         const intentObj = payment?.next?.find(
//           (n: any) => n.action === "intent" && n.url
//         );

//         if (!intentObj) {
//           console.error("❌ No intent link found for QR");
//           setPaymentStatus("failed");
//           return;
//         }

//         const deepLink = intentObj.url;

//         // Save payment ID for status polling
//         if (payment.razorpay_payment_id) {
//           setPaymentId(payment.razorpay_payment_id);
//         }

//         // Generate QR
//         const qrResponse = await generateQR(deepLink);

//         if (qrResponse.qr) {
//           setQrCode(qrResponse.qr); // Correct
//         }

//         console.log("QR Generated:", qrResponse.qr);

//         console.log("QR COde", qrCode);

//         return; // IMPORTANT: stop UPI/CARD flows
//       }

//       // ✔️ UPI Collect (ONLY if not QR)
//       if (selectedMethod === "upi" && payment.razorpay_payment_id) {
//         setPaymentId(payment.razorpay_payment_id);
//         return;
//       }

//       // ✔️ CARD Flow
//       if (selectedMethod === "card") {
//         console.log("Rakshita is inside emandate if block");
//         if (payment.razorpay_payment_id) {
//           setPaymentId(payment.razorpay_payment_id);
//         }

//         (payment.next || []).forEach((actionObj: any) => {
//           if (actionObj.action === "redirect") {
//             console.log("Rakshita is inside emandate redirect if block");
//             setRedirectUrl(actionObj.url);
//             console.log("Rakshita", redirectUrl);
//           }
//           if (actionObj.action === "otp_submit") setOtpSubmitUrl(actionObj.url);
//           if (actionObj.action === "otp_resend") setOtpResendUrl(actionObj.url);
//         });
//       }

//       if (selectedMethod === "emandate") {
//         console.log("Rakshita is inside emandate if block");

//         if (payment.razorpay_payment_id) {
//           setPaymentId(payment.razorpay_payment_id);
//         }

//         (payment.next || []).forEach((actionObj: any) => {
//           if (actionObj.action === "redirect") {
//             console.log("Rakshita is inside emandate redirect if block");

//             setRedirectUrl(actionObj.url);

//             // ✅ log from response, NOT from state
//             console.log("Redirect URL:", actionObj.url);
//             console.log("Payment Status", paymentStatus);
//           }
//         });
//       }
//     } catch (err) {
//       console.error("❌ Payment error:", err);
//       setPaymentStatus("failed");
//     }
//   };

//   // 🔹 OTP Submit
//   const handleOtpSubmit = async () => {
//     if (!otpSubmitUrl || !otp) return;
//     try {
//       await submitOtp(otpSubmitUrl, otp);
//       setPaymentStatus("pending");
//     } catch {
//       setPaymentStatus("failed");
//     }
//   };

//   const handleResendOtp = async () => {
//     if (otpResendUrl) await resendOtp(otpResendUrl);
//   };

//   const handleRetry = () => {
//     setPaymentId(null);
//     setRedirectUrl(null);
//     setOtp("");
//     setOtpSubmitUrl(null);
//     setOtpResendUrl(null);
//     setPaymentStatus("idle");
//     setStep(1);
//   };

//   return (
//     <div>
//       {/* STEP 1: Render Payment Form Based on Method */}
//       {step === 1 && paymentStatus === "idle" && (
//         <>
//           {selectedMethod === "card" && (
//             <CardPaymentForm
//               onSubmit={handlePayment}
//               selectedCheckout="S2S Checkout"
//               selectedProduct={selectedProduct}
//             />
//           )}

//           {selectedMethod === "upi" && (
//             <UPIPaymentForm
//               onSubmit={handlePayment}
//               selectedCheckout="S2S Checkout"
//               setIsMethodQR={setIsMethodQR}
//             />
//           )}

//           {selectedMethod === "emandate" && (
//             <EmandatePaymentForm
//               onSubmit={handlePayment}
//               selectedCheckout="S2S Checkout"
//             />
//           )}

//           {["grabpay", "fpx", "paynow", "tng"].includes(selectedMethod || "") && (
//             <div className="bg-white/5 p-6 rounded-2xl border border-white/10 text-center">
//               <p className="text-gray-300 mb-6">
//                 You are about to pay using <span className="text-white font-semibold uppercase">{selectedMethod}</span>.
//               </p>
//               <button
//                 onClick={() => handlePayment({ amount: 100, notes: { method: selectedMethod } })}
//                 className="w-full bg-teal-500 hover:bg-teal-600 text-white py-3 rounded-xl font-semibold transition-all shadow-lg shadow-teal-500/20"
//               >
//                 Pay Now
//               </button>
//             </div>
//           )}
//         </>
//       )}
//       {/* ⭐ SHOW QR COMPONENT AFTER UPI FORM WHEN QR IS READY ⭐ */}
//       {isMethodQR && qrCode && paymentId && paymentStatus === "pending" && (
//         <S2S_qr
//           qrCode={qrCode}
//           paymentId={paymentId}
//           onSuccess={() => {
//             console.log("🎉 QR Payment Success");
//             setPaymentStatus("success");
//           }}
//           onFailure={() => {
//             console.log("❌ QR Payment Timeout/Failed");
//             setPaymentStatus("failed");
//           }}
//         />
//       )}

//       {/* STEP 2: OTP UI */}
//       {otpSubmitUrl && paymentStatus === "pending" && (
//         <div className="mt-4">
//           <label className="block mb-1 text-sm text-gray-400">Enter OTP:</label>
//           <input
//             type="text"
//             value={otp}
//             onChange={(e) => setOtp(e.target.value)}
//             className="border px-3 py-2 rounded w-full mb-2 bg-[#2a2a2a] text-white border-gray-600"
//           />
//           <div className="flex gap-2">
//             <button
//               onClick={handleOtpSubmit}
//               className="px-4 py-2 bg-blue-600 text-white rounded"
//             >
//               Submit OTP
//             </button>
//             <button
//               onClick={handleResendOtp}
//               className="px-4 py-2 bg-yellow-600 text-white rounded"
//             >
//               Resend OTP
//             </button>
//           </div>
//         </div>
//       )}

//       {/* 👉 CARD redirect + polling */}
//       {paymentId &&
//         selectedMethod === "card" &&
//         redirectUrl &&
//         paymentStatus === "pending" && (
//           <RazorpayPollingRedirect
//             paymentId={paymentId}
//             customerId={customerId}
//             redirectUrl={redirectUrl}
//             onSuccess={() => setPaymentStatus("success")}
//             onFailure={() => setPaymentStatus("failed")}
//           />
//         )}

//       {/* 👉 UPI direct polling (NO redirectUrl needed) */}
//       {paymentId && selectedMethod === "upi" && paymentStatus === "pending" && (
//         <RazorpayPollingRedirect
//           paymentId={paymentId}
//           customerId={customerId}
//           redirectUrl={null} // force direct polling
//           onSuccess={() => setPaymentStatus("success")}
//           onFailure={() => setPaymentStatus("failed")}
//         />
//       )}

//       {/* 👉 EMANDATE redirect + Rakshita */}
//       {paymentId &&
//         selectedMethod === "emandate" &&
//         redirectUrl &&
//         paymentStatus === "pending" && (
//           <RazorpayPollingRedirect
//             paymentId={paymentId}
//             customerId={customerId}
//             redirectUrl={redirectUrl}
//             onSuccess={() => {
//               setPaymentStatus("success");
//               setEmandateTokenStatus("success");
//             }}
//             onFailure={() => {
//               setPaymentStatus("failed");
//               setEmandateTokenStatus("failed");
//             }}
//           />
//         )}

//       {/* {paymentStatus === "pending" && (
//         <p className="text-gray-400 mt-4 flex justify-center items-center">
//           Processing your payment...
//         </p>
//       )}

//       {paymentStatus === "failed" && (
//         <div className="text-red-500 mt-4">
//           {selectedMethod !== "emandate" ? (
//             <p>❌ Payment failed. Please try again.</p>
//           ) : emandateTokenStatus === "failed" ? (
//             <p>❌ eMandate setup failed. Please try again.</p>
//           ) : (
//             <p>✅ Mandate registration successful.</p>
//           )}

//           <button
//             onClick={handleRetry}
//             className="ml-3 px-4 py-2 bg-blue-600 text-white rounded"
//           >
//             Retry
//           </button>
//         </div>
//       )}

//       {paymentStatus === "success" && (
//         <ThankYou onStart={() => alert("Start Streaming")} />
//       )} */}

//       {/* Payment Status Messages */}
//       <div className="mt-4 flex flex-col items-center w-full gap-3">
//         {/* Pending */}
//         {paymentStatus === "pending" && (
//           <p className="text-gray-200 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-2 w-full text-center max-w-sm">
//             ⏳ Processing your payment...
//           </p>
//         )}

//         {/* Failed */}
//         {paymentStatus === "failed" && (
//           <div className="bg-white/10 backdrop-blur-sm border border-red-500/50 rounded-lg p-4 flex flex-col items-center gap-3 w-full max-w-sm">
//             {selectedMethod !== "emandate" ? (
//               <p className="text-red-500 text-center">
//                 ❌ Payment failed. Please try again.
//               </p>
//             ) : emandateTokenStatus === "failed" ? (
//               <p className="text-red-500 text-center">
//                 ❌ eMandate setup failed. Please try again.
//               </p>
//             ) : (
//               <p className="text-green-400 text-center">
//                 ✅ Mandate registration successful.
//               </p>
//             )}

//             <button
//               onClick={handleRetry}
//               className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded transition"
//             >
//               Retry
//             </button>
//           </div>
//         )}

//         {/* Success */}
//         {paymentStatus === "success" && (
//           <div className="w-full max-w-sm">
//             <ThankYou onStart={() => alert("Start Streaming")} />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
"use client";

import { useState, useEffect } from "react";
import {
  createOrder,
  createPayment,
  submitOtp,
  resendOtp,
  generateQR,
  validateVPA,
  fetchMethod,
  fetchTokenByCustomer,
  fetchTokenBypayment,
} from "../services/razorpayService";

import { RazorpayPollingRedirect } from "./RazorpayPollingRedirect";
import CardPaymentForm from "./CardPaymentForm";
import { UPIPaymentForm } from "./UPIPaymentForm";
import { CardFormData, UPIFormData } from "../services/paymentData";
import ThankYou from "./Thankyou";
import { isMobileDevice } from "@/services/isMobileDevice";
import S2S_qr from "./S2S_qr";
import EmandatePaymentForm from "./EmandatePaymentForm";
import WalletPaymentForm from "./WalletPaymentForm";
import FPXPaymentForm from "./FPXPaymentForm";

interface S2SCheckoutProps {
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

export default function S2SCheckout({
  customerId,
  customerData,
  onSuccess,
  onFailure,
  paymentStatus,
  setPaymentStatus,
  selectedMethod,
  isMethodQR,
  selectedProduct,
  setIsMethodQR,
}: S2SCheckoutProps) {
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);
  const [otpSubmitUrl, setOtpSubmitUrl] = useState<string | null>(null);
  const [otpResendUrl, setOtpResendUrl] = useState<string | null>(null);
  const [otp, setOtp] = useState("");
  const [emandateTokenStatus, setEmandateTokenStatus] = useState<string | null>(
    null
  );

  const [step, setStep] = useState<number>(1);
  const [qrCode, setQrCode] = useState<string>("");

  console.log("Selected Method in S2S checkout:", selectedMethod);

  //  Payment status watcher
  useEffect(() => {
    if (paymentStatus === "success") onSuccess();
    if (paymentStatus === "failed") onFailure();
  }, [paymentStatus]);

  useEffect(() => {
    console.log("QR stored in state:", qrCode.length > 0, qrCode);
  }, [qrCode]);

  const handlePayment = async (formData: any) => {
    try {
      setPaymentStatus("pending");
      console.log("printing form data in S2S Checkout:", formData);
      console.log("notes:", formData.notes);
      //  Create ORDER
      const order = await createOrder({
        amount: formData.amount,
        customer_id: customerId,
        receipt: formData.receipt,
        notes: formData.notes,

        ...(selectedProduct !== "one-time" && {
          frequency: formData.frequency,
          expire_at: formData.expire_at,
          max_amount: formData.max_amount,
          method: selectedMethod,

          ...(selectedMethod === "upi" && {
            recurring_value: formData.recurring_value,
            recurring_type: formData.recurring_type,
          }),

          ...(selectedMethod === "emandate" && {
            beneficiary_name: formData.beneficiary_name,
            account_number: formData.account_number,
            account_type: formData.account_type,
            ifsc: formData.ifsc,
            auth_type: formData.bank_details.auth_type,
          }),
        }),
      });

      let vpaValidate = null;
      if (
        selectedMethod === "upi" &&
        formData.flow === "collect" &&
        formData.vpa
      ) {
        vpaValidate = await validateVPA(formData.vpa);
        console.log("VPA Validation Result:", vpaValidate);
      }

      console.log("VPA Validation Result:", vpaValidate);

      //  Build Payload
      let paymentPayload: any = {
        amount: formData.amount,
        method: selectedMethod,
        order_id: order.id,
        customer_id: customerId,
        email: customerData.email,
        contact: customerData.contact,
        ...(selectedProduct !== "one-time" && {
          recurring: "true",
        }),
        product: selectedProduct, // Pass product type to identify in API
      };

      if (selectedMethod === "card") {
        paymentPayload.card = {
          number: formData.cardNumber ?? "",
          cvv: formData.cvv ?? "",
          expiry_month: formData.expiryMonth ?? "",
          expiry_year: formData.expiryYear ?? "",
          name: formData.cardHolder ?? "",
        };
      }

      if (selectedMethod === "wallet") {
        console.log("firstselected method in wallet if block", formData.wallet);
        paymentPayload.wallet = formData.wallet;
      }

      if (selectedMethod === "fpx") {
        console.log(
          "firstselected method in fpx if block of s2s checkout",
          formData.bank_details.bank_code
        );
        paymentPayload.bank = formData.bank_details.bank_code;
      }

      if (selectedMethod === "upi") {
        paymentPayload.upi = {
          flow: formData.flow,
          vpa: formData.flow === "collect" ? formData.vpa : undefined,
        };
      }

      if (selectedMethod === "emandate") {
        paymentPayload.emandate = {
          bank_code: formData.bank_details.bank_code,
          auth_type: formData.bank_details.auth_type,
          name: formData.beneficiary_name,
          account_number: formData.account_number,
          account_type: formData.account_type,
          ifsc: formData.ifsc,
        };
      }

      console.log(
        "Payment Payload for UPI before passing in API:",
        paymentPayload
      );

      if (formData.flow === "collect" && !vpaValidate.success) {
        console.error(" VPA Validation Failed");
        setPaymentStatus("failed");
        return;
      }

      //  Create Payment
      const payment = await createPayment(paymentPayload);
      console.log("Payment response:", payment);

      //  Test failure
      if (
        formData.vpa === "failure@razorpay" &&
        process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID?.startsWith("rzp_test")
      ) {
        setPaymentStatus("failed");
        return;
      }

      //  QR FLOW MUST RUN BEFORE UPI-COLLECT LOGIC
      if (isMethodQR) {
        console.log(" QR mode enabled — extracting intent link...");

        const intentObj = payment?.next?.find(
          (n: any) => n.action === "intent" && n.url
        );

        if (!intentObj) {
          console.error(" No intent link found for QR");
          setPaymentStatus("failed");
          return;
        }
        const deepLink = intentObj.url;

        // Save payment ID for status polling
        if (payment.razorpay_payment_id) {
          setPaymentId(payment.razorpay_payment_id);
        }

        // Generate QR
        const qrResponse = await generateQR(deepLink);

        if (qrResponse.qr) {
          setQrCode(qrResponse.qr); // Correct
        }

        console.log("QR Generated:", qrResponse.qr);

        console.log("QR COde", qrCode);

        return; // IMPORTANT: stop UPI/CARD flows
      }

      //  UPI Collect (ONLY if not QR)
      if (selectedMethod === "upi" && payment.razorpay_payment_id) {
        setPaymentId(payment.razorpay_payment_id);
        return;
      }

      //  CARD Flow
      if (selectedMethod === "card") {
        console.log("Rakshita is inside emandate if block");
        if (payment.razorpay_payment_id) {
          setPaymentId(payment.razorpay_payment_id);
        }

        (payment.next || []).forEach((actionObj: any) => {
          if (actionObj.action === "redirect") {
            console.log("Rakshita is inside emandate redirect if block");
            setRedirectUrl(actionObj.url);
            console.log("Rakshita", redirectUrl);
          }
          if (actionObj.action === "otp_submit") setOtpSubmitUrl(actionObj.url);
          if (actionObj.action === "otp_resend") setOtpResendUrl(actionObj.url);
        });
      }

      if (selectedMethod === "wallet") {
        if (payment.razorpay_payment_id) {
          setPaymentId(payment.razorpay_payment_id);
        }

        (payment.next || []).forEach((actionObj: any) => {
          if (actionObj.action === "redirect") {
            console.log("Rakshita is inside emandate redirect if block");
            setRedirectUrl(actionObj.url);
            console.log("Rakshita", actionObj.url);
          }
        });
      }

      if (selectedMethod === "fpx") {
        if (payment.razorpay_payment_id) {
          setPaymentId(payment.razorpay_payment_id);
        }

        (payment.next || []).forEach((actionObj: any) => {
          if (actionObj.action === "redirect") {
            console.log("Rakshita is inside emandate redirect if block");
            setRedirectUrl(actionObj.url);
            console.log("Rakshita", actionObj.url);
          }
        });
      }

      if (selectedMethod === "emandate") {
        console.log("Rakshita is inside emandate if block");

        if (payment.razorpay_payment_id) {
          setPaymentId(payment.razorpay_payment_id);
        }

        (payment.next || []).forEach((actionObj: any) => {
          if (actionObj.action === "redirect") {
            console.log("Rakshita is inside emandate redirect if block");

            setRedirectUrl(actionObj.url);

            //  log from response, NOT from state
            console.log("Redirect URL:", actionObj.url);
            console.log("Payment Status", paymentStatus);
          }
        });
      }
    } catch (err) {
      console.error(" Payment error:", err);
      setPaymentStatus("failed");
    }
  };

  //  OTP Submit
  const handleOtpSubmit = async () => {
    if (!otpSubmitUrl || !otp) return;
    try {
      await submitOtp(otpSubmitUrl, otp);
      setPaymentStatus("pending");
    } catch {
      setPaymentStatus("failed");
    }
  };

  const handleResendOtp = async () => {
    if (otpResendUrl) await resendOtp(otpResendUrl);
  };

  const handleRetry = () => {
    setPaymentId(null);
    setRedirectUrl(null);
    setOtp("");
    setOtpSubmitUrl(null);
    setOtpResendUrl(null);
    setPaymentStatus("idle");
    setStep(1);
  };

  return (
    <div>
      {/* STEP 1: Render Payment Form Based on Method */}
      {step === 1 && paymentStatus === "idle" && (
        <>
          {selectedMethod === "card" && (
            <CardPaymentForm
              onSubmit={handlePayment}
              selectedCheckout="S2S Checkout"
              selectedProduct={selectedProduct}
            />
          )}
          {selectedMethod === "wallet" && (
            <WalletPaymentForm
              onSubmit={handlePayment}
              selectedCheckout="S2S Checkout"
              selectedProduct={selectedProduct}
            />
          )}
          {selectedMethod === "fpx" && (
            <FPXPaymentForm
              onSubmit={handlePayment}
              selectedCheckout="S2S Checkout"
              selectedProduct={selectedProduct}
            />
          )}

          {selectedMethod === "upi" && (
            <UPIPaymentForm
              onSubmit={handlePayment}
              selectedCheckout="S2S Checkout"
              setIsMethodQR={setIsMethodQR}
            />
          )}

          {selectedMethod === "emandate" && (
            <EmandatePaymentForm
              onSubmit={handlePayment}
              selectedCheckout="S2S Checkout"
            />
          )}
        </>
      )}
      {/*  SHOW QR COMPONENT AFTER UPI FORM WHEN QR IS READY  */}
      {isMethodQR && qrCode && paymentId && paymentStatus === "pending" && (
        <S2S_qr
          qrCode={qrCode}
          paymentId={paymentId}
          onSuccess={() => {
            console.log(" QR Payment Success");
            setPaymentStatus("success");
          }}
          onFailure={() => {
            console.log(" QR Payment Timeout/Failed");
            setPaymentStatus("failed");
          }}
        />
      )}

      {/* STEP 2: OTP UI */}
      {otpSubmitUrl && paymentStatus === "pending" && (
        <div className="mt-4">
          <label className="block mb-1 text-sm text-gray-400">Enter OTP:</label>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="border px-3 py-2 rounded w-full mb-2 bg-[#2A2A2A] text-white border-gray-600"
          />
          <div className="flex gap-2">
            <button
              onClick={handleOtpSubmit}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              Submit OTP
            </button>
            <button
              onClick={handleResendOtp}
              className="px-4 py-2 bg-yellow-600 text-white rounded"
            >
              Resend OTP
            </button>
          </div>
        </div>
      )}

      {/*  CARD redirect + polling */}
      {paymentId &&
        selectedMethod === "card" &&
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

      {/*  Wallet redirect + polling */}
      {paymentId &&
        selectedMethod === "wallet" &&
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

      {/*  UPI direct polling (NO redirectUrl needed) */}
      {/* {paymentId && selectedMethod === "upi" && paymentStatus === "pending" && (
        <RazorpayPollingRedirect
          paymentId={paymentId}
          customerId={customerId}
          redirectUrl={null} // force direct polling
          onSuccess={() => setPaymentStatus("success")}
          onFailure={() => setPaymentStatus("failed")}
        />
      )} */}

      {/*  EMANDATE redirect + Rakshita */}
      {/* {paymentId &&
        selectedMethod === "emandate" &&
        redirectUrl &&
        paymentStatus === "pending" && (
          <RazorpayPollingRedirect
            paymentId={paymentId}
            customerId={customerId}
            redirectUrl={redirectUrl}
            onSuccess={() => {
              setPaymentStatus("success");
              setEmandateTokenStatus("success");
            }}
            onFailure={() => {
              setPaymentStatus("failed");
              setEmandateTokenStatus("failed");
            }}
          />
        )} */}

      {/* {paymentStatus === "pending" && (
        <p className="text-gray-400 mt-4 flex justify-center items-center">
          Processing your payment...
        </p>
      )}

      {paymentStatus === "failed" && (
        <div className="text-red-500 mt-4">
          {selectedMethod !== "emandate" ? (
            <p> Payment failed. Please try again.</p>
          ) : emandateTokenStatus === "failed" ? (
            <p> eMandate setup failed. Please try again.</p>
          ) : (
            <p> Mandate registration successful.</p>
          )}

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
      )} */}

      {/* Payment Status Messages */}
      <div className="mt-4 flex flex-col items-center w-full gap-3">
        {/* Pending */}
        {paymentStatus === "pending" && (
          <p className="text-gray-200 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-2 w-full text-center max-w-sm">
            Processing your payment...
          </p>
        )}

        {/* Failed */}
        {paymentStatus === "failed" && (
          <div className="bg-white/10 backdrop-blur-sm border border-red-500/50 rounded-lg p-4 flex flex-col items-center gap-3 w-full max-w-sm">
            {selectedMethod !== "emandate" ? (
              <p className="text-red-500 text-center">
                Payment failed. Please try again.
              </p>
            ) : emandateTokenStatus === "failed" ? (
              <p className="text-red-500 text-center">
                eMandate setup failed. Please try again.
              </p>
            ) : (
              <p className="text-green-400 text-center">
                Mandate registration successful.
              </p>
            )}

            <button
              onClick={handleRetry}
              className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded transition"
            >
              Retry
            </button>
          </div>
        )}

        {/* Success */}
        {paymentStatus === "success" && (
          <div className="w-full max-w-sm">
            <ThankYou onStart={() => alert("Start Streaming")} />
          </div>
        )}
      </div>
    </div>
  );
}
