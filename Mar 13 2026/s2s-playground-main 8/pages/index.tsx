// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/router";
// import { CheckoutType } from "../components/CheckoutTypes";
// import { ProductPage } from "../components/ProductPage";
// import CustomerForm from "../components/CustomerForm";
// import StandardCheckout from "@/components/StandardCheckout";
// import CustomCheckout from "@/components/CustomCheckout";
// import S2SCheckout from "@/components/S2SCheckout";
// import { PaymentMethodSelector } from "@/components/PaymentMethodSelector";
// import { ProductSelection } from "@/components/ProductSelection";
// import { ChevronDown, ArrowLeft } from "lucide-react";
// import {
//   setCardFormData,
//   setUPIFormData,
//   setEmandateFormData,
// } from "@/services/paymentData";
// import Link from "next/link";

// const regions = [
//   { id: "India", name: "India", flag: "🇮🇳" },
//   { id: "Malaysia", name: "Malaysia", flag: "🇲🇾" },
//   { id: "Singapore", name: "Singapore", flag: "🇸🇬" },
// ];

// export default function Home() {
//   const router = useRouter();

//   /* ---------------- STEP ---------------- */
//   // Initialize step from URL query or default to 0
//   const [step, setStep] = useState<number>(0);

//   // Sync state with URL query on mount and updates
//   useEffect(() => {
//     if (router.isReady) {
//       const queryStep = Number(router.query.step);
//       if (!isNaN(queryStep) && queryStep !== step) {
//         setStep(queryStep);
//       } else if (isNaN(queryStep) && step !== 0) {
//         // If no step in query, but state is not 0, reset to 0 (e.g. initial load or back to root)
//         setStep(0);
//       }
//     }
//   }, [router.isReady, router.query.step]);

//   // Helper to update step and URL
//   const updateStep = (newStep: number) => {
//     setStep(newStep);
//     router.push(
//       {
//         pathname: router.pathname,
//         query: { ...router.query, step: newStep },
//       },
//       undefined,
//       { shallow: true }
//     );
//   };

//   /* ---------------- FLOW STATE ---------------- */
//   const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
//   const [selectedCheckout, setSelectedCheckout] = useState<string | null>(null);

//   const [selectedRegion, setSelectedRegion] = useState<string>("Malaysia");
//   const [isRegionOpen, setIsRegionOpen] = useState(false);

//   const [customerId, setCustomerId] = useState<string | null>(null);
//   const [customerData, setCustomerData] = useState<any>(null);

//   const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
//   const [paymentStatus, setPaymentStatus] = useState<
//     "idle" | "pending" | "success" | "failed"
//   >("idle");

//   const [isMethodQR, setIsMethodQR] = useState<boolean>(false);

//   /* ---------------- BACK HANDLER ---------------- */
//   const handleBack = () => {
//     if (step === 0) return;
//     router.back(); // Use browser back to navigate
//   };

//   console.log("Selected Checkout:", selectedCheckout);

//   return (
//     <main className="h-screen w-screen overflow-hidden bg-gradient-to-br from-[#0a0e27] via-[#1a2847] to-[#0d1424] text-white relative">
//       {/* 🔙 Back Button */}
//       {step > 0 && (
//         <button
//           onClick={handleBack}
//           className="absolute top-20 left-6 z-50 flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 backdrop-blur-md transition"
//         >
//           <ArrowLeft className="w-4 h-4" />
//           Back
//         </button>
//       )}

//       {/* Razorpay Curlec Logo */}
//       <div className="absolute top-6 left-8 z-50">
//         <Link href="/">
//           <img
//             src="https://rzp-1415-prod-dashboard-activation.s3.ap-south-1.amazonaws.com/org_KjWRtYXwpK6VfK/main_logo/phpnbPHOI"
//             width="170"
//             height="35"
//             role="img"
//             aria-label="brand-logo"
//             alt="brand-logo"
//           ></img>
//         </Link>
//       </div>

