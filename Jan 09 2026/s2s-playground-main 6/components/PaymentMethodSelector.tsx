"use client";
import { log } from "console";
import React, { useState } from "react";

interface PaymentMethodSelectorProps {
  onSelect: (data: { method: string; authType?: string | null }) => void;
}

export const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  onSelect,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [enableAuthType, setEnableAuthType] = useState<boolean>(false);
  const [selectedAuthType, setSelectedAuthType] = useState<string | null>(null);

  // Backend value + Frontend label
  const methods = [
    { value: "card", label: "Card" },
    { value: "upi", label: "UPI" },
    { value: "emandate", label: "emandate" },
  ];

  const authTypes = [
    { value: "netbanking", label: "Netbanking" },
    { value: "debitcard", label: "Debit Card" },
    { value: "aadhaar", label: "Aadhaar" },
  ];

  const handleSelect = (value: string) => {
    setSelectedMethod(value);
    setEnableAuthType(false);
    setSelectedAuthType("");
  };

  const handleProceed = () => {
    if (!selectedMethod) return;

    onSelect({
      method: selectedMethod, // ALWAYS clean
      authType: enableAuthType ? selectedAuthType : null, // optional
    });

    console.log("Proceeding with:", {
      method: selectedMethod,
      authType: enableAuthType ? selectedAuthType : null,
    });
  };

  return (
    <div className="container mt-8">
      <h2 className="text-xl font-semibold mb-4 text-center">
        Select Payment Method
      </h2>

      {/* Primary payment methods */}
      <div className="flex gap-8 justify-center">
        {methods.map((opt) => (
          <div
            key={opt.value}
            className={`card cursor-pointer px-6 py-4 rounded-2xl transition-all duration-300 text-center w-40
              ${
                selectedMethod === opt.value
                  ? "border-2 border-teal-400 bg-[#222]"
                  : "border border-gray-700 hover:border-teal-400 hover:bg-[#222]"
              }`}
            onClick={() => handleSelect(opt.value)}
          >
            <div className="text-4xl mb-2">
              {opt.value === "card" && "💳"}
              {opt.value === "upi" && "📱"}
              {opt.value === "emandate" && "🔒"}
            </div>
            <p className="font-medium">{opt.label}</p>
          </div>
        ))}
      </div>

      {/* eMandate Auth Type Section */}
      {selectedMethod === "emandate" && (
        <div className="mt-8 text-center">
          {/* Toggle for Auth Type */}
          <div className="flex flex-col items-center gap-2 mb-4">
            <h3 className="text-lg text-teal-400">
              Would you like to use Auth Type?
            </h3>
            <label className="flex items-center gap-3 cursor-pointer">
              <span className="text-gray-300">No</span>
              <div
                onClick={() => setEnableAuthType(!enableAuthType)}
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-all ${
                  enableAuthType ? "bg-teal-500" : "bg-gray-600"
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                    enableAuthType ? "translate-x-6" : "translate-x-0"
                  }`}
                ></div>
              </div>
              <span className="text-gray-300">Yes</span>
            </label>
          </div>

          {/* Auth Type Options */}
          {enableAuthType && (
            <div>
              <h4 className="text-md mb-3 text-gray-300">
                Select Auth Types (Multiple Allowed)
              </h4>
              <div className="flex gap-8 justify-center mb-6">
                {authTypes.map((auth) => {
                  const isSelected = selectedAuthType === auth.value;

                  return (
                    <div
                      key={auth.value}
                      className={`cursor-pointer px-6 py-3 rounded-2xl border transition-all duration-300
          ${
            isSelected
              ? "border-teal-400 bg-[#222]"
              : "border-gray-700 hover:border-teal-400 hover:bg-[#222]"
          }`}
                      onClick={() => setSelectedAuthType(auth.value)}
                    >
                      {auth.value === "netbanking" && "🏦"}
                      {auth.value === "debitcard" && "💳"}
                      {auth.value === "aadhaar" && "🪪"}
                      <p className="mt-1">{auth.label}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Summary + Proceed */}
      {selectedMethod && (
        <div className="mt-10 text-center border-t border-gray-700 pt-6">
          <h4 className="text-lg text-teal-400 mb-2">Summary</h4>

          <p className="text-gray-300 mb-1">
            <strong>Selected Method:</strong>{" "}
            {methods.find((m) => m.value === selectedMethod)?.label}
          </p>

          {selectedMethod === "emandate" && (
            <>
              <p className="text-gray-300 mb-1">
                <strong>Auth Type Enabled:</strong>{" "}
                {enableAuthType ? "Yes" : "No"}
              </p>

              {enableAuthType && selectedAuthType && (
                <p className="text-gray-300">
                  <strong>Selected Auth Type:</strong>{" "}
                  {authTypes.find((a) => a.value === selectedAuthType)?.label}
                </p>
              )}

              {enableAuthType && !selectedAuthType && (
                <p className="text-gray-400 italic">No Auth Type Selected</p>
              )}
            </>
          )}

          <button
            onClick={handleProceed}
            disabled={!selectedMethod}
            className={`mt-6 px-8 py-2 rounded-xl text-white font-medium transition-all ${
              selectedMethod
                ? "bg-teal-500 hover:bg-teal-600"
                : "bg-gray-600 cursor-not-allowed"
            }`}
          >
            Proceed
          </button>
        </div>
      )}
    </div>
  );
};
