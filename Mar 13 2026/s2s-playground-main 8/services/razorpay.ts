// services/razorpay.ts

declare global {
  interface Window {
    Razorpay: any;
  }
}

let razorpayInstance: any = null;

/**
 * ✅ Ensures Razorpay script is loaded and initialized
 */
export async function loadRazorpay() {
  if (typeof window === "undefined") {
    return null;
  }

  // If already initialized, return instance
  if (razorpayInstance) return razorpayInstance;

  // Load Razorpay script dynamically if not available
  if (!window.Razorpay) {
    await new Promise<void>((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/razorpay.js";
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject("Failed to load Razorpay script");
      document.body.appendChild(script);
    });
  }

  // Initialize Razorpay instance once script is ready
  razorpayInstance = new window.Razorpay({
    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
  });

  return razorpayInstance;
}
