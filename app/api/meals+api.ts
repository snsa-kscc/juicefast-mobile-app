
export async function GET(request: Request) {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return Response.json([
    {
      id: "1",
      userId: "user1",
      name: "Grilled Chicken Salad",
      meal: "lunch",
      calories: 350,
      protein: 30,
      carbs: 15,
      fat: 18,
      description: "Fresh mixed greens with grilled chicken breast",
      timestamp: new Date().toISOString()
    },
    {
      id: "2",
      userId: "user1",
      name: "Oatmeal with Berries",
      meal: "breakfast",
      calories: 280,
      protein: 8,
      carbs: 45,
      fat: 6,
      description: "Steel-cut oats topped with fresh blueberries",
      timestamp: new Date().toISOString()
    }
  ]);
}

export async function POST(request: Request) {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const body = await request.json();
  
  return Response.json({
    id: Math.random().toString(36).substr(2, 9),
    ...body,
    timestamp: new Date().toISOString()
  }, { status: 201 });
}