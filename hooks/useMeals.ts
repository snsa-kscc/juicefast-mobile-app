import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { type Meal, type CreateMeal } from "@/schemas/MealsSchema";
import { AuthService } from "@/utils/auth";
import { sanitizeForLog } from "@/utils/sanitize";

const API_BASE = "/api/meals";

async function fetchMeals(): Promise<Meal[]> {
  const response = await fetch(API_BASE);
  if (!response.ok) throw new Error("Failed to fetch meals");
  return response.json();
}

async function createMeal(meal: Omit<CreateMeal, "userId">): Promise<Meal> {
  const response = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(meal),
  });
  if (!response.ok) throw new Error("Failed to create meal");
  return response.json();
}

export function useMeals() {
  return useQuery({
    queryKey: ["meals"],
    queryFn: fetchMeals,
  });
}

export function useCreateMeal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMeal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meals"] });
    },
  });
}
