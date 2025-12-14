import React, { useState } from "react";
import { Layout, Menu, Badge, Drawer, List, Button, message } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ProductList from "./pages/ProductList";
import Checkout from "./pages/Checkout";

const { Header, Content, Footer } = Layout;

// Basic Cart Interface
export interface CartItem {
  id: number; // Printful Sync Variant ID
  name: string;
  thumbnail: string;
  price: number;
  quantity: number;
}

const App: React.FC = () => {
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const addToCart = (product: any) => {
    // Simplified: In reality, you need to select a Variant (Size/Color)
    // For this demo, we assume the product object has a sync_variant_id ready
    const newItem: CartItem = {
      id: product.id,
      name: product.name,
      thumbnail: product.thumbnail_url,
      price: 25.0, // Dummy price as Printful API doesn't always return retail price easily
      quantity: 1,
    };

    setCartItems((prev) => [...prev, newItem]);
    message.success("Added to cart");
  };

  return (
    <Router>
      <Layout className="min-h-screen">
        <Header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{ color: "white", fontWeight: "bold", fontSize: "1.2rem" }}
          >
            POD Store
          </div>
          <Menu
            theme="dark"
            mode="horizontal"
            defaultSelectedKeys={["1"]}
            items={[]}
          />
          <div style={{ cursor: "pointer" }} onClick={() => setCartOpen(true)}>
            <Badge count={cartItems.length}>
              <ShoppingCartOutlined
                style={{ fontSize: "24px", color: "white" }}
              />
            </Badge>
          </div>
        </Header>

        <Content style={{ padding: "20px 50px" }}>
          <Routes>
            <Route path="/" element={<ProductList addToCart={addToCart} />} />
            <Route
              path="/checkout"
              element={<Checkout cartItems={cartItems} />}
            />
          </Routes>
        </Content>

        <Drawer
          title="Your Cart"
          placement="right"
          onClose={() => setCartOpen(false)}
          open={cartOpen}
        >
          <List
            itemLayout="horizontal"
            dataSource={cartItems}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  title={item.name}
                  description={`$${item.price} x ${item.quantity}`}
                />
              </List.Item>
            )}
          />
          <div style={{ marginTop: 20 }}>
            <Link to="/checkout" onClick={() => setCartOpen(false)}>
              <Button type="primary" block size="large">
                Proceed to Checkout
              </Button>
            </Link>
          </div>
        </Drawer>

        <Footer style={{ textAlign: "center" }}>
          POD Store ©2025 Created with React & Netlify
        </Footer>
      </Layout>
    </Router>
  );
};

export default App;
