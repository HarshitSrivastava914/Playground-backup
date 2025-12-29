"use client";
import React, { useEffect, useState } from "react";
import { isMobileDevice } from "@/services/isMobileDevice";
import { createPayment, generateQR } from "@/services/razorpayService";
import { get } from "http";
import { getUPIFormData, UPIFormData } from "@/services/paymentData";

interface UPIPaymentFormProps {
  onSubmit: (data: {
    amount: number;
    method: "upi";
    flow: "collect" | "intent" | "qr";
    vpa?: string;
  }) => void;
  selectedCheckout: string;
  setIsMethodQR: (value: boolean) => void;
}

export const UPIPaymentForm: React.FC<UPIPaymentFormProps> = ({
  onSubmit,
  selectedCheckout,
  setIsMethodQR,
}) => {
  const [localUPIFormData, setLocalUPIFormData] = useState<UPIFormData>({
    ...getUPIFormData(),
  });

  // --------------------------------------------------------------
  // DESKTOP → Auto Trigger Intent Flow + Generate QR
  // --------------------------------------------------------------

  const [alertMessage, setAlertMessage] = useState("");

  const isMobile = isMobileDevice(); // 📌 Device detection

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    let finalValue = value;

    if (name === "amount") {
      finalValue = value.replace(/\D/g, "");
    }

    setLocalUPIFormData((prev) => ({
      ...prev,
      [name]: finalValue,
    }));
  };

  const handleFlowSelect = (flow: "collect" | "intent" | "qr") => {
    setLocalUPIFormData((prev) => ({
      ...prev,
      flow,
    }));
  };

  const handleSubmit = () => {
    setAlertMessage("");
    console.log("localData:", localUPIFormData);
    ``;

    if (!localUPIFormData.flow) {
      setAlertMessage("Please select a UPI flow.");
      return;
    }

    if (!localUPIFormData.amount || Number(localUPIFormData.amount) <= 0) {
      setAlertMessage("Please enter a valid amount.");
      return;
    }

    if (localUPIFormData.flow === "collect" && !localUPIFormData.vpa?.trim()) {
      setAlertMessage("Please enter a valid UPI ID (VPA).");
      return;
    }

    onSubmit({
      amount: Number(localUPIFormData.amount),
      method: "upi",
      flow: localUPIFormData.flow,
      vpa:
        localUPIFormData.flow === "collect"
          ? localUPIFormData.vpa!.trim() // safe because validated above
          : undefined,
    });
  };

  return (
    <div className="mt-6 p-6 rounded-2xl border border-gray-700 bg-[#111]">
      <h2 className="text-xl font-semibold mb-4 text-center text-teal-400">
        Pay Using UPI
      </h2>

      {alertMessage && (
        <div className="text-red-500 border border-red-500 p-2 rounded mb-4">
          {alertMessage}
        </div>
      )}

      {/* Amount Field */}
      <div className="mb-5">
        <label className="text-gray-300 mb-2 block">Enter Amount</label>
        <input
          type="text"
          name="amount"
          placeholder="Amount"
          className="px-4 py-3 rounded-lg bg-[#222] border border-gray-700 text-white w-full"
          value={localUPIFormData.amount}
          onChange={handleChange}
        />
      </div>

      {/* Frequency Field */}
      <div className="mb-5">
        <label className="text-gray-300 mb-2 block">Enter Frequency</label>
        <input
          type="text"
          name="frequency"
          placeholder="Enter frequency"
          value={localUPIFormData.frequency}
          onChange={handleChange}
          className="px-4 py-3 rounded-lg bg-[#222] border border-gray-700 text-white w-full"
          required
        />
      </div>

      {/* Flow Selection Buttons */}
      <div className="flex justify-center gap-6 mb-6">
        {/* Collect Flow - always visible */}
        <button
          className={`px-6 py-3 rounded-xl border transition-all
            ${
              localUPIFormData.flow === "collect"
                ? "border-teal-400 bg-[#222]"
                : "border-gray-700 hover:bg-[#1a1a1a]"
            }`}
          onClick={() => handleFlowSelect("collect")}
        >
          UPI Collect (VPA)
        </button>

        {/* Intent Flow - only visible on mobile */}
        {isMobile ? (
          <button
            className={`px-6 py-3 rounded-xl border transition-all
              ${
                localUPIFormData.flow === "intent"
                  ? "border-teal-400 bg-[#222]"
                  : "border-gray-700 hover:bg-[#1a1a1a]"
              }`}
            onClick={() => handleFlowSelect("intent")}
          >
            UPI Intent
          </button>
        ) : (
          <button
            className="px-6 py-3 rounded-xl border border-gray-700 bg-[#1a1a1a80] cursor-not-allowed text-gray-500"
            disabled
          >
            UPI Intent (Mobile Only)
          </button>
        )}

        <button
          className={`px-6 py-3 rounded-xl border transition-all
    ${
      localUPIFormData.flow === "intent"
        ? "border-teal-400 bg-[#222]"
        : "border-gray-700 hover:bg-[#1a1a1a]"
    }`}
          onClick={() => {
            handleFlowSelect("intent");
            setIsMethodQR(true); // ✅ Set to TRUE when this button is clicked
          }}
        >
          Pay with QR
        </button>
      </div>

      {/* Show message on laptop */}
      {!isMobile && (
        <p className="text-yellow-400 text-center mb-4">
          ⚠️ UPI Intent works only on mobile devices. Please switch to a mobile
          device.
        </p>
      )}

      {/* VPA Input - Only For Collect */}
      {localUPIFormData.flow === "collect" && (
        <div className="flex flex-col mb-6">
          <label className="text-gray-300 mb-2">Enter UPI ID (VPA)</label>
          <input
            type="text"
            name="vpa"
            placeholder="example@upi"
            className="px-4 py-2 rounded-lg bg-[#222] border border-gray-700 text-white"
            value={localUPIFormData.vpa}
            onChange={handleChange}
          />
        </div>
      )}

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        className={`w-full py-3 rounded-xl text-white mt-4
          ${
            localUPIFormData.flow
              ? "bg-teal-500 hover:bg-teal-600"
              : "bg-gray-700 cursor-not-allowed"
          }`}
      >
        Pay Now
      </button>
    </div>
  );
};
