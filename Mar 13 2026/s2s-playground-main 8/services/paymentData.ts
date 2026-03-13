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
  cardNumber: "5272008806235704",
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
  expire_at: 2066793599,
  recurring_value: 25,
  recurring_type: "on",
};

export function getUPIFormData(): UPIFormData {
  return upiFormData;
}

export function setUPIFormData(updatedData: Partial<UPIFormData>): void {
  upiFormData = { ...upiFormData, ...updatedData };
}

export interface EmandateBankDetails {
  bank_code: string; // bank code like HDFC / YESB
  bank_name: string; // display name
  auth_type: string; // auth type
}

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
  ifsc: string;
  bank_details: EmandateBankDetails;
}

let emandateFormData: EmandateFormData = {
  amount: 0,
  frequency: "as_presented",
  auth_type: "",
  notes: {},
  receipt: "testing",
  max_amount: 500,
  expire_at: 2066793599,
  beneficiary_name: "Gaurav Kumar",
  account_number: 1121431121541121,
  account_type: "savings",
  ifsc: "HDFC0000001",
  bank_details: {
    bank_code: "HDFC",
    bank_name: "HDFC Bank",
    auth_type: "netbanking",
  },
};

export function getEmandateFormData(): EmandateFormData {
  return emandateFormData;
}

export function setEmandateFormData(
  updatedData: Partial<EmandateFormData>
): void {
  emandateFormData = { ...emandateFormData, ...updatedData };
}

// bankLogos.ts
export const BANK_LOGOS: Record<string, string> = {
  AIRP: "/bank_logos/airtel_AIRP.jpg",
  AUBL: "/bank_logos/au_small_finance_AUBL.jpg",
  UTIB: "/bank_logos/axis_bank_UTIB.jpg",
  BDBL: "/bank_logos/bandhan_bank_BDBL.jpg",
  BKID: "/bank_logos/bank_of_india_BKID.jpg",
  MAHB: "/bank_logos/bank_of_maharashtra_MAHB.jpg",
  CNRB: "/bank_logos/canara_bank_CNRB.jpg",
  CSBK: "/bank_logos/catholic_CSBK.jpg",
  CBIN: "/bank_logos/centralbank_of_india_CBIN.jpg",
  CNSX: "/bank_logos/chembur_nagrik_CNSX.jpg",
  CIUB: "/bank_logos/city_union_bank_CIUB.jpg",
  COSB: "/bank_logos/cosmos_bank_COSB.jpg",
  DCBL: "/bank_logos/dcb_bank_DCBL.jpg",
  DLXB: "/bank_logos/dhanlaxmi_bank_DLXB.jpg",
  ESFP: "/bank_logos/equitas_ESFP.jpg",
  ESAF: "/bank_logos/esaf_ESAF.jpg",
  FDRL: "/bank_logos/federal_bank_limited_FDRL.jpg",
  HDFC: "/bank_logos/hdfc_HDFC.jpg",
  HSBC: "/bank_logos/hsbc_HSBC.jpg",
  ICIC: "/bank_logos/icici_ICIC.jpg",
  IBKL: "/bank_logos/idbl_bank_IBKL.jpg",
  IDFB: "/bank_logos/idfc_IDFB.jpg",
  IDIB: "/bank_logos/indian_bank_IDIB.jpg",
  IOBA: "/bank_logos/indian_overseas_bank_IOBA.jpg",
  INDB: "/bank_logos/indusind_bank_INDB.jpg",
  JAKA: "/bank_logos/jammuandkashmir_bank_JAKA.jpg",
  JSFB: "/bank_logos/janasmall_finance_JSFB.jpg",
  JSBL: "/bank_logos/jankalyan_sahakari_bank_JSBL.jpg",
  KCCB: "/bank_logos/kalupur_bank_KCCB.jpg",
  KARB: "/bank_logos/karnataka_KARB.jpg",
  KVBL: "/bank_logos/karur_vysya_KVBL.jpg",
  KKBK: "/bank_logos/kotal_mahindra_bank_KKBK.jpg",
  MSNU: "/bank_logos/mehsana_urban_coop_bank_MSNU.jpg",
  NSPB: "/bank_logos/nsdl_payments_bank_NSPB.jpg",
  PYTM: "/bank_logos/payt_payments_bank_PYTM.jpg",
  PSIB: "/bank_logos/punjab_sind_bank_PSIB.jpg",
  PUNB: "/bank_logos/puunjab_national_bank_PUNB.jpg",
  RATN: "/bank_logos/rbl_RATN.jpg",
  SRCB: "/bank_logos/saraswat_cooperative_bank_SRCB.jpg",
  SBIN: "/bank_logos/sbi_SBIN.jpg",
  SHIX: "/bank_logos/shivalik_bank_SHIX.jpg",
  SIBL: "/bank_logos/south_indian_bank_SIBL.jpg",
  SCBL: "/bank_logos/standard_chartered_SCBL.png",
  SURY: "/bank_logos/suryoday_small_finance_bank_limited_SURY.jpg",
  SVCB: "/bank_logos/svc_cooperative_bank_SVCB.jpg",
  TMBL: "/bank_logos/tamilnad_mercentile_bank_TMBL.jpg",
  TBSB: "/bank_logos/thane_bharat_sahakai_bank_TBSB.jpg",
  UCBA: "/bank_logos/uco_bank_UCBA.jpg",
  UBIN: "/bank_logos/union_bank_of_india_UBIN.jpg",
  VARA: "/bank_logos/varachha_cooperative_bank_VARA.jpg",
  YESB: "/bank_logos/yes_bank_YESB.jpg",
};

