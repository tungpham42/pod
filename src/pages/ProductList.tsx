import React, { useEffect, useState } from "react";
import { Card, Col, Row, Button, Spin, Empty, Typography } from "antd";
import { Link } from "react-router-dom";
import { getProducts } from "../api";
import { ArrowRightOutlined } from "@ant-design/icons";

const { Meta } = Card;
const { Title } = Typography;

interface Props {
  addToCart: (item: any) => void;
}

const ProductList: React.FC<Props> = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts()
      .then((data) => setProducts(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div style={{ textAlign: "center", marginTop: 100 }}>
        <Spin size="large" />
        <p style={{ marginTop: 20, color: "#888" }}>Curating collection...</p>
      </div>
    );

  if (products.length === 0)
    return <Empty description="No treasures found right now" />;

  return (
    <>
      <div style={{ textAlign: "center", marginBottom: 60 }}>
        <Title level={1} style={{ fontSize: "2.5rem", marginBottom: 10 }}>
          Curated for You
        </Title>
        <Typography.Text type="secondary" style={{ fontSize: "1.1rem" }}>
          Unique designs printed on ethically sourced materials.
        </Typography.Text>
      </div>

      <Row gutter={[32, 48]}>
        {products.map((p) => (
          <Col xs={24} sm={12} md={8} lg={6} key={p.id}>
            <Link to={`/product/${p.id}`}>
              <Card
                className="cozy-card"
                hoverable
                cover={
                  <div
                    style={{
                      height: 320,
                      overflow: "hidden",
                      position: "relative",
                    }}
                  >
                    <img
                      alt={p.name}
                      src={p.thumbnail_url}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        transition: "transform 0.5s ease",
                      }}
                      onMouseOver={(e) =>
                        (e.currentTarget.style.transform = "scale(1.05)")
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.transform = "scale(1.0)")
                      }
                    />
                  </div>
                }
              >
                <Meta
                  title={
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span style={{ fontSize: 18 }}>{p.name}</span>
                    </div>
                  }
                  description={
                    <div
                      style={{
                        marginTop: 10,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <span
                        style={{
                          color: "#e07a5f",
                          fontWeight: "bold",
                          fontSize: 16,
                        }}
                      >
                        From ${p.retail_price || "25.00"}
                      </span>
                      <Button
                        type="text"
                        shape="circle"
                        icon={<ArrowRightOutlined />}
                      />
                    </div>
                  }
                />
              </Card>
            </Link>
          </Col>
        ))}
      </Row>
    </>
  );
};

export default ProductList;
