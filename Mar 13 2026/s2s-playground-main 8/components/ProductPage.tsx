import React, { useState } from "react";
import { AlertCircle, X } from "lucide-react";
import { PRODUCT_LOGOS } from "@/services/paymentData";

interface Props {
  onBuy: (amount: number, title: string) => void;
}

export const webSeries = [
  {
    id: 1,
    title: "FitLife Gym Membership",
    description:
      "FitLife is a premium fitness center based in Kuala Lumpur offering state-of-the-art equipment, group workout classes, and personalized training programs for members of all fitness levels.",
    price: 15,
    image: PRODUCT_LOGOS.gym,
  },
  {
    id: 2,
    title: "SkillUp Online Learning Platform",
    description:
      "SkillUp is a Malaysian online learning platform that provides professional courses in coding, digital marketing, and business management, along with certification upon completion.",
    price: 20,
    image: PRODUCT_LOGOS.online_platform,
  },
  {
    id: 3,
    title: "BrewBox Coffee Delivery",
    description:
      "BrewBox is a specialty coffee brand in Malaysia that delivers freshly roasted coffee beans directly to customers’ homes, ensuring a fresh and convenient coffee experience.",
    price: 10,
    image: PRODUCT_LOGOS.coffee,
  },
  {
    id: 4,
    title: "StreamNow Entertainment Pass",
    description:
      "StreamNow is a digital streaming service offering Malaysian dramas, international movies, and live TV channels accessible across multiple devices.",
    price: 25,
    image: PRODUCT_LOGOS.streaming,
  },
];

const getGradient = (id: number) => {
  switch (id % 4) {
    case 0:
      return "from-purple-600 to-blue-600";
    case 1:
      return "from-red-600 to-orange-600";
    case 2:
      return "from-emerald-600 to-teal-600";
    case 3:
      return "from-pink-600 to-rose-600";
    default:
      return "from-gray-600 to-slate-600";
  }
};

export const ProductPage: React.FC<Props> = ({ onBuy }) => {
  const [selectedSeries, setSelectedSeries] = useState<{
    title: string;
    price: number;
  } | null>(null);

  const handleBuyClick = (series: (typeof webSeries)[0]) => {
    setSelectedSeries({ title: series.title, price: series.price });
  };

  const confirmBuy = () => {
    if (selectedSeries) {
      onBuy(selectedSeries.price, selectedSeries.title);
      setSelectedSeries(null); // Close modal
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <h1 className="text-4xl font-bold mb-4">Select Your Product</h1>
      {/* Web Series Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {webSeries.map((series) => (
          <div
            key={series.id}
            className="group relative bg-[#1E293B]/50 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 flex flex-col"
          >
            {/* Image Placeholder - using a gradient since we might not have actual images */}
            /
            <div className="relative flex items-center justify-center">
              <img
                src={series.image}
                alt={series.title}
                className="h-[9.375rem] w-full"
              />

              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />

              <div className="absolute bottom-1 right-1 bg-black/70 backdrop-blur text-white px-2 py-1 rounded-lg text-xs font-bold border border-white/10">
                RM {series.price}
              </div>
            </div>
            <div className="p-5 flex flex-col flex-1">
              <h3 className="text-xl font-bold text-white mb-2 leading-tight group-hover:text-blue-400 transition-colors">
                {series.title}
              </h3>
              <p className="text-gray-400 text-sm mb-6 flex-1">
                {series.description}
              </p>

              <button
                onClick={() => handleBuyClick(series)}
                className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/20 transform hover:-translate-y-0.5 transition-all duration-200"
              >
                Buy Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Confirmation Modal */}
      {selectedSeries && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#1E293B] border border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-2xl transform transition-all scale-100">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3 text-amber-400">
                <AlertCircle className="w-6 h-6" />
                <h3 className="text-xl font-bold text-white">
                  Confirm Purchase
                </h3>
              </div>
              <button
                onClick={() => setSelectedSeries(null)}
                className="text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-gray-300 mb-6">
              You are about to purchase{" "}
              <span className="text-white font-semibold">
                {selectedSeries.title}
              </span>{" "}
              for{" "}
              <span className="text-blue-400 font-bold">
                RM {selectedSeries.price}
              </span>
              .
              <br />
              <br />
              Do you want to continue to checkout?
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setSelectedSeries(null)}
                className="flex-1 py-2.5 px-4 bg-white/5 hover:bg-white/10 text-gray-300 font-medium rounded-xl transition-colors border border-white/5"
              >
                Cancel
              </button>
              <button
                onClick={confirmBuy}
                className="flex-1 py-2.5 px-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold rounded-xl shadow-lg shadow-green-500/20 transition-all"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
