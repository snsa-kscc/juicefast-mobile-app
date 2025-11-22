const WC_URL = process.env.EXPO_PUBLIC_WC_URL;
const CONSUMER_KEY = process.env.WP_CK;
const CONSUMER_SECRET = process.env.WP_CS;
const YEARLY_PRODUCT_ID = parseInt(
  process.env.EXPO_PUBLIC_YEARLY_PRODUCT_ID || "0"
);
const MONTHLY_PRODUCT_ID = parseInt(
  process.env.EXPO_PUBLIC_MONTHLY_PRODUCT_ID || "0"
);

interface SubscriptionInfo {
  isActive: boolean;
  plan?: "monthly" | "yearly";
  expiryDate?: string;
  subscriptionId?: number;
}

async function checkWooCommerceSubscription(
  email: string
): Promise<SubscriptionInfo> {
  const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString(
    "base64"
  );

  try {
    const response = await fetch(
      `${WC_URL}/subscriptions?customer_email=${encodeURIComponent(email)}&status=active&per_page=100`,
      {
        method: "GET",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`WooCommerce API error: ${response.status}`);
    }

    const subscriptions = await response.json();

    const mobileSubscription = subscriptions.find((sub: any) =>
      sub.line_items.some((item: any) =>
        [YEARLY_PRODUCT_ID, MONTHLY_PRODUCT_ID].includes(item.product_id)
      )
    );

    if (!mobileSubscription) {
      return { isActive: false };
    }

    const hasYearly = mobileSubscription.line_items.some(
      (item: any) => item.product_id === YEARLY_PRODUCT_ID
    );

    return {
      isActive: true,
      plan: hasYearly ? "yearly" : "monthly",
      expiryDate: mobileSubscription.next_payment_date,
      subscriptionId: mobileSubscription.id,
    };
  } catch (error) {
    console.error("Error checking WooCommerce subscription:", error);
    return { isActive: false };
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return Response.json({ error: "Email is required" }, { status: 400 });
    }

    const subscriptionInfo = await checkWooCommerceSubscription(email);

    return Response.json(subscriptionInfo);
  } catch (error) {
    console.error("API error:", error);
    return Response.json(
      { error: "Failed to check subscription status" },
      { status: 500 }
    );
  }
}
