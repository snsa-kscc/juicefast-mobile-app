import { verifyToken } from "@clerk/backend";

// Validate Expo push token format
function isValidExpoPushToken(token: string): boolean {
  // Expo push tokens start with "ExponentPushToken[" or are a 32-character hex string
  return (
    (token.startsWith("ExponentPushToken[") && token.endsWith("]")) ||
    /^[a-fA-F0-9]{32}$/.test(token)
  );
}

// Validate Clerk session token
async function validateClerkToken(
  request: Request
): Promise<{ userId: string } | null> {
  try {
    const authorizationHeader = request.headers.get("Authorization");

    if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
      return null;
    }

    const token = authorizationHeader.split(" ")[1];

    // Verify the token with Clerk
    const payload = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY,
    });

    if (!payload?.sub) {
      return null;
    }

    return { userId: payload.sub };
  } catch (error) {
    console.error("Token validation error:", error);
    return null;
  }
}

export async function POST(request: Request) {
  try {
    // Authenticate user with Clerk
    const authResult = await validateClerkToken(request);

    if (!authResult) {
      return new Response(
        JSON.stringify({ error: "Unauthorized - Invalid or missing token" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    const { userId } = authResult;

    const body = await request.json();

    // Validate required fields
    const {
      to,
      title,
      body: messageBody,
      data,
      priority,
      channelId,
      sound,
    } = body;

    if (!to || !title || !messageBody) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: to, title, body" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Validate push token format
    if (!isValidExpoPushToken(to)) {
      return new Response(
        JSON.stringify({ error: "Invalid Expo push token format" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Validate message length
    if (title.length > 100) {
      return new Response(
        JSON.stringify({ error: "Title must be 100 characters or less" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (messageBody.length > 500) {
      return new Response(
        JSON.stringify({
          error: "Message body must be 500 characters or less",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Prepare the push notification message
    const message = {
      to,
      sound: sound || "default",
      title,
      body: messageBody,
      data: {
        ...data,
        senderId: userId, // Track which user sent the notification
        timestamp: new Date().toISOString(),
      },
      priority: priority || "high",
      channelId: channelId || "default",
    };

    // Send to Expo's push service
    const response = await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Push notification failed:", result);
      return new Response(
        JSON.stringify({
          error: result.message || "Failed to send push notification",
        }),
        {
          status: response.status,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    if (result.data?.status === "error") {
      console.error("Push notification error:", result.data);
      return new Response(
        JSON.stringify({
          error: result.data.message || "Push notification error",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    console.log(
      `Push notification sent successfully by user ${userId}:`,
      result.data
    );
    return new Response(
      JSON.stringify({
        success: true,
        data: result.data,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Failed to send push notification:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