//       {/* 🌍 Region Selector */}
//       <div className="absolute top-6 right-8 z-50">
//         <div className="relative">
//           <button
//             onClick={() => setIsRegionOpen(!isRegionOpen)}
//             className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 backdrop-blur-md transition"
//           >
//             <span className="text-xl">
//               {regions.find((r) => r.id === selectedRegion)?.flag}
//             </span>
//             <span className="font-medium">{selectedRegion}</span>
//             <ChevronDown
//               className={`w-4 h-4 transition-transform ${
//                 isRegionOpen ? "rotate-180" : ""
//               }`}
//             />
//           </button>

//           {isRegionOpen && (
//             <div className="absolute top-full mt-2 right-0 w-48 rounded-xl bg-[#1e293b]/90 border border-white/10 backdrop-blur-xl shadow-2xl">
//               {regions.map((region) => (
//                 <button
//                   key={region.id}
//                   onClick={() => {
//                     setSelectedRegion(region.id);
//                     setIsRegionOpen(false);
//                     setSelectedMethod(null);
//                   }}
//                   className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 text-left ${
//                     selectedRegion === region.id ? "bg-white/10" : ""
//                   }`}
//                 >
//                   <span className="text-xl">{region.flag}</span>
//                   <span>{region.name}</span>
//                 </button>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>

//       <div className="h-full w-full flex items-center justify-center px-4 sm:px-8">
//         <div className="w-full" key={step}>
//           {/* STEP 0 */}
//           {step === 0 && (
//             <ProductSelection
//               onSelect={(product) => {
//                 setSelectedProduct(product);
//                 updateStep(1);
//               }}
//             />
//           )}

//           {/* STEP 1 */}
//           {step === 1 && (
//             <ProductPage
//               onBuy={(amount, title) => {
//                 setCardFormData({ amount, notes: { title } });
//                 setUPIFormData({ amount, notes: { title } });
//                 setEmandateFormData({ amount, notes: { title } });
//                 updateStep(2);
//               }}
//             />
//           )}

//           {/* STEP 2 */}
//           {step === 2 && (
//             <CheckoutType
//               onSelect={(val) => {
//                 setSelectedCheckout(val);
//                 updateStep(3);
//               }}
//             />
//           )}

//           {/* STEP 3 */}
//           {step === 3 && (
//             <CustomerForm
//               showSkip={selectedProduct === "one-time"}
//               onNext={(custId, data) => {
//                 setCustomerId(custId);
//                 setCustomerData(data);
//                 // {
//                 //   selectedCheckout === "Standard Checkout" &&
//                 //   selectedProduct === "one-time"
//                 //     ? updateStep(5)
//                 //     : updateStep(4);
//                 // }
//                 updateStep(4);
//               }}
//             />
//           )}

//           {/* STEP 4 */}
//           {step === 4 && (
//             <PaymentMethodSelector
//               region={selectedRegion}
//               productType={selectedProduct}
//               selectedCheckout={selectedCheckout}
//               onSelect={({ method }) => {
//                 setSelectedMethod(method);
//                 updateStep(5);
//               }}
//             />
//           )}

//           {/* STEP 5 */}
//           {step === 5 && selectedMethod && selectedCheckout && (
//             <>
//               {selectedCheckout === "Standard Checkout" && (
//                 <StandardCheckout
//                   customerId={customerId}
//                   customerData={customerData}
//                   selectedProduct={selectedProduct}
//                   selectedMethod={selectedMethod}
//                   paymentStatus={paymentStatus}
//                   setPaymentStatus={setPaymentStatus}
//                   isMethodQR={isMethodQR}
//                   setIsMethodQR={setIsMethodQR}
//                   onSuccess={() => setPaymentStatus("success")}
//                   onFailure={() => setPaymentStatus("failed")}
//                 />
//               )}

//               {selectedCheckout === "Custom Checkout" && (
//                 <CustomCheckout
//                   customerId={customerId}
//                   customerData={customerData}
//                   selectedProduct={selectedProduct}
//                   selectedMethod={selectedMethod}
//                   paymentStatus={paymentStatus}
//                   setPaymentStatus={setPaymentStatus}
//                   isMethodQR={isMethodQR}
//                   setIsMethodQR={setIsMethodQR}
//                   onSuccess={() => setPaymentStatus("success")}
//                   onFailure={() => setPaymentStatus("failed")}
//                 />
//               )}

