import React, { useEffect, useState, useRef } from "react";
import { fetchPaymentStatus } from "../services/razorpayService";

interface S2SQRProps {
  qrCode: string; // QR code image (URL/base64)
  paymentId: string; // Razorpay payment ID to poll
  onSuccess?: () => void;
  onFailure?: () => void;
}

const S2S_qr: React.FC<S2SQRProps> = ({
  qrCode,
  paymentId,
  onSuccess,
  onFailure,
}) => {
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [status, setStatus] = useState("pending");
  console.log("Rakshita Sharma ");
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    console.log("⏳ Starting 5-min countdown & polling...");

    //  ⏱ 1. TIMER RUNNING EVERY SECOND
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // TIME OUT
          clearInterval(timerRef.current!);
          clearInterval(pollIntervalRef.current!);
          setStatus("timeout");
          onFailure?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // 🔁 2. POLLING PAYMENT STATUS EVERY 5 SECONDS
    pollIntervalRef.current = setInterval(async () => {
      try {
        const response = await fetchPaymentStatus(paymentId);

        console.log("🔄 Polling result:", response);

        if (
          response.status === "captured" ||
          response.status === "authorized"
        ) {
          setStatus("success");
          clearInterval(timerRef.current!);
          clearInterval(pollIntervalRef.current!);
          onSuccess?.();
        }

        if (response.status === "failed") {
          setStatus("failed");
          clearInterval(timerRef.current!);
          clearInterval(pollIntervalRef.current!);
          onFailure?.();
        }
      } catch (error) {
        console.error("Polling error:", error);
      }
    }, 5000);

    // 🧹 CLEANUP when unmounted
    return () => {
      clearInterval(timerRef.current!);
      clearInterval(pollIntervalRef.current!);
    };
  }, []);

  // Format countdown
  const minutes = Math.floor(timeLeft / 60);
  const seconds = (timeLeft % 60).toString().padStart(2, "0");

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>Scan to Pay via UPI</h2>

      <img
        src={qrCode}
        alt="UPI QR Code"
        style={{
          width: 220,
          height: 220,
          margin: "20px auto",
          border: "1px solid #ccc",
          padding: 10,
          borderRadius: 10,
        }}
      />

      <p>
        Time left:{" "}
        <strong>
          {minutes}:{seconds}
        </strong>
      </p>

      <p>
        Status: <strong>{status}</strong>
      </p>
    </div>
  );
};

export default S2S_qr;
