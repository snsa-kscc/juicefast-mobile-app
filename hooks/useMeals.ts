import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { type Meal, type CreateMeal } from '@/schemas/MealsSchema';
import { AuthService } from '@/utils/auth';
import { sanitizeForLog } from '@/utils/sanitize';

const API_BASE = 'http://192.168.100.3:3001/api/meals';

async function fetchMeals(userId: string): Promise<Meal[]> {
  const response = await fetch(`${API_BASE}?userId=${userId}`, {
    headers: AuthService.getAuthHeaders(),
  });
  if (!response.ok) throw new Error('Failed to fetch meals');
  return response.json();
}

async function createMeal(meal: CreateMeal): Promise<Meal> {
  try {
    console.log('Sending meal to server:', sanitizeForLog(meal));
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: AuthService.getAuthHeaders(),
      body: JSON.stringify(meal),
    });
    
    console.log('Server response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Server error response:', sanitizeForLog(errorText));
      throw new Error(`Server error: ${response.status}`);
    }
    
    const result = await response.json();
    console.log('Server response received successfully');
    return result;
  } catch (error) {
    console.error('Network error occurred');
    throw error;
  }
}

export function useMeals(userId: string) {
  return useQuery({
    queryKey: ['meals', userId],
    queryFn: () => fetchMeals(userId),
    enabled: !!userId,
  });
}

export function useCreateMeal() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createMeal,
    onSuccess: (newMeal) => {
      queryClient.invalidateQueries({ queryKey: ['meals', newMeal.userId] });
    },
  });
}