"use client";
import React, { useState } from "react";
import { createCustomer } from "../services/razorpayService";

interface CustomerFormProps {
  onNext: (customerId: string, formData: any) => void; // sends customerId + user data to index.tsx
}

const CustomerForm: React.FC<CustomerFormProps> = ({ onNext }) => {
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
      console.log("✅ Customer created:", response);
      if (response?.id) {
        onNext(response.id, formData);
      } else {
        setError("Failed to create customer.");
      }
    } catch (err: any) {
      console.error("❌ Customer creation failed:", err);
      setError("Error creating customer. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center bg-[#121212] min-h-screen p-5">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 max-w-md w-full p-6 bg-[#1e1e1e] border border-gray-600 rounded-lg shadow-lg"
      >
        <h3 className="text-center mb-2 text-white font-semibold text-lg">
          Enter Customer Details
        </h3>

        {error && (
          <div className="text-red-500 border border-red-500 p-2 rounded">
            {error}
          </div>
        )}

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          className="p-3 rounded border border-gray-600 bg-[#2a2a2a] text-white"
          required
        />

        <input
          type="tel"
          name="contact"
          placeholder="Contact Number"
          value={formData.contact}
          onChange={handleChange}
          className="p-3 rounded border border-gray-600 bg-[#2a2a2a] text-white"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          className="p-3 rounded border border-gray-600 bg-[#2a2a2a] text-white"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="p-3 rounded text-white font-medium transition bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Creating Customer..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default CustomerForm;
