// import React from "react";

// interface Props {
//   onSelect: (option: string) => void;
// }

// export const CheckoutType: React.FC<Props> = ({ onSelect }) => {
//   const options = [
//     { title: "S2S Checkout" },
//     { title: "Custom Checkout" },
//     { title: "Standard Checkout" },
//   ];

//   return (
//     <div className="container">
//       <h2 className="text-xl">Select Checkout Type</h2>
//       <div
//         className="flex flex-gap gap-[132px]"
//         style={{ justifyContent: "center" }}
//       >
//         {options.map((opt) => (
//           <div
//             key={opt.title}
//             className="card"
//             onClick={() => onSelect(opt.title)}
//           >
//             <div style={{ fontSize: "40px", marginBottom: "10px" }}></div>
//             {opt.title}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };
// import React, { useState } from "react";

// interface Props {
//   onSelect: (option: string) => void;
// }

// export const CheckoutType: React.FC<Props> = ({ onSelect }) => {
//   const options = [
//     {
//       title: "S2S Checkout",
//       desc: "A fully server-driven payment flow with maximum backend control.",
//     },
//     {
//       title: "Custom Checkout",
//       desc: "Use your own UI and integrate Razorpay APIs for payment backend logic.",
//     },
//     {
//       title: "Standard Checkout",
//       desc: "Razorpay’s hosted checkout UI that handles all flows including OTP & 3DS.",
//     },
//   ];

//   const [hoverIndex, setHoverIndex] = useState<number | null>(null);

//   return (
//     <div className="container mx-auto mt-10 px-4">
//       <h2 className="text-xl font-semibold mb-8 text-center">
//         Select Checkout Type
//       </h2>

//       <div className="flex justify-center gap-12">
//         {options.map((opt, index) => (
//           <div
//             key={opt.title}
//             className="relative w-56 flex flex-col items-center"
//             onMouseEnter={() => setHoverIndex(index)}
//             onMouseLeave={() => setHoverIndex(null)}
//           >
//             {/* MAIN SELECT CARD */}
//             <div
//               onClick={() => onSelect(opt.title)}
//               className="cursor-pointer w-full bg-[#1f1f1f] text-white px-6 py-5 rounded-2xl shadow-md hover:shadow-xl border border-gray-700 transition-all flex justify-between items-center"
//             >
//               <span className="text-lg font-medium">{opt.title}</span>

//               {/* Info Icon */}
//               <span className="p-1 rounded-md hover:bg-gray-700 transition cursor-pointer">
//                 <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
//                   <circle
//                     className="pl-3"
//                     cx="12"
//                     cy="12"
//                     r="10"
//                     stroke="white"
//                     strokeWidth="2"
//                   />
//                   <line
//                     x1="12"
//                     y1="16"
//                     x2="12"
//                     y2="12"
//                     stroke="white"
//                     strokeWidth="2"
//                     strokeLinecap="round"
//                   />
//                   <circle cx="12" cy="8" r="1" fill="white" />
//                 </svg>
//               </span>
//             </div>

//             {/* HOVER DESCRIPTION CARD */}
//             {hoverIndex === index && (
//               <div className="absolute top-full mt-4 w-64 bg-[#252525] text-white p-5 rounded-xl shadow-xl border border-gray-700 animate-fadeIn z-20">
//                 <h4 className="font-semibold mb-2 text-base">{opt.title}</h4>
//                 <p className="text-sm opacity-90 leading-relaxed">{opt.desc}</p>

//                 <div className="mt-3 bg-[#1b1b1b] border border-gray-600 p-3 rounded-lg text-xs opacity-80 italic">
//                   Preview: This checkout provides smooth user experience with
//                   secure flows.
//                 </div>
//               </div>
//             )}
//           </div>
//         ))}
//       </div>

//       <style jsx>{`
//         @keyframes fadeIn {
//           from {
//             opacity: 0;
//             transform: translateY(-6px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
//         .animate-fadeIn {
//           animation: fadeIn 0.2s ease-out;
//         }
//       `}</style>
//     </div>
//   );
// };

import React, { useState } from "react";

interface Props {
  onSelect: (option: string) => void;
}

export const CheckoutType: React.FC<Props> = ({ onSelect }) => {
  const options = [
    {
      title: "S2S Checkout",
      desc: "A fully server-driven payment flow with maximum backend control.",
    },
    {
      title: "Custom Checkout",
      desc: "Use your own UI and integrate Razorpay APIs for payment backend logic.",
    },
    {
      title: "Standard Checkout",
      desc: "Razorpay’s hosted checkout UI that handles all flows including OTP & 3DS.",
    },
  ];

  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  return (
    <div className="w-full max-w-5xl mx-auto px-4">
      <h2 className="text-2xl font-semibold mb-10 text-center text-white">
        Choose Checkout Experience
      </h2>

      <div className="flex flex-wrap justify-center gap-6">
        {options.map((opt, index) => (
          <div
            key={opt.title}
            className="relative w-full sm:w-72"
            onMouseEnter={() => setHoverIndex(index)}
            onMouseLeave={() => setHoverIndex(null)}
          >
            {/* MAIN CARD */}
            <div
              onClick={() => onSelect(opt.title)}
              className={`cursor-pointer h-full rounded-2xl p-6 
                border border-white/10 bg-white/5 backdrop-blur-xl 
                shadow-xl hover:shadow-2xl transition-all duration-300 
                flex items-center justify-between group`}
            >
              <span className="text-lg font-medium text-white">
                {opt.title}
              </span>

              {/* Info Icon */}
              <span className="p-2 rounded-lg bg-white/5 group-hover:bg-white/10 transition">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="white"
                    strokeWidth="2"
                  />
                  <line
                    x1="12"
                    y1="16"
                    x2="12"
                    y2="12"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <circle cx="12" cy="8" r="1" fill="white" />
                </svg>
              </span>
            </div>

            {/* HOVER INFO CARD */}
            {hoverIndex === index && (
              <div
                className={`absolute top-full left-1/2 -translate-x-1/2 mt-4 w-72
                  rounded-xl p-5 border border-white/10 bg-[#1b1b1b]
                  shadow-2xl text-white animate-fadeIn z-30`}
              >
                <h4 className="font-semibold mb-2">{opt.title}</h4>
                <p className="text-sm text-gray-300 leading-relaxed">
                  {opt.desc}
                </p>

                <div className="mt-4 text-xs text-gray-400 italic border-t border-white/10 pt-3">
                  Optimized for secure and smooth checkout experience.
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-6px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.18s ease-out;
        }
      `}</style>
    </div>
  );
};