//               {selectedCheckout === "S2S Checkout" && (
//                 <S2SCheckout
//                   customerId={customerId}
//                   customerData={customerData}
//                   selectedProduct={selectedProduct}
//                   selectedMethod={selectedMethod}
//                   paymentStatus={paymentStatus}
//                   setPaymentStatus={setPaymentStatus}
//                   isMethodQR={isMethodQR}
//                   setIsMethodQR={setIsMethodQR}
//                   onSuccess={() => setPaymentStatus("success")}
//                   onFailure={() => setPaymentStatus("failed")}
//                 />
//               )}
//             </>
//           )}
//         </div>
//       </div>
//     </main>
//   );
// }
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { CheckoutType } from "../components/CheckoutTypes";
import { ProductPage } from "../components/ProductPage";
import CustomerForm from "../components/CustomerForm";
import StandardCheckout from "@/components/StandardCheckout";
import CustomCheckout from "@/components/CustomCheckout";
import S2SCheckout from "@/components/S2SCheckout";
import { PaymentMethodSelector } from "@/components/PaymentMethodSelector";
import { ProductSelection } from "@/components/ProductSelection";
import { ChevronDown, ArrowLeft } from "lucide-react";
import {
  setCardFormData,
  setUPIFormData,
  setEmandateFormData,
} from "@/services/paymentData";
import Link from "next/link";

const regions = [
  { id: "India", name: "India", flag: "🇮🇳" },
  { id: "Malaysia", name: "Malaysia", flag: "🇲🇾" },
  { id: "Singapore", name: "Singapore", flag: "🇸🇬" },
];

