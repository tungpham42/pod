import axios from "axios";

// Calls our local Netlify proxy
const api = axios.create({
  baseURL: "/api",
});

export const getProducts = async () => {
  const res = await api.get("/products");
  return res.data;
};

export const createOrder = async (orderData: any) => {
  const res = await api.post("/create-order", orderData);
  return res.data;
};

export const getProductDetails = async (id: number) => {
  const res = await api.get(`/product-details?id=${id}`);
  return res.data; // This returns { sync_product: {}, sync_variants: [] }
};
