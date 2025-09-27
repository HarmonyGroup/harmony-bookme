export interface CommissionRates {
  events: number;
  accommodations: number;
  leisure: number;
  movies_and_cinema: number;
}

export interface ConfigurationData {
  _id: string;
  commissionRates: CommissionRates;
  isActive: boolean;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}
