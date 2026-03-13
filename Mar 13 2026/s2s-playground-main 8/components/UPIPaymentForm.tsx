"use client";
import React, { useEffect, useState } from "react";
import { isMobileDevice } from "@/services/isMobileDevice";
import { createPayment, generateQR } from "@/services/razorpayService";
import { get } from "http";
import {
  getUPIFormData,
  setUPIFormData,
  UPIFormData,
} from "@/services/paymentData";

interface UPIPaymentFormProps {
  onSubmit: (data: UPIFormData) => void;
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
  const [noteKey, setNoteKey] = useState("");
  const [noteValue, setNoteValue] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    let finalAmountValue = value;

    if (name === "amount") {
      finalAmountValue = value.replace(/\D/g, "");
    }

    setLocalUPIFormData((prev) => ({
      ...prev,
      [name]: finalAmountValue,
    }));
  };

  const handleFlowSelect = (flow: "collect" | "intent" | "qr") => {
    setLocalUPIFormData((prev) => ({
      ...prev,
      flow,
    }));
  };
  const handleAddNote = () => {
    if (!noteKey || !noteValue) return;

    const updatedNotes = {
      ...(localUPIFormData.notes || {}),
      [noteKey]: noteValue,
    };

    const updated = {
      ...localUPIFormData,
      notes: updatedNotes,
    };

    setLocalUPIFormData(updated);
    setUPIFormData(updated);

    setNoteKey("");
    setNoteValue("");
  };

  const handleRemoveNote = (keyToRemove: string) => {
    const updatedNotes = { ...localUPIFormData.notes };
    delete updatedNotes[keyToRemove];

    setLocalUPIFormData({
      ...localUPIFormData,
      notes: updatedNotes,
    });
  };
  const handleSubmit = () => {
    setAlertMessage("");

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

    onSubmit(localUPIFormData);
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <div className="mt-6 p-6 rounded-2xl border max-w-md w-full h-auto max-h-[calc(100vh-40px)] overflow-y-auto">
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

        <div className="mb-5">
          <label className="text-gray-300 mb-2 block">
            Enter token max amount{" "}
          </label>
          <input
            type="text"
            name="max_amount"
            placeholder="Enter token max amount"
            value={localUPIFormData.max_amount}
            onChange={handleChange}
            className="px-4 py-3 rounded-lg bg-[#222] border border-gray-700 text-white w-full"
            required
          />
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Notes Key"
            value={noteKey}
            onChange={(e) => setNoteKey(e.target.value)}
            className="w-1/2 p-2 rounded border border-gray-600 bg-[#2a2a2a] text-white"
          />
          <input
            type="text"
            placeholder="Notes Value"
            value={noteValue}
            onChange={(e) => setNoteValue(e.target.value)}
            className="w-1/2 p-2 rounded border border-gray-600 bg-[#2a2a2a] text-white"
          />
        </div>

        <button
          type="button"
          onClick={handleAddNote}
          className="p-2 rounded bg-gray-700 hover:bg-gray-600 text-white"
        >
          Add Note
        </button>

        {/* Show existing notes */}
        {localUPIFormData.notes &&
          Object.entries(localUPIFormData.notes).map(([key, value]) => (
            <div key={key} className="text-sm text-gray-300">
              <strong>{key}:</strong> {value}
              <button
                type="button"
                onClick={() => handleRemoveNote(key)}
                className="text-red-400 hover:text-red-500 ml-3"
                title="Remove note"
              >
                ❌
              </button>
            </div>
          ))}
        <input
          type="text"
          name="receipt"
          placeholder="Enter receipt"
          value={localUPIFormData.receipt}
          onChange={handleChange}
          className="p-3 rounded border border-gray-600 bg-[#2a2a2a] text-white"
          required
        />
        <input
          type="date"
          min={new Date().toISOString().split("T")[0]} // ✅ disables past dates
          value={
            localUPIFormData.expire_at
              ? new Date(localUPIFormData.expire_at * 1000)
                  .toISOString()
                  .split("T")[0]
              : ""
          }
          onChange={(e) => {
            const selectedDate = e.target.value;

            const unixTimestamp = selectedDate
              ? Math.floor(new Date(selectedDate).getTime() / 1000)
              : undefined;

            const updated = {
              ...localUPIFormData,
              expire_at: unixTimestamp,
            };

            setLocalUPIFormData(updated);
            setUPIFormData(updated);
          }}
          className="p-3 rounded border border-gray-600 bg-[#2a2a2a] text-white"
          required
        />

        <div className="mb-5">
          <label className="text-gray-300 mb-2 block">
            Enter token recurring type
          </label>

          <select
            name="recurring_type"
            value={localUPIFormData.recurring_type}
            onChange={handleChange}
            className="px-4 py-3 rounded-lg bg-[#222] border border-gray-700 text-white w-full"
            required
          >
            <option value="" disabled>
              Select recurring type
            </option>
            <option value="on">on</option>
            <option value="after">after</option>
            <option value="before">before</option>
          </select>
        </div>

        <div className="mb-5">
          <label className="text-gray-300 mb-2 block">
            Enter token recurring value{" "}
          </label>
          <input
            type="text"
            name="recurring_value"
            placeholder="Enter token recurring value"
            value={localUPIFormData.recurring_value}
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

          {!isMobile ? (
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
          ) : (
            <button
              className="px-6 py-3 rounded-xl border border-gray-700 bg-[#1a1a1a80] cursor-not-allowed text-gray-500"
              disabled
            >
              UPI QR (Non Mobile Only)
            </button>
          )}

          {/* <button
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
        </button> */}
        </div>

        {/* Show message on laptop */}
        {!isMobile && (
          <p className="text-yellow-400 text-center mb-4">
            ⚠️ UPI Intent works only on mobile devices. Please switch to a
            mobile device.
          </p>
        )}

        {isMobile && (
          <p className="text-yellow-400 text-center mb-4">
            ⚠️ UPI QR works only on non mobile devices. Please switch to a non
            mobile device.
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

        {localUPIFormData.flow === "intent" && isMobile && (
          <p className="text-green-400 text-center mb-4">
            ✅ UPI Intent will be triggered on submission.
          </p>
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
    </div>
  );
};
