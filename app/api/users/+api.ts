// Expo API Route - equivalent to Next.js API route
export async function GET(request: Request) {
  try {
    // This would be your server logic (formerly SSR or server action)
    const users = await fetchUsersFromDatabase();
    
    return Response.json({ 
      success: true, 
      data: users 
    });
  } catch (error) {
    return Response.json(
      { success: false, error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // This would be your former server action logic
    const newUser = await createUserInDatabase(body);
    
    return Response.json({ 
      success: true, 
      data: newUser 
    });
  } catch (error) {
    return Response.json(
      { success: false, error: 'Failed to create user' },
      { status: 500 }
    );
  }
}

// Mock database functions (replace with your actual DB logic)
async function fetchUsersFromDatabase() {
  // Your existing database logic here
  return [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' }
  ];
}

async function createUserInDatabase(userData: any) {
  // Your existing user creation logic here
  return { id: 3, ...userData };
}
