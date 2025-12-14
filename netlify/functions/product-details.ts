import { Handler } from "@netlify/functions";
import axios from "axios";
import { corsHeaders } from "./utils/cors";

export const handler: Handler = async (event) => {
  // 1. Handle CORS Preflight
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: "",
    };
  }

  const PRINTFUL_API_KEY = process.env.PRINTFUL_API_KEY;

  // Get ID from query parameters (e.g., ?id=123)
  const { id } = event.queryStringParameters || {};

  if (!id) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ message: "Product ID is required" }),
    };
  }

  try {
    // Fetch specific Sync Product details (contains all variants)
    const response = await axios.get(
      `https://api.printful.com/store/products/${id}`,
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
    console.error("Product Details Error:", error.message);

    return {
      statusCode: 500,
      headers: corsHeaders, // CORS Header on Error
      body: JSON.stringify({ message: "Failed to fetch product details" }),
    };
  }
};
