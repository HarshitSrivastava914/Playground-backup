// services/razorpayService.ts

// ---------------------------------------------
// TYPE DEFINITIONS
// ---------------------------------------------

export interface CustomerData {
  name: string;
  email: string;
  contact: string;
}

export interface OrderData {
  amount: number;
  method: string | null;
  customer_id: string;
  frequency: string;
  expire_at?: number;
  max_amount?: number;
  receipt?: string;
  notes?: Record<string, string>;
}

// Card payment structure
type CardData = {
  method: "card";
  number: string;
  cvv: string;
  expiry_month: string;
  expiry_year: string;
  name: string;
};

type UpiData = {
  method: "upi";
  flow: "collect" | "intent";
  vpa?: string;
};

type PaymentPayload = {
  amount: number;
  order_id: string;
  customer_id: string;
  email: string;
  contact: string;
  method: any;
  card: CardData;
  upi: UpiData;
};

export interface PaymentFormData {
  name: string;
  email: string;
  contact: string;
  amount: number;
  cardNumber: string;
  method: string | null;
  cvv: string;
  expiryMonth: string;
  expiryYear: string;
  cardHolder: string;
}

// ---------------------------------------------
// API CALLS
// ---------------------------------------------

export async function createCustomer(data: CustomerData) {
  const res = await fetch("/api/create-customer", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function createOrder(data: OrderData) {
  const res = await fetch("/api/create-order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

// -----------------------------------------------------
// 🔥 UPDATED createPayment FUNCTION (supports CARD + UPI)
// -----------------------------------------------------

export async function createPayment(payloadData: PaymentPayload) {
  const { amount, order_id, customer_id, email, contact, method } = payloadData;
  console.log("payload data", payloadData);
  const payload: any = {
    amount,
    order_id,
    customer_id,
    email,
    contact,
    method,
  };
  console.log("PRINTING INSIDE RZPSERVICE", method);
  // Determine method using paymentMethod.method
  if (method === "card") {
    console.log("printing card method");
    payload.card = {
      number: payloadData.card.number,
      cvv: payloadData.card.cvv,
      expiry_month: payloadData.card.expiry_month,
      expiry_year: payloadData.card.expiry_year,
      name: payloadData.card.name,
    };
  } else if (method === "upi") {
    console.log("printing upi method");
    payload.upi = {
      flow: payloadData.upi.flow,
      ...(payloadData.upi.flow === "collect"
        ? { vpa: payloadData.upi.vpa }
        : {}),
    };
  }

  const res = await fetch("/api/create-payment", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  console.log("after fetch");
  console.log("Response in service", res);

  return res.json();
}

// ---------------------------------------------
// OTP APIs
// ---------------------------------------------

export async function submitOtp(url: string, otp: string) {
  const res = await fetch("/api/submit-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url, otp }),
  });
  return res.json();
}

export async function resendOtp(url: string) {
  const res = await fetch("/api/resend-otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });
  return res.json();
}

// ---------------------------------------------
// Fetch Payment Status
// ---------------------------------------------

export async function fetchPaymentStatus(paymentId: string) {
  try {
    const res = await fetch(`/api/payment-status?payment_id=${paymentId}`);
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.error || "Failed to fetch payment status");
    }

    return data;
  } catch (error: any) {
    console.error("❌ Error fetching payment status:", error.message);
    throw error;
  }
}

export async function generateQR(upiLink: string) {
  const res = await fetch("/api/generate-qr", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ upiLink }),
  });
  console.log("generateQR response", res);
  return res.json(); // returns { success: true, qr: "data:image/png;base64..." }
}

export async function validateVPA(vpa: string) {
  const res = await fetch("/api/validate-vpa", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ vpa }),
  });
  console.log("validateVPA response", res);
  return res.json();
}

export async function fetchMethod() {
  const res = await fetch("/api/fetch-method", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  console.log("fetchMethod response in service", res);
  return res.json();
}
