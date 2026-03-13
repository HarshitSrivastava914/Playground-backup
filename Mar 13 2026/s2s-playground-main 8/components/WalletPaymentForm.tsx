"use client";
import React, { useState, useEffect } from "react";
import {
  getWalletFormData,
  setWalletFormData,
  WalletFormData,
} from "../services/paymentData";
import { fetchMethod } from "@/services/razorpayService";
import { WALLET_LOGOS } from "@/services/paymentData";

interface PaymentFormProps {
  onSubmit: (data: WalletFormData) => void;
  selectedCheckout: string;
  selectedProduct: string | null;
}

const WalletPaymentForm: React.FC<PaymentFormProps> = ({
  onSubmit,
  selectedCheckout,
  selectedProduct,
}) => {
  const [localWalletFormData, setLocalWalletFormData] =
    useState<WalletFormData>(getWalletFormData());

  const [alertMessage, setAlertMessage] = useState("");

  const [noteKey, setNoteKey] = useState("");
  const [noteValue, setNoteValue] = useState("");

  // ✅ Wallet states
  const [supportedWallets, setSupportedWallets] = useState<string[]>([]);
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);

  // ✅ Fetch supported wallets
  useEffect(() => {
    const loadMethods = async () => {
      try {
        const data = await fetchMethod();

        /**
         * data.wallet = { grabpay: true, paytm: false }
         */
        if (selectedProduct === "one-time" && data?.wallet) {
          const enabledWallets = Object.entries(data.wallet)
            .filter(([_, enabled]) => enabled === true)
            .map(([wallet]) => wallet);

          setSupportedWallets(enabledWallets);
        } else if (
          selectedProduct === "recurring" ||
          selectedProduct === "subscription"
        ) {
          setSupportedWallets(["touchngo"]);
        }
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

    const updated = { ...localWalletFormData, [name]: filteredValue };

    setLocalWalletFormData(updated);
    setWalletFormData(updated);
  };

  // ✅ Notes
  const handleAddNote = () => {
    if (!noteKey || !noteValue) return;

    const updated = {
      ...localWalletFormData,
      notes: {
        ...(localWalletFormData.notes || {}),
        [noteKey]: noteValue,
      },
    };

    setLocalWalletFormData(updated);
    setWalletFormData(updated);

    setNoteKey("");
    setNoteValue("");
  };

  const handleRemoveNote = (key: string) => {
    const updatedNotes = { ...localWalletFormData.notes };
    delete updatedNotes[key];

    const updated = { ...localWalletFormData, notes: updatedNotes };
    setLocalWalletFormData(updated);
    setWalletFormData(updated);
  };

  // ✅ Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAlertMessage("");

    if (!selectedWallet) {
      setAlertMessage("Please select a wallet");
      return;
    }

    const updated = {
      ...localWalletFormData,
      wallet: selectedWallet,
    };

    setLocalWalletFormData(updated);
    setWalletFormData(updated);

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
          Wallet Payment
        </h3>

        {/* ✅ Wallet selection UI
        {supportedWallets.length > 0 && (
          <div>
            <p className="text-sm text-gray-400 mb-2">Select Wallet</p>

            <div className="grid grid-cols-2 gap-3">
              {supportedWallets.map((wallet) => (
                <button
                  type="button"
                  key={wallet}
                  onClick={() => setSelectedWallet(wallet)}
                  className={`rounded-xl p-3 border text-white capitalize transition
                    ${
                      selectedWallet === wallet
                        ? "border-blue-500 bg-blue-500/10"
                        : "border-white/10 hover:border-blue-400"
                    }
                  `}
                >
                  {wallet}
                </button>
              ))}
            </div>
          </div>
        )} */}

        {/* ✅ Wallet selection UI */}
        {supportedWallets.length > 0 && (
          <div>
            <p className="text-sm text-gray-400 mb-3">Select Wallet</p>

            <div className="grid grid-cols-2 gap-4">
              {supportedWallets.map((wallet) => {
                const logo = WALLET_LOGOS[wallet];

                return (
                  <button
                    type="button"
                    key={wallet}
                    onClick={() => setSelectedWallet(wallet)}
                    className={`flex items-center gap-3 rounded-xl p-4 border transition-all duration-200
              ${
                selectedWallet === wallet
                  ? "border-blue-500 bg-blue-500/10"
                  : "border-white/10 hover:border-blue-400 hover:bg-white/5"
              }
            `}
                  >
                    {/* Logo */}
                    {logo ? (
                      <img
                        src={logo}
                        alt={wallet}
                        className="h-8 w-8 object-contain"
                      />
                    ) : (
                      <div className="h-8 w-8 flex items-center justify-center bg-white/10 rounded-md text-xs text-white">
                        ?
                      </div>
                    )}

                    {/* Wallet Name */}
                    <span className="text-white capitalize font-medium">
                      {wallet}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Amount */}
        <input
          type="text"
          name="amount"
          placeholder="Amount"
          value={localWalletFormData.amount}
          onChange={handleChange}
          className="w-full rounded-xl px-4 py-3 bg-black/40 border border-white/10 text-white"
          required
        />

        {/* Receipt */}
        <input
          type="text"
          name="receipt"
          placeholder="Receipt ID"
          value={localWalletFormData.receipt}
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

        {localWalletFormData.notes &&
          Object.entries(localWalletFormData.notes).map(([key, value]) => (
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

export default WalletPaymentForm;
