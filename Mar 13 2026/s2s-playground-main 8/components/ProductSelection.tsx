// "use client";

// import React from "react";
// import {
//     CreditCard,
//     RefreshCw,
//     Zap,
//     ArrowDownLeft
// } from "lucide-react";

// interface ProductSelectionProps {
//     onSelect: (product: string) => void;
// }

// const products = [
//     {
//         id: "one-time",
//         title: "One time checkout",
//         description: "Standard one-time payment for products or services",
//         icon: <CreditCard className="w-6 h-6" />,
//         color: "from-blue-500 to-cyan-500"
//     },
//     {
//         id: "recurring",
//         title: "Recurring",
//         description: "Subscription-based payments with automated billing",
//         icon: <RefreshCw className="w-6 h-6" />,
//         color: "from-purple-500 to-pink-500"
//     },
//     {
//         id: "quick-payouts",
//         title: "Quick payouts",
//         description: "Instant fund transfers to vendors or customers",
//         icon: <Zap className="w-6 h-6" />,
//         color: "from-amber-500 to-orange-500"
//     },
//     {
//         id: "direct-debits",
//         title: "Direct debits",
//         description: "Automated collection of payments from bank accounts",
//         icon: <ArrowDownLeft className="w-6 h-6" />,
//         color: "from-emerald-500 to-teal-500"
//     }
// ];

// export const ProductSelection: React.FC<ProductSelectionProps> = ({ onSelect }) => {
//     return (
//         <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
//             <div className="text-center mb-12">
//                 <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
//                     Select Your Product
//                 </h1>
//                 <p className="text-gray-400 text-lg">
//                     Choose the integration that best fits your business needs
//                 </p>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
//                 {products.map((product) => (
//                     <button
//                         key={product.id}
//                         onClick={() => onSelect(product.id)}
//                         className="group relative p-1 rounded-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
//                     >
//                         <div className={`absolute inset-0 bg-gradient-to-br ${product.color} opacity-20 group-hover:opacity-40 rounded-2xl transition-opacity animate-pulse`} />
//                         <div className="relative h-full bg-[#1e293b]/80 backdrop-blur-xl border border-white/10 p-8 rounded-2xl flex flex-col items-start text-left">
//                             <div className={`p-3 rounded-xl bg-gradient-to-br ${product.color} mb-6 shadow-lg shadow-black/20`}>
//                                 {product.icon}
//                             </div>
//                             <h3 className="text-xl font-semibold mb-2 text-white group-hover:text-blue-400 transition-colors">
//                                 {product.title}
//                             </h3>
//                             <p className="text-gray-400 text-sm leading-relaxed">
//                                 {product.description}
//                             </p>
//                         </div>
//                     </button>
//                 ))}
//             </div>
//         </div>
//     );
// };
"use client";

import React from "react";
import { CreditCard, RefreshCw, Zap, ArrowDownLeft } from "lucide-react";

interface ProductSelectionProps {
  onSelect: (product: string) => void;
}

const products = [
  {
    id: "one-time",
    title: "One time checkout",
    description: "Standard one-time payment for products or services",
    icon: <CreditCard className="w-6 h-6" />,
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "subscriptions",
    title: "Subscriptions",
    description: "Subscription-based payments with automated billing",
    icon: <ArrowDownLeft className="w-6 h-6" />,
    color: "from-red-500 to-orange-500",
  },
  {
    id: "recurring",
    title: "Recurring",
    description: "Recurring-based payments with automated billing",
    icon: <RefreshCw className="w-6 h-6" />,
    color: "from-purple-500 to-pink-500",
  },
  {
    id: "quick-payouts",
    title: "Quick payouts",
    description: "Instant fund transfers to vendors or customers",
    icon: <Zap className="w-6 h-6" />,
    color: "from-amber-500 to-orange-500",
  },
  {
    id: "direct-debits",
    title: "Direct debits",
    description: "Automated collection of payments from bank accounts",
    icon: <ArrowDownLeft className="w-6 h-6" />,
    color: "from-emerald-500 to-teal-500",
  },
];

export const ProductSelection: React.FC<ProductSelectionProps> = ({
  onSelect,
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Select Your Product</h1>
        <p className="text-gray-400 text-lg">
          Choose the integration that best fits your business needs
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        {products.map((product) => (
          <button
            key={product.id}
            onClick={() => onSelect(product.id)}
            className="group relative p-1 rounded-2xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
          >
            <div
              className={`absolute inset-0 bg-gradient-to-br ${product.color} opacity-20 group-hover:opacity-40 rounded-2xl transition-opacity animate-pulse`}
            />
            <div className="relative h-full bg-[#1E293B]/80 backdrop-blur-xl border border-white/10 p-8 rounded-2xl flex flex-col items-start text-left">
              <div
                className={`p-3 rounded-xl bg-gradient-to-br ${product.color} mb-6 shadow-lg shadow-black/20`}
              >
                {product.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white group-hover:text-blue-400 transition-colors">
                {product.title}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                {product.description}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
