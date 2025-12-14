import React from "react";
import {
  Form,
  Input,
  Button,
  Card,
  message,
  Typography,
  Row,
  Col,
  Divider,
} from "antd";
import { createOrder } from "../api";
import { CartItem } from "../App";
import { SafetyCertificateOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

interface Props {
  cartItems: CartItem[];
}

const Checkout: React.FC<Props> = ({ cartItems }) => {
  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    // ... (Keep existing logic for createOrder) ...
    // Using dummy logic for display:
    if (cartItems.length === 0) {
      message.error("Cart is empty!");
      return;
    }

    const orderData = {
      recipient: {
        name: values.name,
        address1: values.address,
        city: values.city,
        state_code: values.state,
        country_code: values.country,
        zip: values.zip,
      },
      items: cartItems.map((item) => ({
        sync_variant_id: item.id,
        quantity: item.quantity,
      })),
    };

    try {
      message.loading({ content: "Placing your order...", key: "order" });
      await createOrder(orderData);
      message.success({
        content: "Thank you! Your order is being crafted.",
        key: "order",
      });
    } catch (error) {
      message.error({ content: "Something went wrong.", key: "order" });
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <Title level={2}>Secure Checkout</Title>
        <Text type="secondary">Where should we send your package?</Text>
      </div>

      <Row gutter={48}>
        {/* Left: Form */}
        <Col xs={24} md={14}>
          <Card className="cozy-card" bordered={false} style={{ padding: 20 }}>
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              requiredMark="optional"
            >
              <Form.Item
                name="name"
                label="Full Name"
                rules={[{ required: true, message: "Required" }]}
              >
                <Input placeholder="Jane Doe" />
              </Form.Item>
              <Form.Item
                name="address"
                label="Street Address"
                rules={[{ required: true, message: "Required" }]}
              >
                <Input placeholder="123 Cozy Lane" />
              </Form.Item>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="city"
                    label="City"
                    rules={[{ required: true, message: "Required" }]}
                  >
                    <Input placeholder="Cityville" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="state"
                    label="State (Code)"
                    rules={[{ required: true, message: "Required" }]}
                  >
                    <Input placeholder="NY" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="country"
                    label="Country (Code)"
                    rules={[{ required: true, message: "Required" }]}
                  >
                    <Input placeholder="US" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="zip"
                    label="Zip Code"
                    rules={[{ required: true, message: "Required" }]}
                  >
                    <Input placeholder="10001" />
                  </Form.Item>
                </Col>
              </Row>

              <Button
                type="primary"
                htmlType="submit"
                block
                size="large"
                style={{ marginTop: 20, height: 50, fontSize: 16 }}
              >
                Confirm Order
              </Button>
            </Form>
          </Card>
        </Col>

        {/* Right: Summary */}
        <Col xs={24} md={10}>
          <div
            style={{
              background: "#fff",
              padding: 24,
              borderRadius: 24,
              boxShadow: "0 4px 20px rgba(0,0,0,0.02)",
            }}
          >
            <Title level={4} style={{ marginTop: 0 }}>
              Order Summary
            </Title>
            {cartItems.map((item, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 12,
                  fontSize: 14,
                }}
              >
                <span>
                  {item.name}{" "}
                  <span style={{ color: "#999" }}>x{item.quantity}</span>
                </span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <Divider />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: 18,
                fontWeight: "bold",
                color: "#e07a5f",
              }}
            >
              <span>Total</span>
              <span>
                $
                {cartItems
                  .reduce((a, c) => a + c.price * c.quantity, 0)
                  .toFixed(2)}
              </span>
            </div>

            <div
              style={{
                marginTop: 30,
                display: "flex",
                gap: 10,
                alignItems: "center",
                color: "#888",
                fontSize: 12,
                justifyContent: "center",
              }}
            >
              <SafetyCertificateOutlined style={{ fontSize: 16 }} />
              <span>Secure SSL Encryption</span>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Checkout;
