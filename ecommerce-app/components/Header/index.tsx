import Link from "next/link";
import styles from "./header.module.css";

export default async function Header() {
  const res = await fetch("https://fakestoreapi.com/products/categories");
  const categories = await res.json();
  if (!res.ok) {
    throw new Error("No Categories Found");
  }

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <section className={styles.leftSection}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            height={"22px"}
            width={"22px"}
            className={styles.icon}
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="#fff"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
          <span className={styles.category}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="#fff"
              height={"23px"}
              width={"23px"}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5"
              />
            </svg>
            <section className={styles.categoryLabelGroup}>
              <strong className={styles.categoryLabel}>select</strong>
              <strong className={styles.categoryLabel}>Categories</strong>
            </section>
          </span>
        </section>
        <Link href="/">
          {" "}
          <h3 className={styles.heading}>SHOPPER</h3>
        </Link>

        <section className={styles.rightSection}>
          <Link href="/profile">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="#fff"
              height={"22px"}
              width={"22px"}
              className={styles.icon}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
              />
            </svg>
          </Link>

          <Link href="/cart">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="#fff"
              height={"23px"}
              width={"23px"}
              className={styles.icon}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
              />
            </svg>
          </Link>

          <Link href="/cart">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="#fff"
              height={"23px"}
              width={"23px"}
              className={styles.cursor}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
              />
            </svg>
          </Link>
        </section>
      </nav>
      <section>
        <ul className={styles.categoryLinks}>
          {categories.map((category: string, i: number) => (
            <Link key={category + i} href={`/categories/${category}`}>
              <li className={styles.categoryLink}>{category}</li>
            </Link>
          ))}
          {categories.map((category: string, i: number) => (
            <Link key={category + i} href={`/categories/${category}`}>
              <li className={styles.categoryLink}>{category}</li>
            </Link>
          ))}
        </ul>
      </section>
    </header>
  );
}
