import { gql } from "@apollo/client";
import client from "../../../lib/apolloClient";
import { Button, Rating } from "@mui/material";
import Link from "next/link";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import styles from "./ProductDetailsPage.module.css";

const GET_PRODUCT = gql`
  query ProductDetails($id: ID!, $channel: String!) {
    product(id: $id, channel: $channel) {
      id
      name
      slug
      description
      rating
      created
      updatedAt
      media {
        id
        url
      }
      category {
        id
        description
        name
      }
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
    }
  }
`;

const fetchProduct = async (id: any) => {
  const { data } = await client.query({
    query: GET_PRODUCT,
    variables: { id, channel: "default-channel" },
  });
  return data.product;
};

const ProductDetailsPage = async ({ params }: any) => {
  const productId = decodeURIComponent(params.id);

  if (!productId) {
    return <div>Error: Product ID is missing</div>;
  }

  const product = await fetchProduct(productId);
  const description = JSON.parse(product?.description);

  return (
    <div className={styles.productDetailsContainer}>
      <div className={styles.leftContainer}>
        <img src={product?.media[0]?.url} height="400" width="400" />
      </div>
      <div className={styles.rightContainer}>
        <Link className={styles.backLink} href="/products">
          <ArrowBackIcon />
          Back
        </Link>
        <div className={styles.rightDetailsContainer}>
          <span className={styles.title}>{product?.name}</span>
          <span className={styles.category}>{product?.category?.name}</span>
          <Rating name="read-only" value={product?.rating} readOnly />
          <p className={styles.price}>
            Price Range: {product.pricing.priceRange.start.gross.amount}{" "}
            {product.pricing.priceRange.start.gross.currency} -{" "}
            {product.pricing.priceRange.stop.gross.amount}{" "}
            {product.pricing.priceRange.stop.gross.currency}
          </p>
          <p
            className={styles.description}
            dangerouslySetInnerHTML={{
              __html: description?.blocks[0]?.data?.text || "",
            }}
          />
        </div>
        <div className={styles.actionContainer}>
          <Button variant="contained" fullWidth>
            Add to cart
          </Button>
          <Button variant="contained" fullWidth>
            Buy now
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
