"use client";
import React, { useState } from "react";
import {
  getCardFormData,
  setCardFormData,
  CardFormData,
} from "../services/paymentData";

interface PaymentFormProps {
  onSubmit: (data: CardFormData) => void;
  selectedCheckout: string;
  selectedProduct: string | null;
}

const CardPaymentForm: React.FC<PaymentFormProps> = ({
  onSubmit,
  selectedCheckout,
  selectedProduct,
}) => {
  const [localCardFormData, setLocalCardFormData] = useState<CardFormData>(
    getCardFormData()
  );

  const [alertMessage, setAlertMessage] = useState("");

  // ✅ Local UI state only for notes input
  const [noteKey, setNoteKey] = useState("");
  const [noteValue, setNoteValue] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let filteredValue: string | number = value;

    switch (name) {
      case "amount":
        filteredValue = parseInt(value.replace(/\D/g, "") || "0", 10);
        break;
      case "cardHolder":
        filteredValue = value.replace(/[^a-zA-Z\s]/g, "");
        break;
      case "cardNumber":
        filteredValue = value.replace(/\D/g, "").slice(0, 16);
        break;
      case "expiryMonth":
        filteredValue = value.replace(/\D/g, "").slice(0, 2);
        break;
      case "expiryYear":
        filteredValue = value.replace(/\D/g, "").slice(0, 2);
        break;
      case "cvv":
        filteredValue = value.replace(/\D/g, "").slice(0, 3);
        break;
    }

    const updated = { ...localCardFormData, [name]: filteredValue as any };

    setLocalCardFormData(updated);
    setCardFormData(updated);
  };

  // ✅ Notes as key-value object
  const handleAddNote = () => {
    if (!noteKey || !noteValue) return;

    const updatedNotes = {
      ...(localCardFormData.notes || {}),
      [noteKey]: noteValue,
    };

    const updated = {
      ...localCardFormData,
      notes: updatedNotes,
    };

    setLocalCardFormData(updated);
    setCardFormData(updated);

    setNoteKey("");
    setNoteValue("");
  };

  const handleRemoveNote = (keyToRemove: string) => {
    const updatedNotes = { ...localCardFormData.notes };
    delete updatedNotes[keyToRemove];

    setLocalCardFormData({
      ...localCardFormData,
      notes: updatedNotes,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAlertMessage("");

    if (selectedCheckout !== "Standard Checkout") {
      if (
        Number(localCardFormData.expiryMonth) < 1 ||
        Number(localCardFormData.expiryMonth) > 12
      ) {
        setAlertMessage("Invalid expiry month. Enter between 01 and 12.");
        return;
      }
    }
    onSubmit(localCardFormData);
  };

  const isStandard = selectedCheckout === "Standard Checkout";

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

        <div className="text-center space-y-1">
          <h3 className="text-lg font-semibold text-white">
            {selectedProduct === "one-time"
              ? "Payment Details"
              : isStandard
              ? "Payment Configuration"
              : "Card & Mandate Details"}
          </h3>
          <p className="text-xs text-gray-400">
            Secure payment information — encrypted & protected
          </p>
        </div>

        {/* Amount */}
        <input
          type="text"
          name="amount"
          placeholder="Amount"
          value={localCardFormData.amount}
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

        {/* Frequency */}
        {selectedProduct !== "one-time" && (
          <input
            type="text"
            name="frequency"
            placeholder="Frequency"
            value={localCardFormData.frequency}
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
        )}

        {/* Receipt */}
        <input
          type="text"
          name="receipt"
          placeholder="Receipt ID"
          value={localCardFormData.receipt}
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

        {/* Expiry Date */}
        {selectedProduct !== "one-time" && (
          <>
            <input
              type="date"
              min={new Date().toISOString().split("T")[0]}
              value={
                localCardFormData.expire_at
                  ? new Date(localCardFormData.expire_at * 1000)
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
                  ...localCardFormData,
                  expire_at: unixTimestamp,
                };

                setLocalCardFormData(updated);
                setCardFormData(updated);
              }}
              className="
                w-full rounded-xl px-4 py-3
                bg-black/40
                border border-white/10
                text-white
                focus:outline-none focus:border-blue-500/50
              "
              required
            />

            {/* Max Amount */}
            <input
              type="text"
              name="max_amount"
              placeholder="Maximum Token Amount"
              value={localCardFormData.max_amount}
              onChange={handleChange}
              className="
                w-full rounded-xl px-4 py-3
                bg-black/40
                border border-white/10
                text-white placeholder-gray-500
              "
              required
            />
          </>
        )}

        {/* Notes */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Note Key"
            value={noteKey}
            onChange={(e) => setNoteKey(e.target.value)}
            className="
              w-1/2 rounded-lg px-3 py-2
              bg-black/40
              border border-white/10
              text-white placeholder-gray-500
            "
          />
          <input
            type="text"
            placeholder="Note Value"
            value={noteValue}
            onChange={(e) => setNoteValue(e.target.value)}
            className="
              w-1/2 rounded-lg px-3 py-2
              bg-black/40
              border border-white/10
              text-white placeholder-gray-500
            "
          />
        </div>

        <button
          type="button"
          onClick={handleAddNote}
          className="
            w-full rounded-xl py-2
            bg-white/10 hover:bg-white/20
            text-sm text-white
            transition
          "
        >
          Add Note
        </button>

        {/* Notes list */}
        {localCardFormData.notes &&
          Object.entries(localCardFormData.notes).map(([key, value]) => (
            <div
              key={key}
              className="flex justify-between items-center text-sm text-gray-300"
            >
              <span>
                <span className="text-white font-medium">{key}</span>: {value}
              </span>
              <button
                type="button"
                onClick={() => handleRemoveNote(key)}
                className="text-red-400 hover:text-red-500"
              >
                ✕
              </button>
            </div>
          ))}

        {/* Card Fields */}
        {!isStandard && (
          <>
            <input
              type="text"
              name="cardNumber"
              placeholder="Card Number"
              value={localCardFormData.cardNumber}
              onChange={handleChange}
              className="
                w-full rounded-xl px-4 py-3
                bg-black/40
                border border-white/10
                text-white placeholder-gray-500
              "
              required
            />

            <div className="flex gap-2">
              <input
                type="text"
                name="expiryMonth"
                placeholder="MM"
                value={localCardFormData.expiryMonth}
                onChange={handleChange}
                className="w-1/3 rounded-lg px-3 py-2 bg-black/40 border border-white/10 text-white"
                required
              />
              <input
                type="text"
                name="expiryYear"
                placeholder="YY"
                value={localCardFormData.expiryYear}
                onChange={handleChange}
                className="w-1/3 rounded-lg px-3 py-2 bg-black/40 border border-white/10 text-white"
                required
              />
              <input
                type="text"
                name="cvv"
                placeholder="CVV"
                value={localCardFormData.cvv}
                onChange={handleChange}
                className="w-1/3 rounded-lg px-3 py-2 bg-black/40 border border-white/10 text-white"
                required
              />
            </div>

            <input
              type="text"
              name="cardHolder"
              placeholder="Cardholder Name"
              value={localCardFormData.cardHolder}
              onChange={handleChange}
              className="
                w-full rounded-xl px-4 py-3
                bg-black/40
                border border-white/10
                text-white placeholder-gray-500
              "
              required
            />
          </>
        )}

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
          Pay Now
        </button>
      </form>
    </div>
  );
};

export default CardPaymentForm;
