// PayPal Sandbox Configuration
export const PAYPAL_CONFIG = {
  // Your PayPal sandbox credentials
  CLIENT_ID: "AYJaJBXy8gcF-IlmX7-XIKhp4e7XBVGfLm6YuQiFr_qf7C7csjnO-aUqPnW4mC7Z_OHg60S9qD3IVDTm",
  CLIENT_SECRET: "ENgFb6KaTNvdU-cOBi7qYfxgiAPsMgo6vksjLXpANF2GhkGiDcE7dSokIAcnHMZdn9ovOACvTmiQvDwN",

  // Sandbox environment
  ENVIRONMENT: "sandbox" as const,

  // PayPal API URLs
  BASE_URL: "https://api.sandbox.paypal.com",

  // Currency
  CURRENCY: "USD" as const,

  // Return URLs (these will be your actual domain)
  RETURN_URL: window.location.origin + "/payment/success",
  CANCEL_URL: window.location.origin + "/payment/cancel",

  // Webhook endpoint
  WEBHOOK_URL: window.location.origin + "/api/paypal/webhook",
} as const;

// PayPal SDK options for react-paypal-js with enhanced payment options
export const paypalScriptOptions = {
  "client-id": PAYPAL_CONFIG.CLIENT_ID,
  "buyer-country": "US",
  currency: PAYPAL_CONFIG.CURRENCY,
  intent: "capture",
  components: "buttons,messages",
  "enable-funding": "paylater", // Enable Pay Later (more stable with client-side)
  "disable-funding": "", // Don't disable any funding sources
  "data-sdk-integration-source": "react-paypal-js",
};

// Helper to get access token for server-side API calls
export async function getPayPalAccessToken(): Promise<string> {
  const auth = Buffer.from(
    `${PAYPAL_CONFIG.CLIENT_ID}:${PAYPAL_CONFIG.CLIENT_SECRET}`,
  ).toString("base64");

  const response = await fetch(`${PAYPAL_CONFIG.BASE_URL}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${auth}`,
    },
    body: "grant_type=client_credentials",
  });

  if (!response.ok) {
    throw new Error(`PayPal auth failed: ${response.statusText}`);
  }

  const data = await response.json();
  return data.access_token;
}

// Create PayPal order
export interface CreateOrderData {
  invoiceId: string;
  amount: string;
  currency?: string;
  description?: string;
}

export async function createPayPalOrder(orderData: CreateOrderData) {
  const accessToken = await getPayPalAccessToken();

  const order = {
    intent: "CAPTURE",
    purchase_units: [
      {
        reference_id: orderData.invoiceId,
        description:
          orderData.description || `Payment for Invoice ${orderData.invoiceId}`,
        amount: {
          currency_code: orderData.currency || PAYPAL_CONFIG.CURRENCY,
          value: orderData.amount,
        },
      },
    ],
    application_context: {
      brand_name: "Design Agency",
      landing_page: "BILLING",
      user_action: "PAY_NOW",
      return_url: PAYPAL_CONFIG.RETURN_URL,
      cancel_url: PAYPAL_CONFIG.CANCEL_URL,
    },
  };

  const response = await fetch(`${PAYPAL_CONFIG.BASE_URL}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(order),
  });

  if (!response.ok) {
    throw new Error(`PayPal order creation failed: ${response.statusText}`);
  }

  return response.json();
}

// Capture PayPal order
export async function capturePayPalOrder(orderId: string) {
  const accessToken = await getPayPalAccessToken();

  const response = await fetch(
    `${PAYPAL_CONFIG.BASE_URL}/v2/checkout/orders/${orderId}/capture`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error(`PayPal order capture failed: ${response.statusText}`);
  }

  return response.json();
}

// Get order details
export async function getPayPalOrderDetails(orderId: string) {
  const accessToken = await getPayPalAccessToken();

  const response = await fetch(
    `${PAYPAL_CONFIG.BASE_URL}/v2/checkout/orders/${orderId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error(`PayPal get order failed: ${response.statusText}`);
  }

  return response.json();
}
