"use client";
import React, { useState } from "react";
import {
  getEmandateFormData,
  setEmandateFormData,
  EmandateFormData,
} from "../services/paymentData";

interface PaymentFormProps {
  onSubmit: (data: EmandateFormData) => void;
  selectedCheckout: string;
}

const EmandatePaymentForm: React.FC<PaymentFormProps> = ({
  onSubmit,
  selectedCheckout,
}) => {
  const [localEmandateFormData, setLocalEmandateFormData] =
    useState<EmandateFormData>(getEmandateFormData());
  console.log("first render card form data:", localEmandateFormData);

  const [alertMessage, setAlertMessage] = useState("");

  // ✅ Local UI state only for notes input
  const [noteKey, setNoteKey] = useState("");
  const [noteValue, setNoteValue] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    console.log("name, value:", name, value);

    setLocalEmandateFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ✅ Notes as key-value object
  const handleAddNote = () => {
    if (!noteKey || !noteValue) return;

    const updatedNotes = {
      ...(localEmandateFormData.notes || {}),
      [noteKey]: noteValue,
    };

    const updated = {
      ...localEmandateFormData,
      notes: updatedNotes,
    };

    setLocalEmandateFormData(updated);
    setEmandateFormData(updated);

    setNoteKey("");
    setNoteValue("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAlertMessage("");
    console.log("emandate form data:", localEmandateFormData);
    onSubmit(localEmandateFormData);
  };

  const isStandard = selectedCheckout === "Standard Checkout";

  return (
    <div className="flex justify-center items-center bg-[#121212] min-h-screen p-5">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 max-w-md w-full p-6 bg-[#1e1e1e] border border-gray-600 rounded-lg shadow-lg"
      >
        {alertMessage && (
          <div className="text-red-500 border border-red-500 p-2 rounded mb-2">
            {alertMessage}
          </div>
        )}

        <h3 className="text-center mb-2 text-white font-semibold">
          {isStandard ? "Enter Payment Details" : "Enter Bank Account Details"}
        </h3>

        {/* Amount */}
        <input
          type="text"
          name="amount"
          placeholder="Enter amount"
          value={localEmandateFormData.amount}
          onChange={handleChange}
          className="p-3 rounded border border-gray-600 bg-[#2a2a2a] text-white"
          required
        />

        {/* Frequency */}
        <input
          type="text"
          name="frequency"
          placeholder="Enter frequency"
          value={localEmandateFormData.frequency}
          onChange={handleChange}
          className="p-3 rounded border border-gray-600 bg-[#2a2a2a] text-white"
          required
        />

        {/* Receipt */}
        <input
          type="text"
          name="receipt"
          placeholder="Enter receipt"
          value={localEmandateFormData.receipt}
          onChange={handleChange}
          className="p-3 rounded border border-gray-600 bg-[#2a2a2a] text-white"
          required
        />

        {/* Expire At (Future Date Only) */}
        <input
          type="date"
          min={new Date().toISOString().split("T")[0]} // ✅ disables past dates
          value={
            localEmandateFormData.expire_at
              ? new Date(localEmandateFormData.expire_at * 1000)
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
              ...localEmandateFormData,
              expire_at: unixTimestamp,
            };

            setLocalEmandateFormData(updated);
            setEmandateFormData(updated);
          }}
          className="p-3 rounded border border-gray-600 bg-[#2a2a2a] text-white"
          required
        />

        {/* Max amount */}
        <input
          type="text"
          name="max_amount"
          placeholder="Enter token max amount"
          value={localEmandateFormData.max_amount}
          onChange={handleChange}
          className="p-3 rounded border border-gray-600 bg-[#2a2a2a] text-white"
          required
        />

        {/* ✅ Notes Key-Value */}
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
        {localEmandateFormData.notes &&
          Object.entries(localEmandateFormData.notes).map(([key, value]) => (
            <div key={key} className="text-sm text-gray-300">
              <strong>{key}:</strong> {value}
            </div>
          ))}

        {!isStandard && (
          <>
            <input
              type="text"
              name="beneficiary_name"
              placeholder="Beneficiary Name"
              value={localEmandateFormData.beneficiary_name}
              onChange={handleChange}
              className="p-3 rounded border border-gray-600 bg-[#2a2a2a] text-white"
              required
            />

            <div className="flex gap-2">
              <input
                type="text"
                name="account_number"
                placeholder="Account Number"
                value={localEmandateFormData.account_number}
                onChange={handleChange}
                className="w-1/3 p-2 rounded border border-gray-600 bg-[#2a2a2a] text-white"
                required
              />
              <select
                name="account_type"
                value={localEmandateFormData.account_type}
                onChange={handleChange}
                className="w-1/3 p-2 rounded border border-gray-600 bg-[#2a2a2a] text-white"
                required
              >
                <option value="savings">Savings</option>
                <option value="current">Current</option>
              </select>

              <input
                type="text"
                name="ifsc_code"
                placeholder="IFSC Code"
                value={localEmandateFormData.ifsc_code}
                onChange={handleChange}
                className="w-1/3 p-2 rounded border border-gray-600 bg-[#2a2a2a] text-white"
                required
              />
            </div>
          </>
        )}

        <button
          type="submit"
          className="p-3 rounded bg-blue-600 hover:bg-blue-700 text-white font-medium"
        >
          Pay Now
        </button>
      </form>
    </div>
  );
};

export default EmandatePaymentForm;
