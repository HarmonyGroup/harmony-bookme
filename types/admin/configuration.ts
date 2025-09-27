import { CommissionRates, ConfigurationData } from "@/types/shared/configuration";

export interface ApiError {
  success: false;
  error: string;
  message: string;
}

export interface useGetConfigurationResponse {
  success: boolean;
  data: ConfigurationData | null;
  message: string;
}

export interface useUpdateConfigurationRequest {
  commissionRates: CommissionRates;
}

export interface useUpdateConfigurationResponse {
  success: boolean;
  data: ConfigurationData;
  message: string;
}

export interface useCreateConfigurationRequest {
  commissionRates: CommissionRates;
}

export interface useCreateConfigurationResponse {
  success: boolean;
  data: ConfigurationData;
  message: string;
}
