import React, { useState } from "react";
import {
  Layout,
  Badge,
  Drawer,
  List,
  Button,
  message,
  ConfigProvider,
  Avatar,
  Typography,
} from "antd";
import { ShoppingCartOutlined, HeartFilled } from "@ant-design/icons";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ProductList from "./pages/ProductList";
import ProductDetail from "./pages/ProductDetail"; // Make sure this is imported
import Checkout from "./pages/Checkout";
import "./App.css";

const { Header, Content, Footer } = Layout;
const { Text } = Typography;

export interface CartItem {
  id: number;
  name: string;
  variantName?: string; // Added to track specific size/color
  thumbnail: string;
  price: number;
  quantity: number;
}

const App: React.FC = () => {
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (product: any) => {
    // Check if item exists to update quantity instead of duplicate
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          variantName: product.variantName || "Standard",
          thumbnail: product.thumbnail_url || product.thumbnail,
          price: Number(product.price),
          quantity: 1,
        },
      ];
    });
    message.success({
      content: "Added to your collection!",
      icon: <HeartFilled style={{ color: "#e07a5f" }} />,
    });
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#e07a5f", // Warm Terracotta
          fontFamily: "'Nunito', sans-serif",
          borderRadius: 12,
          colorBgLayout: "#fcfbf9",
          colorTextHeading: "#3d3a36",
        },
        components: {
          Button: {
            borderRadius: 50, // Pill shaped buttons
            controlHeightLG: 50,
          },
          Input: {
            borderRadius: 12,
            controlHeight: 45,
            colorBgContainer: "#ffffff",
          },
          Card: {
            borderRadiusLG: 24,
          },
        },
      }}
    >
      <Router>
        <Layout className="min-h-screen" style={{ background: "transparent" }}>
          {/* Header */}
          <Header
            className="cozy-header"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Link to="/" style={{ textDecoration: "none" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 35,
                    height: 35,
                    background: "#e07a5f",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    fontSize: 18,
                    fontWeight: "bold",
                  }}
                >
                  PT
                </div>
                <span
                  style={{
                    fontFamily: "'Lora', serif",
                    fontSize: "1.5rem",
                    fontWeight: 600,
                    color: "#3d3a36",
                  }}
                >
                  Paper & Thread
                </span>
              </div>
            </Link>

            <div
              onClick={() => setCartOpen(true)}
              style={{
                cursor: "pointer",
                background: "#f5f5f5",
                padding: "8px 16px",
                borderRadius: 30,
                transition: "0.2s",
              }}
            >
              <Badge
                count={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                color="#e07a5f"
              >
                <ShoppingCartOutlined
                  style={{ fontSize: "22px", color: "#3d3a36" }}
                />
              </Badge>
              <span
                style={{ marginLeft: 10, fontWeight: 600, color: "#3d3a36" }}
              >
                Cart
              </span>
            </div>
          </Header>

          {/* Main Content */}
          <Content
            style={{
              padding: "40px 20px",
              maxWidth: 1200,
              margin: "0 auto",
              width: "100%",
            }}
          >
            <Routes>
              <Route path="/" element={<ProductList addToCart={addToCart} />} />
              <Route
                path="/product/:id"
                element={<ProductDetail addToCart={addToCart} />}
              />
              <Route
                path="/checkout"
                element={<Checkout cartItems={cartItems} />}
              />
            </Routes>
          </Content>

          {/* Cart Drawer */}
          <Drawer
            title={
              <span style={{ fontFamily: "Lora", fontSize: 20 }}>
                Your Collection
              </span>
            }
            placement="right"
            onClose={() => setCartOpen(false)}
            open={cartOpen}
            width={400}
            styles={{ header: { borderBottom: "none" } }}
          >
            <List
              itemLayout="horizontal"
              dataSource={cartItems}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        src={item.thumbnail}
                        shape="square"
                        size={64}
                        style={{ borderRadius: 10 }}
                      />
                    }
                    title={
                      <Text strong style={{ fontSize: 16 }}>
                        {item.name}
                      </Text>
                    }
                    description={
                      <div>
                        <Text type="secondary" style={{ fontSize: 13 }}>
                          {item.variantName}
                        </Text>
                        <div style={{ marginTop: 4 }}>
                          ${item.price.toFixed(2)} × {item.quantity}
                        </div>
                      </div>
                    }
                  />
                  <div style={{ fontWeight: "bold", fontSize: 16 }}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </List.Item>
              )}
            />
            {cartItems.length > 0 && (
              <div style={{ marginTop: 30 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 20,
                    fontSize: 18,
                    fontWeight: "bold",
                  }}
                >
                  <span>Total</span>
                  <span>
                    $
                    {cartItems
                      .reduce(
                        (acc, item) => acc + item.price * item.quantity,
                        0
                      )
                      .toFixed(2)}
                  </span>
                </div>
                <Link to="/checkout" onClick={() => setCartOpen(false)}>
                  <Button
                    type="primary"
                    block
                    size="large"
                    style={{ height: 50, fontSize: 16 }}
                  >
                    Proceed to Checkout
                  </Button>
                </Link>
              </div>
            )}
            {cartItems.length === 0 && (
              <div
                style={{ textAlign: "center", marginTop: 50, color: "#ccc" }}
              >
                <ShoppingCartOutlined
                  style={{ fontSize: 48, marginBottom: 10 }}
                />
                <p>Your cart is empty</p>
                <Button onClick={() => setCartOpen(false)}>
                  Start Browsing
                </Button>
              </div>
            )}
          </Drawer>

          <Footer
            style={{
              textAlign: "center",
              background: "transparent",
              color: "#888",
            }}
          >
            Paper & Thread ©2025 • Crafted with Warmth
          </Footer>
        </Layout>
      </Router>
    </ConfigProvider>
  );
};

export default App;
