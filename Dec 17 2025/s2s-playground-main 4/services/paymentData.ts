//CARD FORM DATA MANAGEMENT
export interface CardFormData {
  amount: number;
  frequency: string;
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  cardHolder: string;
}

let cardFormData: CardFormData = {
  amount: 500,
  frequency: "as_presented",
  cardNumber: "4718609108204366",
  expiryMonth: "11",
  expiryYear: "29",
  cvv: "123",
  cardHolder: "test",
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
}

let upiFormData: UPIFormData = {
  amount: 500,
  frequency: "as_presented",
  flow: "collect",
  vpa: "success@razorpay",
};

export function getUPIFormData(): UPIFormData {
  return upiFormData;
}

export function setUPIFormData(updatedData: Partial<UPIFormData>): void {
  upiFormData = { ...upiFormData, ...updatedData };
}

console.log("Print UPI form Data:", upiFormData);
