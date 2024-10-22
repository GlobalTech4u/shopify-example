import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <h1>Welcome to Our Store</h1>
        <p>Explore our range of products and find what suits you best.</p>
        <div className={styles.ctas}>
          <Link className={styles.primary} href="/products">
            View Products
          </Link>
        </div>
      </main>
    </div>
  );
}
