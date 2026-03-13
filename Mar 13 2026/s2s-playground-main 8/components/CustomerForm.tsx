"use client";
import React, { useState } from "react";
import { createCustomer } from "../services/razorpayService";

interface CustomerFormProps {
  onNext: (customerId: string | null, formData: any) => void; // sends customerId + user data to index.tsx
  showSkip?: boolean;
}

const CustomerForm: React.FC<CustomerFormProps> = ({ onNext, showSkip }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let filteredValue = value;

    if (name === "name") filteredValue = value.replace(/[^a-zA-Z\s]/g, "");
    if (name === "contact")
      filteredValue = value.replace(/\D/g, "").slice(0, 10);
    if (name === "email")
      filteredValue = value.replace(/[^a-zA-Z0-9@._-]/g, "");

    setFormData((prev) => ({ ...prev, [name]: filteredValue }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await createCustomer(formData);
      if (response?.id) {
        onNext(response.id, formData);
      } else {
        setError("Failed to create customer.");
      }
    } catch (err: any) {
      setError("Error creating customer. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    const defaultData = {
      name: "OneTime User",
      email: "onetime@example.com",
      contact: "+60123456789",
    };
    onNext(null, defaultData);
  };

  // return (
  //   <div className="flex justify-center items-center bg-[#121212] min-h-screen p-5">
  //     <form
  //       onSubmit={handleSubmit}
  //       className="flex flex-col gap-4 max-w-md w-full p-6 bg-[#1E1E1E] border border-gray-600 rounded-lg shadow-lg"
  //     >
  //       <h3 className="text-center mb-2 text-white font-semibold text-lg">
  //         Enter Customer Details
  //       </h3>

  //       {error && (
  //         <div className="text-red-500 border border-red-500 p-2 rounded">
  //           {error}
  //         </div>
  //       )}

  //       <input
  //         type="text"
  //         name="name"
  //         placeholder="Full Name"
  //         value={formData.name}
  //         onChange={handleChange}
  //         className="p-3 rounded border border-gray-600 bg-[#2A2A2A] text-white"
  //         required
  //       />

  //       <input
  //         type="tel"
  //         name="contact"
  //         placeholder="Contact Number"
  //         value={formData.contact}
  //         onChange={handleChange}
  //         className="p-3 rounded border border-gray-600 bg-[#2A2A2A] text-white"
  //         required
  //       />

  //       <input
  //         type="email"
  //         name="email"
  //         placeholder="Email Address"
  //         value={formData.email}
  //         onChange={handleChange}
  //         className="p-3 rounded border border-gray-600 bg-[#2A2A2A] text-white"
  //         required
  //       />

  //       <button
  //         type="submit"
  //         disabled={loading}
  //         className="p-3 rounded text-white font-medium transition bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
  //       >
  //         {loading ? "Creating Customer..." : "Submit"}
  //       </button>
  //     </form>
  //   </div>
  // );

  // ---------------- COLORS & STYLES (Razorpay Theme) ----------------
  // Using global CSS variables where possible, but mapping specifically here for clarity
  const cardBg = "bg-card"; // var(--card-bg) -> #0f172a
  const borderColor = "border-border"; // var(--border) -> #1e293b
  const inputBg = "bg-input"; // var(--input-bg) -> #1e293b
  const primaryBtn =
    "bg-primary hover:bg-primary-hover text-white shadow-lg shadow-primary/20";
  const secondaryBtn =
    "bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10";

  return (
    <div
      className={`w-full max-w-md mx-auto p-8 rounded-2xl ${cardBg} border ${borderColor} shadow-2xl relative overflow-hidden`}
    >
      {/* Decorative top blur */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />

      <h2 className="text-2xl font-bold mb-6 text-center text-white flex items-center justify-center gap-2">
        {/* <User className="text-primary" size={28} /> */}
        Customer Details
      </h2>

      <div className="space-y-5">
        {/* Name */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-400 pl-1">
            Full Name
          </label>
          <div className="relative group">
            {/* <User className="absolute left-3 top-3.5 text-gray-500 group-focus-within:text-primary transition-colors" size={18} /> */}
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ex: John Doe"
              className={`w-full pl-10 pr-4 py-3 rounded-xl ${inputBg} border ${borderColor} text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all`}
            />
          </div>
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-400 pl-1">
            Email Address
          </label>
          <div className="relative group">
            {/* <Mail className="absolute left-3 top-3.5 text-gray-500 group-focus-within:text-primary transition-colors" size={18} /> */}
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Ex: john@example.com"
              className={`w-full pl-10 pr-4 py-3 rounded-xl ${inputBg} border ${borderColor} text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all`}
            />
          </div>
        </div>

        {/* Contact */}
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-400 pl-1">
            Phone Number
          </label>
          <div className="relative group">
            {/* <Phone className="absolute left-3 top-3.5 text-gray-500 group-focus-within:text-primary transition-colors" size={18} /> */}
            <input
              type="tel"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              placeholder="Ex: +60123456789"
              className={`w-full pl-10 pr-4 py-3 rounded-xl ${inputBg} border ${borderColor} text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all`}
            />
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-8 flex gap-3">
        {showSkip && (
          <button
            onClick={handleSkip}
            className={`flex-1 py-3.5 rounded-xl font-medium transition-all duration-200 ${secondaryBtn}`}
          >
            Skip
          </button>
        )}
        <button
          onClick={handleSubmit}
          className={`flex-1 py-3.5 rounded-xl font-bold transition-all duration-200 ${primaryBtn}`}
        >
          {loading ? "Creating..." : "Continue"}
        </button>
      </div>
    </div>
  );
};

export default CustomerForm;