export const FPX_LOGOS: Record<string, string> = {
  PHBM: "/fpx_logos/affin_Bank_PHBM.png",
  PHBM_C: "/fpx_logos/affinmax_Bank_PHBM_C.png",
  AGOB: "/fpx_logos/agronet_AGOB.png",
  AGOB_C: "/fpx_logos/agronetbiz_AGOB_C copy.png",
  MFBB_C: "/fpx_logos/alliance_bank_business_MFBB_C.png",
  MFBB: "/fpx_logos/alliance_bank_personal_MFBB.png",
  ARBK: "/fpx_logos/ambank_ARBK.png",
  ARBK_C: "/fpx_logos/ambank_ARBK_C.png",
  BMMB: "/fpx_logos/bank_muamalat_BMMB.png",
  BMMB_C: "/fpx_logos/bank_muamalat_BMMB_C.png",
  BKCH: "/fpx_logos/bank_of_china_BKCH.png",
  BKRM: "/fpx_logos/bank_rakyat_BKRM.png",
  BKRM_C: "/fpx_logos/i-bizrakyat_BKRM_C.png",
  BIMB: "/fpx_logos/bankislam_bank_BIMB.png",
  BIMB_C: "/fpx_logos/bankislam_bank_BIMB_C.png",
  BNPA_C: "/fpx_logos/bnp_paribas_BNPA_C.png",
  BSNA: "/fpx_logos/bsn_BSNA.png",
  CIBB_C: "/fpx_logos/cimb_bank_CIBB_C.png",
  CIBB: "/fpx_logos/cimb_clicks_CIBB.png",
  CITI_C: "/fpx_logos/citibank_corporate_banking_CITI_C.png",
  DEUT_C: "/fpx_logos/deutsche_bank_DEUT_C.png",
  HLBB: "/fpx_logos/hong_leong_bank_HLBB.png",
  HLBB_C: "/fpx_logos/hong_leong_bank_HLBB_C.png",
  HSBC: "/fpx_logos/hsbc_bank_HSBC.png",
  HSBC_C: "/fpx_logos/hsbc_bank_HSBC_C.png",
  KFHO: "/fpx_logos/kfh_KFHO.png",
  KFHO_C: "/fpx_logos/kfh_KFHO_C.png",
  MBBE: "/fpx_logos/maybank2e_MBBE.png",
  MBBE_C: "/fpx_logos/maybank2e_MBBE_C.png",
  MB2U: "/fpx_logos/maybank2u_MB2U.png",
  OCBC: "/fpx_logos/ocbc_bank_OCBC.png",
  OCBC_C: "/fpx_logos/ocbc_bank_OCBC_C.png",
  PBBN_C: "/fpx_logos/pb_enterprise_PBBN_C.png",
  PBBE: "/fpx_logos/public_bank_PBBE.png",
  PBBE_C: "/fpx_logos/public_bank_PBBE_C.png",
  RHBB: "/fpx_logos/rhb_bank_RHBB.png",
  RHBB_C: "/fpx_logos/rhb_bank_RHBB_C.png",
  SCBL: "/fpx_logos/standard_chartered_SCBL.png",
  SCBL_C: "/fpx_logos/standard_chartered_SCBL_C.png",
  UOVB: "/fpx_logos/uob_bank_UOVB.png",
  UOVB_C: "/fpx_logos/uob_regional_UOVB_C.png",
  UOBV_C: "/fpx_logos/uob_regional_UOVB_C.png",
};

