import { Handler } from "@netlify/functions";
import axios from "axios";

export const handler: Handler = async (event, context) => {
  const PRINTFUL_API_KEY = process.env.PRINTFUL_API_KEY;

  if (!PRINTFUL_API_KEY) {
    return { statusCode: 500, body: "Missing API Key" };
  }

  try {
    // Fetch Sync Products (Products you've designed in Printful Dashboard)
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
      body: JSON.stringify(response.data.result),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Failed to fetch products" }),
    };
  }
};
