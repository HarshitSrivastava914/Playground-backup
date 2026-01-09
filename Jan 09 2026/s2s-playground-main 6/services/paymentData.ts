//CARD FORM DATA MANAGEMENT
export interface CardFormData {
  amount: number;
  frequency: string;
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  cardHolder: string;
  notes?: Record<string, string>;
  receipt?: string;
  max_amount?: number;
  expire_at?: number;
}

let cardFormData: CardFormData = {
  amount: 500,
  frequency: "as_presented",
  cardNumber: "4718609108204366",
  expiryMonth: "11",
  expiryYear: "29",
  cvv: "123",
  cardHolder: "test",
  notes: {},
  receipt: "",
  max_amount: 500,
  expire_at: 3407460577,
};

export function getCardFormData(): CardFormData {
  return cardFormData;
}

export function setCardFormData(updatedData: Partial<CardFormData>): void {
  cardFormData = { ...cardFormData, ...updatedData };
}

console.log("Print card form Data:", cardFormData);

//UPI FORM DATA MANAGEMENT

export interface UPIFormData {
  amount: number;
  frequency: string;
  flow: "collect" | "intent" | "qr";
  vpa?: string;
  notes?: Record<string, string>;
  receipt?: string;
  max_amount?: number;
  expire_at?: number;
  recurring_value?: number;
  recurring_type?: "on" | "before" | "after";
}

let upiFormData: UPIFormData = {
  amount: 500,
  frequency: "as_presented",
  flow: "collect",
  vpa: "success@razorpay",
  notes: { test: "note" },
  receipt: "dummy_receipt_upi_01",
  max_amount: 500,
  expire_at: 1798248670,
  recurring_value: 25,
  recurring_type: "on",
};

export function getUPIFormData(): UPIFormData {
  return upiFormData;
}

export function setUPIFormData(updatedData: Partial<UPIFormData>): void {
  upiFormData = { ...upiFormData, ...updatedData };
}

console.log("Print UPI form Data:", upiFormData);

export interface EmandateFormData {
  amount: number;
  frequency: string;
  auth_type?: string;
  notes?: Record<string, string>;
  receipt?: string;
  max_amount?: number;
  expire_at?: number;
  beneficiary_name: string;
  account_number: number;
  account_type: string;
  ifsc_code: string;
}

let emandateFormData: EmandateFormData = {
  amount: 500,
  frequency: "as_presented",
  auth_type: "",
  notes: {},
  receipt: "",
  max_amount: 500,
  expire_at: 3407460577,
  beneficiary_name: "Gaurav Kumar",
  account_number: 1121431121541121,
  account_type: "savings",
  ifsc_code: "HDFC0000001",
};

export function getEmandateFormData(): EmandateFormData {
  return emandateFormData;
}

export function setEmandateFormData(
  updatedData: Partial<EmandateFormData>
): void {
  emandateFormData = { ...emandateFormData, ...updatedData };
}
console.log("Print eMandate form Data:", emandateFormData);
