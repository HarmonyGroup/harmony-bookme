declare module '@paystack/inline-js' {
  interface PaystackSuccessResponse {
    reference: string;
    trans: string;
    status: string;
    message: string;
    transaction: string;
    trxref: string;
  }

  interface PaystackPopOptions {
    key: string;
    email: string;
    amount: number;
    ref: string;
    onSuccess: (response: PaystackSuccessResponse) => void;
    onCancel: () => void;
    onClose: () => void;
  }

  interface PaystackResumeOptions {
    onSuccess: (response: PaystackSuccessResponse) => void;
    onCancel: () => void;
    onClose: () => void;
  }

  class PaystackPop {
    setup(options: PaystackPopOptions): {
      openIframe: () => void;
    };
    resumeTransaction(accessCode: string, options?: PaystackResumeOptions): void;
  }

  export default PaystackPop;
}
