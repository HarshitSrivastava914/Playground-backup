import React from "react";

interface Props {
  onBuy: () => void;
}

export const ProductPage: React.FC<Props> = ({ onBuy }) => (
  <div
    className="container mx-auto p-6 flex flex-col md:flex-row items-start md:items-center gap-10 bg-[#1e1e1e] rounded-2xl shadow-lg"
    style={{ maxWidth: "900px" }}
  >
    {/* Left Section - Image */}
    <div className="w-full md:w-1/2">
      <img
        src="/image.jpg"
        alt="Web Series"
        className="w-full rounded-xl shadow-xl object-cover"
      />
    </div>

    {/* Right Section - Content */}
    <div className="w-full md:w-1/2 text-white">
      <h2 className="text-3xl font-semibold mb-3">Web Series Title</h2>

      <p className="text-gray-400 leading-relaxed mb-6">
        Short description of the web series goes here. Experience an immersive
        story with engaging characters and cinematic visuals.
      </p>

      <button
        className="bg-orange-500 hover:bg-orange-600 active:bg-orange-700 transition text-white px-6 py-3 rounded-xl text-lg font-semibold shadow-md"
        onClick={onBuy}
      >
        Buy Now
      </button>
    </div>
  </div>
);
