import { Handler } from "@netlify/functions";
import axios from "axios";

export const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const PRINTFUL_API_KEY = process.env.PRINTFUL_API_KEY;
  const data = JSON.parse(event.body || "{}");

  try {
    // Create a generic order payload
    // In a real app, you would validate payment via Stripe here first
    const orderPayload = {
      recipient: data.recipient,
      items: data.items,
    };

    const response = await axios.post(
      "https://api.printful.com/orders",
      orderPayload,
      {
        headers: {
          Authorization: `Bearer ${PRINTFUL_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return {
      statusCode: 200,
      body: JSON.stringify(response.data.result),
    };
  } catch (error: any) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: error.message }),
    };
  }
};
