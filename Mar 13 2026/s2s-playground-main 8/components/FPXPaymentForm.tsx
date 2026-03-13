"use client";
import React, { useState, useEffect } from "react";
import {
  getFPXFormData,
  setFPXFormData,
  FPXFormData,
  FPX_LOGOS,
} from "../services/paymentData";
import { fetchMethod } from "@/services/razorpayService";
import BankLogoDropdown from "./DropdownBanksProps";
import DropdownBanks from "./DropdownBanksProps";

interface PaymentFormProps {
  onSubmit: (data: FPXFormData) => void;
  selectedCheckout: string;
  selectedProduct: string | null;
}

const FPXPaymentForm: React.FC<PaymentFormProps> = ({
  onSubmit,
  selectedCheckout,
  selectedProduct,
}) => {
  const [localFPXFormData, setLocalFPXFormData] = useState<FPXFormData>(
    getFPXFormData()
  );

  const [alertMessage, setAlertMessage] = useState("");

  const [noteKey, setNoteKey] = useState("");
  const [noteValue, setNoteValue] = useState("");
  const [fpxBanks, setFpxBanks] = useState<
    {
      bankCode: string;
      name: string;
    }[]
  >([]);

  // ✅ Wallet states

  // ✅ Fetch supported wallets
  useEffect(() => {
    const loadMethods = async () => {
      try {
        const data = await fetchMethod();

        const fpx = data?.fpx;
        if (!fpx) return;

        const banks = Object.entries(fpx).map(([bankCode, name]: any) => ({
          bankCode,
          name,
        }));

        setFpxBanks(banks);
      } catch (err) {}
    };

    loadMethods();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    let filteredValue: string | number = value;

    if (name === "amount" || name === "max_amount") {
      filteredValue = parseInt(value.replace(/\D/g, "") || "0", 10);
    }

    const updated = { ...localFPXFormData, [name]: filteredValue };

    setLocalFPXFormData(updated);
    setFPXFormData(updated);
  };

  // ✅ Notes
  const handleAddNote = () => {
    if (!noteKey || !noteValue) return;

    const updated = {
      ...localFPXFormData,
      notes: {
        ...(localFPXFormData.notes || {}),
        [noteKey]: noteValue,
      },
    };

    setLocalFPXFormData(updated);
    setFPXFormData(updated);

    setNoteKey("");
    setNoteValue("");
  };

  const handleRemoveNote = (key: string) => {
    const updatedNotes = { ...localFPXFormData.notes };
    delete updatedNotes[key];

    const updated = { ...localFPXFormData, notes: updatedNotes };
    setLocalFPXFormData(updated);
    setFPXFormData(updated);
  };

  // ✅ Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAlertMessage("");

    const updated = {
      ...localFPXFormData,
    };

    setLocalFPXFormData(updated);
    setFPXFormData(updated);

    onSubmit(updated);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#0a0e27] via-[#1a2847] to-[#0d1424] px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg rounded-3xl bg-[#1a2332]/90 backdrop-blur-2xl border border-white/10 p-7 space-y-4"
      >
        {alertMessage && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 rounded-xl text-sm">
            {alertMessage}
          </div>
        )}

        <h3 className="text-lg font-semibold text-white text-center">
          FPX Payment
        </h3>

        {/* Amount */}
        <input
          type="text"
          name="amount"
          placeholder="Amount"
          value={localFPXFormData.amount}
          onChange={handleChange}
          className="w-full rounded-xl px-4 py-3 bg-black/40 border border-white/10 text-white"
          required
        />

        {/* Receipt */}
        <input
          type="text"
          name="receipt"
          placeholder="Receipt ID"
          value={localFPXFormData.receipt}
          onChange={handleChange}
          className="w-full rounded-xl px-4 py-3 bg-black/40 border border-white/10 text-white"
          required
        />

        {/* Notes */}
        <div className="flex gap-2">
          <input
            placeholder="Note Key"
            value={noteKey}
            onChange={(e) => setNoteKey(e.target.value)}
            className="w-1/2 rounded-lg px-3 py-2 bg-black/40 border border-white/10 text-white"
          />
          <input
            placeholder="Note Value"
            value={noteValue}
            onChange={(e) => setNoteValue(e.target.value)}
            className="w-1/2 rounded-lg px-3 py-2 bg-black/40 border border-white/10 text-white"
          />
        </div>

        <button
          type="button"
          onClick={handleAddNote}
          className="w-full rounded-xl py-2 bg-white/10 hover:bg-white/20 text-white text-sm"
        >
          Add Note
        </button>

        {localFPXFormData.notes &&
          Object.entries(localFPXFormData.notes).map(([key, value]) => (
            <div
              key={key}
              className="flex justify-between text-sm text-gray-300"
            >
              <span>
                <b className="text-white">{key}</b>: {value}
              </span>
              <button
                type="button"
                onClick={() => handleRemoveNote(key)}
                className="text-red-400"
              >
                ✕
              </button>
            </div>
          ))}

        <DropdownBanks
          banks={fpxBanks}
          logos={FPX_LOGOS}
          value={localFPXFormData.bank_details.bank_code || null}
          onChange={(bank) => {
            const updated = {
              ...localFPXFormData,
              bank_details: {
                bank_code: bank.bankCode,
                bank_name: bank.name,
              },
            };

            setLocalFPXFormData(updated);
            setFPXFormData(updated);
          }}
        />

        <button
          type="submit"
          className="w-full rounded-2xl py-3 bg-gradient-to-r from-[#3b9fd9] to-[#2d7ab8] text-white font-semibold"
        >
          Pay Now
        </button>
      </form>
    </div>
  );
};

export default FPXPaymentForm;
