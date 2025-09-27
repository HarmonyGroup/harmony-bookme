import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CreateSubaccountRequest,
  CreateSubaccountResponse,
  UpdateSubaccountRequest,
  UpdateSubaccountResponse,
  SubaccountStatusResponse,
  VerifyBankRequest,
  VerifyBankResponse,
} from "@/types/vendor/subaccount";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

// Create subaccount hook
export const useCreatePaystackSubaccount = (onSuccess?: (data: any) => void, onError?: (error: any) => void) => {
  const queryClient = useQueryClient();

  const createSubaccount = async (data: CreateSubaccountRequest): Promise<CreateSubaccountResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/vendor/subaccount/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    return response.json();
  };

  return useMutation({
    mutationFn: createSubaccount,
    onSuccess: (response) => {
      if (response.success && response.data) {
        // Invalidate and refetch subaccount status
        queryClient.invalidateQueries({ queryKey: ["subaccount-status"] });
        onSuccess?.(response.data);
      } else {
        onError?.(response);
      }
    },
    onError: (error) => {
      onError?.(error);
    },
  });
};

// Update subaccount hook
export const useUpdatePaystackSubaccount = (onSuccess?: (data: any) => void, onError?: (error: any) => void) => {
  const queryClient = useQueryClient();

  const updateSubaccount = async (data: UpdateSubaccountRequest): Promise<UpdateSubaccountResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/vendor/subaccount/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    return response.json();
  };

  return useMutation({
    mutationFn: updateSubaccount,
    onSuccess: (response) => {
      if (response.success && response.data) {
        // Invalidate and refetch subaccount status
        queryClient.invalidateQueries({ queryKey: ["subaccount-status"] });
        onSuccess?.(response.data);
      } else {
        onError?.(response);
      }
    },
    onError: (error) => {
      onError?.(error);
    },
  });
};

// Get subaccount status hook
export const usePaystackSubaccountStatus = () => {
  const getSubaccountStatus = async (): Promise<SubaccountStatusResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/vendor/subaccount/status`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.json();
  };

  return useQuery({
    queryKey: ["subaccount-status"],
    queryFn: getSubaccountStatus,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });
};

// Verify bank details hook
export const useVerifyBankDetails = (onSuccess?: (data: any) => void, onError?: (error: any) => void) => {
  const verifyBankDetails = async (data: VerifyBankRequest): Promise<VerifyBankResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/vendor/subaccount/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    return response.json();
  };

  return useMutation({
    mutationFn: verifyBankDetails,
    onSuccess: (response) => {
      if (response.success && response.data) {
        onSuccess?.(response.data);
      } else {
        onError?.(response);
      }
    },
    onError: (error) => {
      onError?.(error);
    },
  });
};
