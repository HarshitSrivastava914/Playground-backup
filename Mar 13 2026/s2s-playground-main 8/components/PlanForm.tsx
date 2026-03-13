"use client";
import React, { useState } from "react";
import {
  getPlanFormData,
  setPlanFormData,
  PlanFormData,
} from "../services/paymentData";

interface PaymentFormProps {
  onSubmit: (data: PlanFormData) => void;
  selectedCheckout: string;
  selectedProduct: string | null;
}

const PlanForm: React.FC<PaymentFormProps> = ({
  onSubmit,
  selectedCheckout,
  selectedProduct,
}) => {
  const [localPlanFormData, setLocalPlanFormData] = useState<PlanFormData>(
    getPlanFormData()
  );

  const [alertMessage, setAlertMessage] = useState("");

  // ✅ Local UI state only for notes input
  const [noteKey, setNoteKey] = useState("");
  const [noteValue, setNoteValue] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let filteredValue: string | number = value;

    const updated = { ...localPlanFormData, [name]: filteredValue as any };

    setLocalPlanFormData(updated);
    setPlanFormData(updated);
  };

  // ✅ Notes as key-value object
  const handleAddNote = () => {
    if (!noteKey || !noteValue) return;

    const updatedNotes = {
      ...(localPlanFormData.notes || {}),
      [noteKey]: noteValue,
    };

    const updated = {
      ...localPlanFormData,
      notes: updatedNotes,
    };

    setLocalPlanFormData(updated);
    setPlanFormData(updated);

    setNoteKey("");
    setNoteValue("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAlertMessage("");
    onSubmit(localPlanFormData);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#0a0e27] via-[#1a2847] to-[#0d1424] px-4">
      <form
        onSubmit={handleSubmit}
        className="
          w-full max-w-lg
          rounded-3xl
          bg-[#1a2332]/90
          backdrop-blur-2xl
          border border-white/10
          shadow-[0_20px_60px_rgba(0,0,0,0.6)]
          p-7
          space-y-4
        "
      >
        {alertMessage && (
          <div className="rounded-xl bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-300">
            {alertMessage}
          </div>
        )}

        {/* Period */}
        <input
          type="text"
          name="period"
          placeholder="Period"
          value={localPlanFormData.period}
          onChange={handleChange}
          className="
            w-full rounded-xl px-4 py-3
            bg-black/40
            border border-white/10
            text-white placeholder-gray-500
            focus:outline-none focus:border-blue-500/50
          "
          required
        />

        {/* Interval */}
        <input
          type="text"
          name="interval"
          placeholder="Interval"
          value={localPlanFormData.interval}
          onChange={handleChange}
          className="
            w-full rounded-xl px-4 py-3
            bg-black/40
            border border-white/10
            text-white placeholder-gray-500
            focus:outline-none focus:border-blue-500/50
          "
          required
        />

        {/* Name */}
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={localPlanFormData.item.name}
          onChange={handleChange}
          className="
            w-full rounded-xl px-4 py-3
            bg-black/40
            border border-white/10
            text-white placeholder-gray-500
            focus:outline-none focus:border-blue-500/50
          "
          required
        />

        {/* Amount */}
        <input
          type="text"
          name="amount"
          placeholder="Amount"
          value={localPlanFormData.item.amount}
          onChange={handleChange}
          className="
            w-full rounded-xl px-4 py-3
            bg-black/40
            border border-white/10
            text-white placeholder-gray-500
            focus:outline-none focus:border-blue-500/50
          "
          required
        />

        {/* Currency */}
        <input
          type="text"
          name="currency"
          placeholder="Currency"
          value={localPlanFormData.item.currency}
          onChange={handleChange}
          className="
            w-full rounded-xl px-4 py-3
            bg-black/40
            border border-white/10
            text-white placeholder-gray-500
            focus:outline-none focus:border-blue-500/50
          "
          required
        />

        {/* Description */}
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={localPlanFormData.item.description}
          onChange={handleChange}
          className="
            w-full rounded-xl px-4 py-3
            bg-black/40
            border border-white/10
            text-white placeholder-gray-500
            focus:outline-none focus:border-blue-500/50
          "
        />

        <button
          type="submit"
          className="
            mt-2 w-full rounded-2xl py-3
            bg-gradient-to-r from-[#3b9fd9] to-[#2d7ab8]
            hover:opacity-90
            text-white font-semibold
            shadow-lg shadow-blue-600/30
            transition
          "
        >
          Proceed to Create Subscription
        </button>
      </form>
    </div>
  );
};

export default PlanForm;
