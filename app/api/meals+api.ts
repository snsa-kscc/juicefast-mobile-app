
import * as FileSystem from 'expo-file-system';
import { MealsSchema, CreateMealSchema, type Meal } from '@/schemas/MealsSchema';
import { v4 as uuidv4 } from 'uuid';

const DB_PATH = `${FileSystem.documentDirectory}meals.json`;

async function readMeals(): Promise<Meal[]> {
  try {
    const fileExists = await FileSystem.getInfoAsync(DB_PATH);
    if (!fileExists.exists) {
      await FileSystem.writeAsStringAsync(DB_PATH, JSON.stringify([]));
      return [];
    }
    const data = await FileSystem.readAsStringAsync(DB_PATH);
    const parsed = JSON.parse(data);
    return MealsSchema.array().parse(parsed);
  } catch {
    return [];
  }
}

async function writeMeals(meals: Meal[]): Promise<void> {
  try {
    await FileSystem.writeAsStringAsync(DB_PATH, JSON.stringify(meals, null, 2));
  } catch (error) {
    throw new Error('Failed to write meals data');
  }
}

export async function GET(request: Request): Promise<Response> {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');
    
    if (!userId) {
      return new Response(JSON.stringify({ error: 'userId is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const meals = await readMeals();
    const userMeals = meals.filter(meal => meal.userId === userId);
    
    return new Response(JSON.stringify(userMeals), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch meals' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function POST(request: Request): Promise<Response> {
  try {
    const body = await request.json();
    const validatedData = CreateMealSchema.parse(body);
    
    const meals = await readMeals();
    const newMeal: Meal = {
      ...validatedData,
      id: uuidv4(),
      timestamp: new Date().toISOString(),
    };
    
    meals.push(newMeal);
    await writeMeals(meals);
    
    return new Response(JSON.stringify(newMeal), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to create meal' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}