export async function GET(request: Request) {
  // Simulate a delay to show loading state
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  return Response.json({ 
    message: "Hello World!", 
    timestamp: new Date().toISOString() 
  });
}
