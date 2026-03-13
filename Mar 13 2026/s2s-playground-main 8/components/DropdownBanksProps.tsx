"use client";

import React, { useEffect, useRef, useState } from "react";

export interface Bank {
  bankCode: string;
  name: string;
}

interface DropdownBanksProps {
  banks: Bank[];
  logos: Record<string, string>; // { bankCode: logoPath }
  value: string | null;
  onChange: (bank: Bank) => void;
  placeholder?: string;
}

const getInitials = (name: string) => {
  const safeName = name?.trim();
  if (!safeName) return "NA";

  return safeName
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
};

const DropdownBanks: React.FC<DropdownBanksProps> = ({
  banks = [],
  logos,
  value,
  onChange,
  placeholder = "Select Bank",
}) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedBank = banks.find((b) => b.bankCode === value);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredBanks = banks.filter((bank) => {
    const bankName = bank?.name ?? "";
    return bankName.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Selected Button */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="
          w-full h-12 px-4
          flex items-center justify-between
          rounded-xl border border-white/10
          bg-black/40 text-white
          hover:border-white/20
          focus:outline-none focus:ring-2 focus:ring-blue-500/40
          transition-all
        "
      >
        {selectedBank ? (
          <div className="flex items-center gap-3">
            {logos[selectedBank.bankCode] ? (
              <div className="h-8 w-8 bg-white rounded-md flex items-center justify-center">
                <img
                  src={logos[selectedBank.bankCode]}
                  alt={selectedBank.name ?? "Bank"}
                  className="h-6 w-6 object-contain"
                />
              </div>
            ) : (
              <div className="h-8 w-8 rounded-md bg-gray-700 flex items-center justify-center text-xs font-semibold">
                {getInitials(selectedBank.name ?? "")}
              </div>
            )}
            <span className="text-sm font-medium">
              {selectedBank.name ?? "Unknown Bank"}
            </span>
          </div>
        ) : (
          <span className="text-sm text-gray-400">{placeholder}</span>
        )}

        <span
          className={`text-xs transition-transform ${open ? "rotate-180" : ""}`}
        >
          ▼
        </span>
      </button>

      {/* Dropdown List */}
      {open && (
        <div
          className="
            absolute z-50 mt-2 w-full
            rounded-xl border border-white/10
            bg-[#1a2332]
            shadow-2xl
          "
        >
          {/* Search Input */}
          <div className="p-2 border-b border-white/10">
            <input
              type="text"
              placeholder="Search bank"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="
                w-full px-3 py-2
                rounded-md
                bg-black/40 text-sm text-white
                placeholder-gray-400
                outline-none
                focus:ring-2 focus:ring-blue-500/40
              "
            />
          </div>

          {/* Bank List */}
          <div className="max-h-64 overflow-y-auto">
            {filteredBanks.map((bank) => {
              const isBusiness = bank.bankCode?.endsWith("_C");

              const displayName = isBusiness
                ? `${bank.name} Business`
                : bank.name;

              return (
                <button
                  key={bank.bankCode}
                  type="button"
                  onClick={() => {
                    onChange({
                      ...bank,
                      name: displayName, // pass updated name to parent
                    });

                    setOpen(false);
                    setSearch("");
                  }}
                  className="
          w-full px-4 py-3
          flex items-center gap-3
          text-left text-sm text-white
          hover:bg-white/5
          transition-colors
        "
                >
                  {logos[bank.bankCode] ? (
                    <div className="h-8 w-8 bg-white rounded-md flex items-center justify-center">
                      <img
                        src={logos[bank.bankCode]}
                        alt={displayName}
                        className="h-6 w-6 object-contain"
                      />
                    </div>
                  ) : (
                    <div className="h-8 w-8 rounded-md bg-gray-700 flex items-center justify-center text-xs font-semibold">
                      {getInitials(displayName ?? "")}
                    </div>
                  )}

                  <span>{displayName ?? "Unknown Bank"}</span>
                </button>
              );
            })}

            {filteredBanks.length === 0 && (
              <div className="px-4 py-6 text-center text-sm text-gray-400">
                No banks found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DropdownBanks;
