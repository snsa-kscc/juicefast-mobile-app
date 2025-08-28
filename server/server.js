import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const PORT = 3001;
const DB_PATH = './meals.json';

const MealsSchema = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string(),
  meal: z.enum(["breakfast", "lunch", "dinner", "snack"]),
  calories: z.number(),
  protein: z.number(),
  carbs: z.number(),
  fat: z.number(),
  description: z.string().optional(),
  timestamp: z.string(),
});

const CreateMealSchema = MealsSchema.omit({ id: true, timestamp: true });

app.use(cors());
app.use(express.json());

// Authorization disabled for local development

async function readMeals() {
  try {
    const data = await fs.readFile(DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeMeals(meals) {
  try {
    await fs.writeFile(DB_PATH, JSON.stringify(meals, null, 2));
  } catch (error) {
    throw new Error('Failed to write meals data');
  }
}

app.get('/api/meals', async (req, res) => {
  try {
    const { userId } = req.query;
    
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const meals = await readMeals();
    const userMeals = meals.filter(meal => meal.userId === userId);
    
    res.json(userMeals);
  } catch {
    res.status(500).json({ error: 'Failed to fetch meals' });
  }
});

app.post('/api/meals', async (req, res) => {
  try {
    const validatedData = CreateMealSchema.parse(req.body);
    
    const meals = await readMeals();
    const newMeal = {
      ...validatedData,
      id: uuidv4(),
      timestamp: new Date().toISOString(),
    };
    
    meals.push(newMeal);
    await writeMeals(meals);
    
    res.status(201).json(newMeal);
  } catch {
    res.status(400).json({ error: 'Failed to create meal' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});