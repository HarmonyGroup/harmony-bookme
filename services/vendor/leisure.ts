import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { 
  LeisureListing, 
  LeisureListingResponse, 
  LeisureListingsResponse,
  LeisureListingFilters 
} from '@/types/vendor/leisure';

// API functions
const createLeisureListing = async (data: LeisureListing): Promise<LeisureListingResponse> => {
  const response = await fetch('/api/vendor/leisure', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create leisure listing');
  }

  return response.json();
};

const updateLeisureListing = async ({ id, data }: { id: string; data: Partial<LeisureListing> }): Promise<LeisureListingResponse> => {
  const response = await fetch(`/api/vendor/leisure/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update leisure listing');
  }

  return response.json();
};

const deleteLeisureListing = async (id: string): Promise<{ message: string }> => {
  const response = await fetch(`/api/vendor/leisure/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete leisure listing');
  }

  return response.json();
};

const fetchLeisureListings = async (params?: LeisureListingFilters): Promise<LeisureListingsResponse> => {
  const searchParams = new URLSearchParams();
  
  if (params?.page) searchParams.append('page', params.page.toString());
  if (params?.limit) searchParams.append('limit', params.limit.toString());
  if (params?.status) searchParams.append('status', params.status);
  if (params?.category) searchParams.append('category', params.category);
  if (params?.search) searchParams.append('search', params.search);

  const response = await fetch(`/api/vendor/leisure?${searchParams.toString()}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch leisure listings');
  }

  return response.json();
};

const fetchLeisureListing = async (id: string): Promise<LeisureListing> => {
  const response = await fetch(`/api/vendor/leisure/${id}`);

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch leisure listing');
  }

  const result = await response.json();
  return result.data;
};

// React Query hooks
export function useCreateLeisureListing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createLeisureListing,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leisure-listings'] });
      toast.success('Leisure listing created successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useUpdateLeisureListing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateLeisureListing,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['leisure-listings'] });
      queryClient.invalidateQueries({ queryKey: ['leisure-listing', variables.id] });
      toast.success('Leisure listing updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useDeleteLeisureListing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteLeisureListing,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leisure-listings'] });
      toast.success('Leisure listing deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

export function useLeisureListings(params?: LeisureListingFilters) {
  return useQuery({
    queryKey: ['leisure-listings', params],
    queryFn: () => fetchLeisureListings(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useLeisureListing(id: string) {
  return useQuery({
    queryKey: ['leisure-listing', id],
    queryFn: () => fetchLeisureListing(id),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
