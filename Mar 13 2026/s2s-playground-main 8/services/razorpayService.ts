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
  customer_id: string | null;
  method?: string | null; // Make optional for one-time payments
  receipt?: string;
  notes?: any;
  frequency?: string;
  expire_at?: number;
  max_amount?: number;
  recurring_value?: number;
  recurring_type?: string;
  beneficiary_name?: string;
  account_number?: string;
  account_type?: string;
  ifsc?: string;
  auth_type?: string;
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

type EmandateData = {
  method: "emandate";
  auth_type: string;
  bank_code: string;
  name: string;
  account_number: string;
  account_type: string;
  ifsc: string;
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
  emandate: EmandateData;
  bank?: string; // Add bank property for netbanking
  wallet?: string; // Add wallet property for wallet payments
  product?: string; // Add product property to identify the product type (one-time, subscription, etc.)
};

type ItemData = {
  name: string;
  amount: number;
  currency: string;
  description?: string;
};

type PlanPayload = {
  period: string;
  interval: number;
  item: ItemData;
  notes?: any;
};

type AddonData = {
  item: ItemData;
};

type SubscriptionPayload = {
  plan_id: string;
  total_count?: number;
  quantity?: number;
  customer_notify?: number;
  start_at?: number;
  expire_by?: number;
  addons?: AddonData;
  notes?: any;
};

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

export async function createPayment(payloadData: PaymentPayload) {
  const { amount, order_id, customer_id, email, contact, method, product } =
    payloadData;

  const payload: any = {
    amount,
    order_id,
    customer_id,
    email,
    contact,
    method,
    product,
  };

  /* ---------------- CARD ---------------- */
  if (method === "card") {
    payload.card = {
      number: payloadData.card.number,
      cvv: payloadData.card.cvv,
      expiry_month: payloadData.card.expiry_month,
      expiry_year: payloadData.card.expiry_year,
      name: payloadData.card.name,
    };
  }

  /* ---------------- UPI ---------------- */
  if (method === "upi") {
    payload.method = "upi";
    payload.upi = {
      flow: payloadData.upi.flow,
      ...(payloadData.upi.flow === "collect"
        ? { vpa: payloadData.upi.vpa }
        : {}),
    };
  }

  /* ---------------- EMANDATE ---------------- */
  if (method === "emandate") {
    payload.method = "emandate";
    // Assuming emandate structure is flattened or nested as required by API
    // The previous code had specific mapping:
    payload.auth_type = payloadData.emandate.auth_type;
    payload.bank_account = {
      name: payloadData.emandate.name,
      account_number: payloadData.emandate.account_number,
      account_type: payloadData.emandate.account_type,
      ifsc: payloadData.emandate.ifsc,
    };
    payload.bank = payloadData.emandate.bank_code;
  }

  /* ---------------- NETBANKING ---------------- */

  if (method === "wallet") {
    payload.method = "wallet";
    payload.wallet = payloadData.wallet;
  }

  if (method === "fpx") {
    payload.method = "fpx";
    payload.bank = payloadData.bank;
  }

  const res = await fetch("/api/create-payment", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
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
    throw error;
  }
}

export async function generateQR(upiLink: string) {
  const res = await fetch("/api/generate-qr", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ upiLink }),
  });
  return res.json(); // returns { success: true, qr: "data:image/png;base64..." }
}

export async function validateVPA(vpa: string) {
  const res = await fetch("/api/validate-vpa", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ vpa }),
  });
  return res.json();
}

export async function fetchMethod() {
  const res = await fetch("/api/fetch-method", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  return res.json();
}

export async function fetchTokenBypayment(paymentId: string) {
  const res = await fetch(
    `/api/fetch-token-by-payment?payment_id=${paymentId}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
  );
  return res.json();
}

export async function fetchTokenByCustomer(customerId: string | null) {
  const res = await fetch(
    `/api/fetch-token-by-customer?customerId=${customerId}`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    }
  );
  return res.json();
}

export async function createPlan(payloadData: PlanPayload) {
  const res = await fetch("/api/create-plan", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ payloadData }),
  });
  return res.json();
}

export async function createSubscription(payloadData: SubscriptionPayload) {
  const res = await fetch("/api/create-subscription", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ payloadData }),
  });
  return res.json();
}
