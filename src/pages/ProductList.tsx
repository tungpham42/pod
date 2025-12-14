import React, { useEffect, useState } from "react";
import { Card, Col, Row, Button, Spin, Empty } from "antd";
import { getProducts } from "../api";

const { Meta } = Card;

interface Props {
  addToCart: (item: any) => void;
}

const ProductList: React.FC<Props> = ({ addToCart }) => {
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
      <div style={{ textAlign: "center", marginTop: 50 }}>
        <Spin size="large" />
      </div>
    );
  if (products.length === 0)
    return <Empty description="No products found in Printful store" />;

  return (
    <Row gutter={[16, 16]}>
      {products.map((p) => (
        <Col xs={24} sm={12} md={8} lg={6} key={p.id}>
          <Card
            hoverable
            cover={
              <img
                alt={p.name}
                src={p.thumbnail_url}
                style={{ height: 250, objectFit: "cover" }}
              />
            }
            actions={[
              <Button type="primary" onClick={() => addToCart(p)}>
                Add to Cart
              </Button>,
            ]}
          >
            <Meta
              title={p.name}
              description={`Total Variants: ${p.variants}`}
            />
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default ProductList;
