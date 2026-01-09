/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckoutType } from "../components/CheckoutTypes";
import { ProductPage } from "../components/ProductPage";
import CustomerForm from "../components/CustomerForm";
import StandardCheckout from "@/components/StandardCheckout";
import CustomCheckout from "@/components/CustomCheckout";
import S2SCheckout from "@/components/S2SCheckout";
import { PaymentMethodSelector } from "@/components/PaymentMethodSelector";

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [step, setStep] = useState<number>(
    Number(searchParams.get("step") || 1)
  );
  const [selectedCheckout, setSelectedCheckout] = useState<string | null>(null);

  const [customerId, setCustomerId] = useState<string | null>(null);
  const [customerData, setCustomerData] = useState<any>(null);
  const [paymentStatus, setPaymentStatus] = useState<
    "idle" | "pending" | "success" | "failed"
  >("idle");
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [selectedAuthType, setSelectedAuthType] = useState<string | null>(null);

  const [isMethodQR, setIsMethodQR] = useState<boolean>(false);

  // Sync step with URL
  useEffect(() => {
    const stepFromUrl = Number(searchParams.get("step") || 1);
    if (stepFromUrl !== step) setStep(stepFromUrl);
  }, [searchParams]);

  // Navigation helper
  const goToStep = (newStep: number) => {
    router.push(`/?step=${newStep}`, { scroll: false });
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#121212] text-white">
      <div className="p-6 bg-[#1e1e1e] shadow-lg rounded-2xl max-w-xl w-full">
        {/* Step 1: Product Page */}
        {step === 1 && <ProductPage onBuy={() => goToStep(2)} />}

        {/* Step 2: Checkout Type */}
        {step === 2 && (
          <CheckoutType
            onSelect={(val) => {
              setSelectedCheckout(val);
              goToStep(3);
            }}
          />
        )}

        {/* Step 3: Customer Form */}
        {step === 3 && (
          <CustomerForm
            onNext={(custId, data) => {
              setCustomerId(custId);
              setCustomerData(data);
              goToStep(4);
            }}
          />
        )}

        {step === 4 && (
          <PaymentMethodSelector
            onSelect={({ method, authType }) => {
              setSelectedMethod(method);
              setSelectedAuthType(authType ?? null);
              goToStep(5);
            }}
          />
        )}

        {/* Step 4: Checkout Handling */}
        {step === 5 && (
          <>
            {selectedCheckout === "Standard Checkout" &&
              customerId &&
              selectedMethod && (
                <StandardCheckout
                  customerId={customerId}
                  customerData={customerData}
                  onSuccess={() => {
                    console.log("✅ Payment Success in Standard Checkout");
                    setPaymentStatus("success");
                  }}
                  onFailure={() => setPaymentStatus("failed")}
                  paymentStatus={paymentStatus}
                  setPaymentStatus={setPaymentStatus}
                  selectedMethod={selectedMethod}
                  isMethodQR={isMethodQR}
                  setIsMethodQR={setIsMethodQR}
                />
              )}

            {selectedCheckout === "Custom Checkout" &&
              customerId &&
              selectedMethod && (
                <CustomCheckout
                  customerId={customerId}
                  customerData={customerData}
                  onSuccess={() => {
                    console.log("✅ Payment Success in S2S");
                    setPaymentStatus("success");
                  }}
                  onFailure={() => setPaymentStatus("failed")}
                  paymentStatus={paymentStatus} // ✅ Pass down
                  setPaymentStatus={setPaymentStatus} // ✅ Pass down
                  selectedMethod={selectedMethod}
                  isMethodQR={isMethodQR}
                  setIsMethodQR={setIsMethodQR}
                />
              )}

            {selectedCheckout === "S2S Checkout" &&
              customerId &&
              selectedMethod !== null && (
                <S2SCheckout
                  customerId={customerId}
                  customerData={customerData}
                  onSuccess={() => {
                    console.log("✅ Payment Success in S2S");
                    setPaymentStatus("success");
                  }}
                  onFailure={() => setPaymentStatus("failed")}
                  paymentStatus={paymentStatus} // ✅ Pass down
                  setPaymentStatus={setPaymentStatus} // ✅ Pass down
                  selectedMethod={selectedMethod}
                  isMethodQR={isMethodQR}
                  setIsMethodQR={setIsMethodQR}
                />
              )}
          </>
        )}
      </div>
    </main>
  );
}
