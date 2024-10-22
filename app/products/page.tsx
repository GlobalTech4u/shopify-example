import Link from "next/link";
import { gql } from "@apollo/client";
import client from "../../lib/apolloClient";
import { Card, CardContent, CardHeader, Rating } from "@mui/material";
import styles from "./ProductsPage.module.css";

const GET_PRODUCTS = gql`
  query GetProducts($channel: String!) {
    products(first: 20, channel: $channel) {
      edges {
        node {
          id
          name
          description
          category {
            name
          }
          rating
          pricing {
            priceRange {
              start {
                gross {
                  amount
                  currency
                }
              }
              stop {
                gross {
                  amount
                  currency
                }
              }
            }
          }
          media {
            id
            url
          }
        }
      }
    }
  }
`;

const fetchProducts = async () => {
  const { data } = await client.query({
    query: GET_PRODUCTS,
    variables: { channel: "default-channel" },
  });
  return data.products.edges.map((edge: any) => edge.node);
};

const ProductsPage = async () => {
  const products = await fetchProducts();

  return (
    <div className={styles.productsContainer}>
      <h1>Products</h1>
      <div className={styles.products}>
        {products.map((product: any) => (
          <Link href={`/products/${product.id}`} key={product.id}>
            <Card
              className={styles.productCard}
              sx={{ maxWidth: 400 }}
              key={`card-${product.id}`}
            >
              <CardHeader className={styles.title} title={product?.name} />
              <img src={product?.media[0]?.url} height={260} />
              <CardContent className={styles.cardContent}>
                <Rating name="read-only" value={product?.rating} readOnly />
                <span>{product?.category?.name}</span>
                <p className={styles.price}>
                  Price Range: {product.pricing.priceRange.start.gross.amount}{" "}
                  {product.pricing.priceRange.start.gross.currency} -{" "}
                  {product.pricing.priceRange.stop.gross.amount}{" "}
                  {product.pricing.priceRange.stop.gross.currency}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ProductsPage;
