import React, { useState, useEffect } from "react";
import Image from "next/image";

interface PaymentMethodSelectorProps {
  onSelect: (data: { method: string; authType?: string | null }) => void;
  region: string;
  productType: string | null;
  selectedCheckout: string | null;
}

type PaymentMethod = {
  value: string;
  label: string;
  icon: string;
  type: "emoji" | "image";
};

export const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  onSelect,
  region,
  productType,
  selectedCheckout,
}) => {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  useEffect(() => {
    setSelectedMethod(null);
  }, [region]);

  const getMethods = (): PaymentMethod[] => {
    if (region === "India") {
      return [
        {
          value: "card",
          label: "Card",
          icon: "/payment_method_logos/card.png",
          type: "image",
        },
        {
          value: "upi",
          label: "UPI",
          icon: "/payment_method_logos/upi.png",
          type: "image",
        },
        {
          value: "emandate",
          label: "eMandate",
          icon: "/payment_method_logos/emandate.png",
          type: "image",
        },
      ];
    }

    if (region === "Malaysia") {
      if (productType === "recurring") {
        if (selectedCheckout === "Standard Checkout") {
          return [
            {
              value: "card",
              label: "Card",
              icon: "/payment_method_logos/card.png",
              type: "image",
            },
            {
              value: "wallet",
              label: "Wallet",
              icon: "/payment_method_logos/wallet.jpg",
              type: "image",
            },
          ];
        } else {
          return [
            {
              value: "card",
              label: "Card",
              icon: "/payment_method_logos/card.png",
              type: "image",
            },
          ];
        }
      }
      if (productType === "one-time") {
        return [
          {
            value: "card",
            label: "Card",
            icon: "/payment_method_logos/card.png",
            type: "image",
          },
          {
            value: "wallet",
            label: "Wallet",
            icon: "/payment_method_logos/wallet.jpg",
            type: "image",
          },
          {
            value: "fpx",
            label: "FPX",
            icon: "/payment_method_logos/fpx.png",
            type: "image",
          },
        ];
      }
    }

    return [];
  };

  const methods = getMethods();

  const handleSelect = (value: string) => {
    setSelectedMethod(value);
  };

  const handleProceed = () => {
    if (!selectedMethod) return;

    onSelect({
      method: selectedMethod,
    });
  };

  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold mb-2 text-center text-white">
        Select Payment Method
      </h2>

      <p className="text-gray-400 text-sm mb-6 text-center">
        Available methods for{" "}
        <span className="text-primary font-medium">{region}</span>
      </p>

      <div className="flex flex-wrap gap-6 justify-center">
        {methods.map((opt) => (
          <div
            key={opt.value}
            onClick={() => handleSelect(opt.value)}
            className={`
              cursor-pointer
              w-40
              rounded-2xl
              p-5
              text-center
              transition-all duration-300
              bg-card
              border
              ${
                selectedMethod === opt.value
                  ? "border-primary shadow-lg shadow-primary/20 scale-[1.03]"
                  : "border-border hover:border-primary/50 hover:bg-white/5"
              }
            `}
          >
            <div className="mb-3 flex justify-center items-center h-12">
              {opt.type === "image" ? (
                <div
                  className="relative mx-auto w-20
    h-20"
                >
                  <Image
                    src={opt.icon}
                    alt={opt.label}
                    fill
                    className="object-contain"
                  />
                </div>
              ) : (
                <span className="text-4xl">{opt.icon}</span>
              )}
            </div>

            <p className="font-medium text-white">{opt.label}</p>
          </div>
        ))}
      </div>

      {selectedMethod && (
        <div className="mt-10 text-center border-t border-white/10 pt-6">
          <h4 className="text-sm uppercase tracking-wider text-primary mb-3">
            Summary
          </h4>

          <p className="text-gray-300 mb-4">
            <span className="text-gray-400">Selected Method:</span>{" "}
            <span className="font-medium text-white">
              {methods.find((m) => m.value === selectedMethod)?.label}
            </span>
          </p>

          <button
            onClick={handleProceed}
            className="px-10 py-3 rounded-xl bg-primary hover:bg-primary-hover text-white font-medium shadow-lg shadow-primary/30 transition-all duration-200"
          >
            Proceed
          </button>
        </div>
      )}
    </div>
  );
};
