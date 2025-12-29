import React from "react";

interface Props {
  onStart: () => void;
}
console.log("Inside Thankyou component");
const ThankYou: React.FC<Props> = ({ onStart }) => (
  <div className="container text-center">
    <div style={{ fontSize: "60px", color: "green" }}>✔️</div>
    <h2>Payment Successful</h2>
    <p className="text-medium-gray">
      Thank you for your purchase. Enjoy your web series!
    </p>
    <button className="button button-teal" onClick={onStart}>
      Start Streaming
    </button>
  </div>
);

export default ThankYou;