export default function Home() {
  const router = useRouter();

  const [step, setStep] = useState<number>(0);

  useEffect(() => {
    if (router.isReady) {
      const queryStep = Number(router.query.step);
      if (!isNaN(queryStep) && queryStep !== step) {
        setStep(queryStep);
      } else if (isNaN(queryStep) && step !== 0) {
        setStep(0);
      }
    }
  }, [router.isReady, router.query.step]);

  const updateStep = (newStep: number) => {
    setStep(newStep);
    router.push(
      {
        pathname: router.pathname,
        query: { ...router.query, step: newStep },
      },
      undefined,
      { shallow: true }
    );
  };

  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [selectedCheckout, setSelectedCheckout] = useState<string | null>(null);

  const [selectedRegion, setSelectedRegion] = useState<string>("Malaysia");
  const [isRegionOpen, setIsRegionOpen] = useState(false);

  const [customerId, setCustomerId] = useState<string | null>(null);
  const [customerData, setCustomerData] = useState<any>(null);

  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  const [paymentStatus, setPaymentStatus] = useState<
    "idle" | "pending" | "success" | "failed"
  >("idle");

  const [isMethodQR, setIsMethodQR] = useState<boolean>(false);

  const handleBack = () => {
    if (step === 0) return;
    router.back();
  };

  return (
    <main className="h-screen w-screen bg-gradient-to-br from-[#0a0e27] via-[#1a2847] to-[#0d1424] text-white relative overflow-hidden">
      {/* NAVBAR */}
      <div className="fixed top-0 left-0 w-full h-20 flex items-center justify-between px-8 z-50 backdrop-blur-lg">
        {/* Logo */}
        <Link href="/">
          <img
            src="https://rzp-1415-prod-dashboard-activation.s3.ap-south-1.amazonaws.com/org_KjWRtYXwpK6VfK/main_logo/phpnbPHOI"
            width="170"
            height="35"
            alt="brand-logo"
          />
        </Link>

        {/* Region Selector */}
        <div className="relative">
          <button
            onClick={() => setIsRegionOpen(!isRegionOpen)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 backdrop-blur-md transition"
          >
            <span className="text-xl">
              {regions.find((r) => r.id === selectedRegion)?.flag}
            </span>
            <span className="font-medium">{selectedRegion}</span>
            <ChevronDown
              className={`w-4 h-4 transition-transform ${isRegionOpen ? "rotate-180" : ""
                }`}
            />
          </button>

          {isRegionOpen && (
            <div className="absolute top-full mt-2 right-0 w-48 rounded-xl bg-[#1e293b]/90 border border-white/10 backdrop-blur-xl shadow-2xl">
              {regions.map((region) => (
                <button
                  key={region.id}
                  onClick={() => {
                    setSelectedRegion(region.id);
                    setIsRegionOpen(false);
                    setSelectedMethod(null);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 text-left ${selectedRegion === region.id ? "bg-white/10" : ""
                    }`}
                >
                  <span className="text-xl">{region.flag}</span>
                  <span>{region.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Back Button */}
      {step > 0 && (
        <button
          onClick={handleBack}
          className="fixed top-24 left-6 z-40 flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 backdrop-blur-md transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
      )}

      {/* SCROLLABLE CONTENT */}
      <div className="h-full w-full overflow-y-auto pt-28 px-4 sm:px-8 flex justify-center">
        <div className="w-full max-w-6xl">
          {step === 0 && (
            <ProductSelection
              onSelect={(product) => {
                setSelectedProduct(product);
                updateStep(1);
              }}
            />
          )}

          {step === 1 && (
            <ProductPage
              onBuy={(amount, title) => {
                setCardFormData({ amount, notes: { title } });
                setUPIFormData({ amount, notes: { title } });
                setEmandateFormData({ amount, notes: { title } });
                updateStep(2);
              }}
            />
          )}

          {step === 2 && (
            <CheckoutType
              onSelect={(val) => {
                setSelectedCheckout(val);
                updateStep(3);
              }}
            />
          )}

          {step === 3 && (
            <CustomerForm
              showSkip={selectedProduct === "one-time"}
              onNext={(custId, data) => {
                setCustomerId(custId);
                setCustomerData(data);
                if (
                  selectedProduct === "one-time" &&
                  selectedCheckout === "Standard Checkout"
                ) {
                  setSelectedMethod("standard");
                  updateStep(5);
                } else {
                  updateStep(4);
                }
              }}
            />
          )}

          {step === 4 && (
            <PaymentMethodSelector
              region={selectedRegion}
              productType={selectedProduct}
              selectedCheckout={selectedCheckout}
              onSelect={({ method }) => {
                setSelectedMethod(method);
                updateStep(5);
              }}
            />
          )}

          {step === 5 && selectedMethod && selectedCheckout && (
            <>
              {selectedCheckout === "Standard Checkout" && (
                <StandardCheckout
                  customerId={customerId}
                  customerData={customerData}
                  selectedProduct={selectedProduct}
                  selectedMethod={selectedMethod}
                  paymentStatus={paymentStatus}
                  setPaymentStatus={setPaymentStatus}
                  isMethodQR={isMethodQR}
                  setIsMethodQR={setIsMethodQR}
                  onSuccess={() => setPaymentStatus("success")}
                  onFailure={() => setPaymentStatus("failed")}
                />
              )}

              {selectedCheckout === "Custom Checkout" && (
                <CustomCheckout
                  customerId={customerId}
                  customerData={customerData}
                  selectedProduct={selectedProduct}
                  selectedMethod={selectedMethod}
                  paymentStatus={paymentStatus}
                  setPaymentStatus={setPaymentStatus}
                  isMethodQR={isMethodQR}
                  setIsMethodQR={setIsMethodQR}
                  onSuccess={() => setPaymentStatus("success")}
                  onFailure={() => setPaymentStatus("failed")}
                />
              )}

              {selectedCheckout === "S2S Checkout" && (
                <S2SCheckout
                  customerId={customerId}
                  customerData={customerData}
                  selectedProduct={selectedProduct}
                  selectedMethod={selectedMethod}
                  paymentStatus={paymentStatus}
                  setPaymentStatus={setPaymentStatus}
                  isMethodQR={isMethodQR}
                  setIsMethodQR={setIsMethodQR}
                  onSuccess={() => setPaymentStatus("success")}
                  onFailure={() => setPaymentStatus("failed")}
                />
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
}
