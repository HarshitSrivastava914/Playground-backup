import React from "react";

interface Props {
  onStart: () => void;
}

const ThankYou: React.FC<Props> = ({ onStart }) => (
  <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-lg max-w-md mx-auto text-center">
    {/* Success Icon */}
    <div className="text-green-400 text-[60px] mb-4">✔️</div>

    {/* Heading */}
    <h2 className="text-2xl font-semibold text-white mb-2">
      Payment Successful
    </h2>

    {/* Message */}
    <p className="text-gray-300 mb-6 px-4">
      Thank you <strong>Rakshita Sharma</strong> for your purchase. Enjoy your
      web series!
    </p>

    {/* Start Button */}
    <div className="px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-xl transition-all shadow-md">
      Start Streaming
    </div>
  </div>
);

export default ThankYou;
