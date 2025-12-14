import React from "react";
import { Form, Input, Button, Card, message } from "antd";
import { createOrder } from "../api";
import { CartItem } from "../App";

interface Props {
  cartItems: CartItem[];
}

const Checkout: React.FC<Props> = ({ cartItems }) => {
  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    if (cartItems.length === 0) {
      message.error("Cart is empty!");
      return;
    }

    const orderData = {
      recipient: {
        name: values.name,
        address1: values.address,
        city: values.city,
        state_code: values.state, // Printful requires strict ISO codes
        country_code: values.country, // e.g., 'US'
        zip: values.zip,
      },
      items: cartItems.map((item) => ({
        sync_variant_id: item.id, // In a real app, ensure this maps to a Variant ID, not Product ID
        quantity: item.quantity,
      })),
    };

    try {
      message.loading({ content: "Processing order...", key: "order" });
      await createOrder(orderData);
      message.success({ content: "Order placed successfully!", key: "order" });
    } catch (error) {
      message.error({ content: "Failed to place order.", key: "order" });
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto" }}>
      <Card title="Checkout">
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="name" label="Full Name" rules={[{ required: true }]}>
            <Input placeholder="John Doe" />
          </Form.Item>
          <Form.Item
            name="address"
            label="Address"
            rules={[{ required: true }]}
          >
            <Input placeholder="123 Main St" />
          </Form.Item>
          <Form.Item style={{ marginBottom: 0 }}>
            <Form.Item
              name="city"
              label="City"
              rules={[{ required: true }]}
              style={{ display: "inline-block", width: "calc(50% - 8px)" }}
            >
              <Input placeholder="New York" />
            </Form.Item>
            <Form.Item
              name="state"
              label="State Code"
              rules={[{ required: true }]}
              style={{
                display: "inline-block",
                width: "calc(50% - 8px)",
                margin: "0 0 0 16px",
              }}
            >
              <Input placeholder="NY" />
            </Form.Item>
          </Form.Item>
          <Form.Item style={{ marginBottom: 0 }}>
            <Form.Item
              name="country"
              label="Country Code"
              rules={[{ required: true }]}
              style={{ display: "inline-block", width: "calc(50% - 8px)" }}
            >
              <Input placeholder="US" />
            </Form.Item>
            <Form.Item
              name="zip"
              label="Zip Code"
              rules={[{ required: true }]}
              style={{
                display: "inline-block",
                width: "calc(50% - 8px)",
                margin: "0 0 0 16px",
              }}
            >
              <Input placeholder="10001" />
            </Form.Item>
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            block
            size="large"
            style={{ marginTop: 20 }}
          >
            Place Order
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default Checkout;
