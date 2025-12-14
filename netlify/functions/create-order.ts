import { Handler } from "@netlify/functions";
import axios from "axios";
import { corsHeaders } from "./utils/cors";

export const handler: Handler = async (event) => {
  // 1. Handle CORS Preflight (Browser checking if it's allowed to send data)
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: "",
    };
  }

  // 2. Ensure only POST requests are allowed
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: "Method Not Allowed",
    };
  }

  const PRINTFUL_API_KEY = process.env.PRINTFUL_API_KEY;

  try {
    const data = JSON.parse(event.body || "{}");

    // Basic Validation
    if (!data.recipient || !data.items || data.items.length === 0) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ message: "Missing recipient or items data" }),
      };
    }

    // Construct the payload for Printful
    // Note: We use the data sent from the frontend
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
      headers: corsHeaders, // CORS Header on Success
      body: JSON.stringify(response.data.result),
    };
  } catch (error: any) {
    console.error(
      "Printful Order Error:",
      error.response?.data || error.message
    );

    return {
      statusCode: 500,
      headers: corsHeaders, // CORS Header on Error
      body: JSON.stringify({
        message:
          error.response?.data?.result ||
          error.message ||
          "Failed to create order",
      }),
    };
  }
};
