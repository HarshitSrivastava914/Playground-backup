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
}

const CardPaymentForm: React.FC<PaymentFormProps> = ({
  onSubmit,
  selectedCheckout,
}) => {
  const [localCardFormData, setLocalCardFormData] = useState<CardFormData>(
    getCardFormData()
  );
  console.log("first render card form data:", localCardFormData);

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
    console.log("card form data:", localCardFormData);
    onSubmit(localCardFormData);
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
          {isStandard ? "Enter Payment Details" : "Enter Card Details"}
        </h3>

        {/* Amount */}
        <input
          type="text"
          name="amount"
          placeholder="Enter amount"
          value={localCardFormData.amount}
          onChange={handleChange}
          className="p-3 rounded border border-gray-600 bg-[#2a2a2a] text-white"
          required
        />

        {/* Frequency */}
        <input
          type="text"
          name="frequency"
          placeholder="Enter frequency"
          value={localCardFormData.frequency}
          onChange={handleChange}
          className="p-3 rounded border border-gray-600 bg-[#2a2a2a] text-white"
          required
        />

        {/* Receipt */}
        <input
          type="text"
          name="receipt"
          placeholder="Enter receipt"
          value={localCardFormData.receipt}
          onChange={handleChange}
          className="p-3 rounded border border-gray-600 bg-[#2a2a2a] text-white"
          required
        />

        {/* Expire At (Future Date Only) */}
        <input
          type="date"
          min={new Date().toISOString().split("T")[0]} // ✅ disables past dates
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
          className="p-3 rounded border border-gray-600 bg-[#2a2a2a] text-white"
          required
        />

        {/* Max amount */}
        <input
          type="text"
          name="max_amount"
          placeholder="Enter token max amount"
          value={localCardFormData.max_amount}
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
        {localCardFormData.notes &&
          Object.entries(localCardFormData.notes).map(([key, value]) => (
            <div key={key} className="text-sm text-gray-300">
              <strong>{key}:</strong> {value}
            </div>
          ))}

        {/* Card fields */}
        {!isStandard && (
          <>
            <input
              type="text"
              name="cardNumber"
              placeholder="Card Number"
              value={localCardFormData.cardNumber}
              onChange={handleChange}
              className="p-3 rounded border border-gray-600 bg-[#2a2a2a] text-white"
              required
            />

            <div className="flex gap-2">
              <input
                type="text"
                name="expiryMonth"
                placeholder="MM"
                value={localCardFormData.expiryMonth}
                onChange={handleChange}
                className="w-1/3 p-2 rounded border border-gray-600 bg-[#2a2a2a] text-white"
                required
              />
              <input
                type="text"
                name="expiryYear"
                placeholder="YY"
                value={localCardFormData.expiryYear}
                onChange={handleChange}
                className="w-1/3 p-2 rounded border border-gray-600 bg-[#2a2a2a] text-white"
                required
              />
              <input
                type="text"
                name="cvv"
                placeholder="CVV"
                value={localCardFormData.cvv}
                onChange={handleChange}
                className="w-1/3 p-2 rounded border border-gray-600 bg-[#2a2a2a] text-white"
                required
              />
            </div>

            <input
              type="text"
              name="cardHolder"
              placeholder="Cardholder Name"
              value={localCardFormData.cardHolder}
              onChange={handleChange}
              className="p-3 rounded border border-gray-600 bg-[#2a2a2a] text-white"
              required
            />
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

export default CardPaymentForm;
