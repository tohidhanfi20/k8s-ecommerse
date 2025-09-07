import image from "@/public/category.jpg";
import jewellery from "@/public/category/Jewellery.jpg";
import mens from "@/public/category/mens.jpg";
import shoes from "@/public/category/shoes.jpg";
import watches from "@/public/category/watches.jpg";
import womens from "@/public/category/women-category.jpg";
import Image from "next/image";
import Link from "next/link";
import styles from "./category.module.css";

const categoryImages = [
  mens,
  jewellery,
  shoes,
  watches,
  womens,
  mens,
  jewellery,
  shoes,
  watches,
  womens,
];
export default async function Category() {
  const res = await fetch("https://fakestoreapi.com/products/categories");
  const categories = await res.json();
  if (!res.ok) {
    throw new Error("No Categories Found");
  }
  return (
    <section className={styles.featureProducts}>
      <div className={styles.featureTitleWrapper}>
        <h3 className={styles.featureTitle}>Find Your Product</h3>
      </div>
      <section className={styles.category}>
        <Image className={styles.categoryImageLeft} src={image} alt="banner" />
        <section className={styles.categoryGrid}>
          <section className={styles.categoryGrid}>
            {[...categories, ...categories].map((category, i) => (
              <Link href={`/categories/${category}`} key={category} className={styles.categoryContainer}>
                <div className={styles.categoryBox}>
                  <Image
                    src={categoryImages[i]}
                    className={styles.categoryImage}
                    style={{ objectFit: "contain" }}
                    alt="Women Category"
                  />
                  <div className={styles.categoryInfo}>
                    <strong className={styles.categoryTitle}>{category}</strong>
                    <p className={styles.productCount}>{Math.floor(Math.random() * 100)} PRODUCTS</p>
                  </div>
                </div>
              </Link>
            ))}
          </section>
        </section>
      </section>
    </section>
  );
}
