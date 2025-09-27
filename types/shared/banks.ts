// Bank Types

export interface Bank {
  name: string;
  code: string;
  slug: string;
  currency: string;
  type: string;
}

export interface BanksResponse {
  success: boolean;
  message: string;
  data: Bank[];
}
