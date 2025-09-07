import Image from "next/image";
import Link from "next/link";
import styles from "./productcard.module.css";

type ProductCardProps = {
title:string,
price:number,
image:string,
category:string,
id:number | string
}
export default function ProductCard({title,price,image,category,id}:ProductCardProps) {
  return (
 <div className={styles.container}>
     <Link href={`/product/${id}`} className={styles.productCard}>
      <span className={styles.sticker}>sale</span>
      <Image
        className={styles.productImage}
        width={470}
        height={670}
        src={image}
        alt="sunglasses"
      />

      <div className={styles.productInfo}>
        <h2 className={styles.productName}>{title}</h2>
        <strong className={styles.productPrice}>Rs: {price}</strong>
      </div>
      <div className={styles.hoverCard}>
        <span className={styles.hoverCategory}>{category}</span>
      
      </div>
    </Link>
    <div className={styles.buttonActions}>
          <Link href={'/cart'} className={styles.iconWrapper}>
            <span className={styles.tooltip}>Cart</span>{" "}
            <svg
              className={styles.icon}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="#fff"
              height={30}
              width={30}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
              />
            </svg>
          </Link>
          <Link href={'/cart'} className={styles.iconWrapper}>
            <span className={styles.tooltip}>Wish</span>{" "}
            <svg
              className={styles.icon}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="#fff"
              height={30}
              width={30}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
              />
            </svg>
          </Link>
          <Link href={`/product/${id}`} className={styles.iconWrapper}>
            <span className={styles.tooltip}>View</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="#fff"
              height={30}
              width={30}
              className={styles.icon}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25"
              />
            </svg>
          </Link>
        </div>
 </div>
  );
}
