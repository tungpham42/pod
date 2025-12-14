import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Row,
  Col,
  Typography,
  Radio,
  Button,
  Image,
  Tag,
  Spin,
  message,
  Divider,
} from "antd";
import { ShoppingCartOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { getProductDetails } from "../api";

const { Title, Text, Paragraph } = Typography;

// ... (Keep existing Interfaces: PrintfulFile, Variant, ProductData, Props) ...
// (I will omit repeating the interfaces to save space, assuming they are the same as your previous code)

interface PrintfulFile {
  type: string;
  preview_url: string;
}
interface Variant {
  id: number;
  name: string;
  retail_price: string;
  currency: string;
  files: PrintfulFile[];
  color?: string;
  size?: string;
}
interface ProductData {
  sync_product: { id: number; name: string; thumbnail_url: string };
  sync_variants: Variant[];
}
interface Props {
  addToCart: (item: any) => void;
}

const ProductDetail: React.FC<Props> = ({ addToCart }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  // ... (Keep existing useEffect fetch logic, colors useMemo, availableSizes useMemo, activeVariant useMemo, displayImage useMemo) ...
  // Assuming the logic inside these hooks remains exactly as the robust version I gave you previously.

  // Re-inserting the useEffect logic briefly for context:
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getProductDetails(Number(id))
      .then((res) => {
        const processed = res.sync_variants.map((v: any) => {
          const parts = v.name.split(" - ");
          let size = "Standard",
            color = "Standard";
          if (parts.length >= 3) {
            size = parts.pop();
            color = parts.pop();
          }
          return { ...v, color, size };
        });
        setData({ ...res, sync_variants: processed });
        if (processed.length > 0) setSelectedColor(processed[0].color);
      })
      .finally(() => setLoading(false));
  }, [id]);

  const colors = useMemo(
    () =>
      data
        ? Array.from(
            new Set(
              data.sync_variants
                .map((v) => v.color)
                .filter((c) => c !== "Standard")
            )
          )
        : [],
    [data]
  );
  const availableSizes = useMemo(() => {
    if (!data) return [];
    let filtered = data.sync_variants;
    if (selectedColor)
      filtered = filtered.filter((v) => v.color === selectedColor);
    return Array.from(new Set(filtered.map((v) => v.size)));
  }, [data, selectedColor]);

  const activeVariant = useMemo(
    () =>
      data?.sync_variants.find(
        (v) =>
          (colors.length === 0 || v.color === selectedColor) &&
          v.size === selectedSize
      ),
    [data, selectedColor, selectedSize, colors]
  );

  // Use main thumbnail if no specific variant image found
  const displayImage =
    activeVariant?.files.find((f) => f.type === "preview")?.preview_url ||
    data?.sync_product.thumbnail_url;

  const handleAddToCart = () => {
    if (!activeVariant) {
      message.error("Please select a size to continue.");
      return;
    }
    addToCart({
      id: activeVariant.id,
      name: data?.sync_product.name,
      variantName: `${selectedColor || ""} ${selectedSize || ""}`.trim(),
      thumbnail_url: displayImage,
      price: activeVariant.retail_price,
      quantity: 1,
    });
  };

  if (loading)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "100px 0",
        }}
      >
        <Spin size="large" />
      </div>
    );
  if (!data) return <div>Product not found</div>;

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto" }}>
      <Button
        type="text"
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate("/")}
        style={{ marginBottom: 20, color: "#888" }}
      >
        Back to Collection
      </Button>

      <Row gutter={[64, 32]} align="middle">
        {/* Left: Gentle Image Presentation */}
        <Col xs={24} md={12}>
          <div
            style={{
              borderRadius: 30,
              overflow: "hidden",
              boxShadow: "0 20px 40px rgba(0,0,0,0.05)",
              background: "#fff",
              padding: 20,
            }}
          >
            <Image
              src={displayImage}
              alt={data.sync_product.name}
              width="100%"
              style={{ objectFit: "contain", borderRadius: 20 }}
            />
          </div>
        </Col>

        {/* Right: Friendly Details */}
        <Col xs={24} md={12}>
          <Tag
            color="#81b29a"
            style={{
              border: "none",
              borderRadius: 20,
              padding: "4px 12px",
              marginBottom: 10,
            }}
          >
            New Arrival
          </Tag>
          <Title level={1} style={{ marginTop: 5, marginBottom: 10 }}>
            {data.sync_product.name}
          </Title>
          <Title
            level={3}
            style={{ color: "#e07a5f", marginTop: 0, fontWeight: 400 }}
          >
            $
            {activeVariant
              ? activeVariant.retail_price
              : data.sync_variants[0].retail_price}
          </Title>

          <Paragraph style={{ fontSize: 16, color: "#666", lineHeight: 1.8 }}>
            Hand-picked for its quality and comfort. This piece is printed just
            for you upon order, ensuring zero waste and a personal touch.
          </Paragraph>

          <Divider style={{ borderColor: "#eee" }} />

          {colors.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <Text
                strong
                style={{
                  display: "block",
                  marginBottom: 12,
                  fontSize: 14,
                  textTransform: "uppercase",
                  letterSpacing: 1,
                  color: "#999",
                }}
              >
                Select Color
              </Text>
              <Radio.Group
                value={selectedColor}
                onChange={(e) => {
                  setSelectedColor(e.target.value);
                  setSelectedSize(null);
                }}
              >
                {colors.map((color) => (
                  <Radio.Button
                    key={color}
                    value={color}
                    className="cozy-radio"
                  >
                    {color}
                  </Radio.Button>
                ))}
              </Radio.Group>
            </div>
          )}

          <div style={{ marginBottom: 40 }}>
            <Text
              strong
              style={{
                display: "block",
                marginBottom: 12,
                fontSize: 14,
                textTransform: "uppercase",
                letterSpacing: 1,
                color: "#999",
              }}
            >
              Select Size
            </Text>
            {availableSizes.length > 0 ? (
              <Radio.Group
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                size="large"
              >
                {availableSizes.map((size) => (
                  <Radio.Button key={size} value={size}>
                    {size}
                  </Radio.Button>
                ))}
              </Radio.Group>
            ) : (
              <Tag color="orange">Please select a color first</Tag>
            )}
          </div>

          <Button
            type="primary"
            size="large"
            icon={<ShoppingCartOutlined />}
            onClick={handleAddToCart}
            disabled={!activeVariant}
            block
            style={{
              height: 60,
              fontSize: 18,
              fontWeight: 600,
              boxShadow: "0 10px 25px rgba(224, 122, 95, 0.4)",
            }}
          >
            {activeVariant ? "Add to Your Cart" : "Select Options"}
          </Button>
        </Col>
      </Row>
    </div>
  );
};

export default ProductDetail;
