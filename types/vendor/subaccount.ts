// Subaccount Management Types

export interface BankDetails {
  accountNumber: string;
  bankCode: string;
  accountName: string;
  bankName?: string;
}

export interface PaystackSubaccount {
  subaccountId: string;
  status: "pending" | "active" | "inactive" | "suspended";
  settlementBank: string;
  createdAt: Date;
  updatedAt: Date;
  lastVerifiedAt?: Date;
}

export interface SubaccountStatus {
  hasSubaccount: boolean;
  subaccountId?: string;
  status?: "pending" | "active" | "inactive" | "suspended";
  businessName?: string;
  settlementBank?: string;
  bankDetails?: BankDetails;
  lastVerifiedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  paystackData?: {
    active: boolean;
    is_verified: boolean;
    settlement_schedule: string;
  };
  isLocalData?: boolean;
}

// API Request Types
export interface CreateSubaccountRequest {
  bankDetails: BankDetails;
  settlementBank: string;
}

export interface UpdateSubaccountRequest {
  bankDetails?: BankDetails;
  settlementBank?: string;
}

export interface VerifyBankRequest {
  accountNumber: string;
  bankCode: string;
}

// API Response Types
export interface CreateSubaccountResponse {
  success: boolean;
  message: string;
  data?: {
    subaccountId: string;
    status: "pending" | "active" | "inactive" | "suspended";
    businessName: string;
  };
  details?: any;
}

export interface UpdateSubaccountResponse {
  success: boolean;
  message: string;
  data?: {
    subaccountId: string;
    status: "pending" | "active" | "inactive" | "suspended";
    businessName: string;
  };
  details?: any;
}

export interface SubaccountStatusResponse {
  success: boolean;
  message?: string;
  data: SubaccountStatus;
}

export interface VerifyBankResponse {
  success: boolean;
  message: string;
  data?: {
    accountNumber: string;
    accountName: string;
    bankCode: string;
    bankName: string;
    verified: boolean;
  };
  details?: any;
}

