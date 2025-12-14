import { Handler } from "@netlify/functions";
import axios from "axios";
import { corsHeaders } from "./utils/cors"; // Import the headers

export const handler: Handler = async (event, context) => {
  // 1. Handle OPTIONS (Preflight) Request
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: "",
    };
  }

  const PRINTFUL_API_KEY = process.env.PRINTFUL_API_KEY;

  try {
    const response = await axios.get(
      "https://api.printful.com/store/products",
      {
        headers: {
          Authorization: `Bearer ${PRINTFUL_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return {
      statusCode: 200,
      headers: corsHeaders, // 2. Add headers to success response
      body: JSON.stringify(response.data.result),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: corsHeaders, // 3. Add headers to error response
      body: JSON.stringify({ message: "Failed to fetch products" }),
    };
  }
};