export const WALLET_LOGOS: Record<string, string> = {
  touchngo: "/wallet_logos/touchngo.png",
  grabpay: "/wallet_logos/grabpay.png",
  boost: "/wallet_logos/boost.png",
  mcash: "/wallet_logos/mcash.png",
  shopback: "/wallet_logos/shopback.png",
};

export const PRODUCT_LOGOS: Record<string, string> = {
  gym: "/product_logos/Gym.png",
  online_platform: "/product_logos/online-platform.png",
  coffee: "/product_logos/coffee.png",
  streaming: "/product_logos/streaming.png",
};

export interface WalletFormData {
  amount: number;
  frequency: string;
  notes?: Record<string, string>;
  receipt?: string;
  max_amount?: number;
  expire_at?: number;
  wallet: string;
}

let walletFormData: WalletFormData = {
  amount: 500,
  frequency: "as_presented",
  notes: {},
  receipt: "",
  max_amount: 500,
  expire_at: 2214953809,
  wallet: "",
};

export function getWalletFormData(): WalletFormData {
  return walletFormData;
}

export function setWalletFormData(updatedData: Partial<WalletFormData>): void {
  walletFormData = { ...walletFormData, ...updatedData };
}

export interface FpxBankDetails {
  bank_code: string; // bank code like HDFC / YESB
  bank_name: string; // display name
}
export interface FPXFormData {
  amount: number;
  frequency: string;
  notes?: Record<string, string>;
  receipt?: string;
  max_amount?: number;
  expire_at?: number;
  bank_details: FpxBankDetails;
}

let fpxFormData: FPXFormData = {
  amount: 500,
  frequency: "as_presented",
  notes: {},
  receipt: "",
  max_amount: 500,
  expire_at: 3407460577,
  bank_details: {
    bank_code: "HDFC",
    bank_name: "HDFC Bank",
  },
};

export function getFPXFormData(): FPXFormData {
  return fpxFormData;
}

export function setFPXFormData(updatedData: Partial<FPXFormData>): void {
  fpxFormData = { ...fpxFormData, ...updatedData };
}

export interface StandardFormData {
  amount: number;
  notes?: Record<string, string>;
  receipt?: string;
}

let standardFormData: StandardFormData = {
  amount: 500,
  notes: {},
  receipt: "",
};

export function getStandardFormData(): StandardFormData {
  return standardFormData;
}

export function setStandardFormData(
  updatedData: Partial<StandardFormData>
): void {
  standardFormData = { ...standardFormData, ...updatedData };
}

export interface PlanFormData {
  period: string;
  interval: number;
  item: {
    name: string;
    amount: number;
    currency: string;
    description?: string;
  };
  notes?: Record<string, string>;
}

let planFormData: PlanFormData = {
  period: "monthly",
  interval: 2,
  item: {
    name: "Harshit Srivastava",
    amount: 69900,
    currency: "MYR",
    description: "Harshit likes to play video games and eat maggie at midnight",
  },
  notes: {
    note1: "Harshit works at Razorpay",
    note2: "Harshit is from Alahabad",
  },
};

export function getPlanFormData(): PlanFormData {
  return planFormData;
}

export function setPlanFormData(updatedData: Partial<PlanFormData>): void {
  planFormData = { ...planFormData, ...updatedData };
}
