import styles from "./sidebar.module.css";
export default function Sidebar() {
  return (
    <div className={styles.sideBarCategory}>
      <aside className={styles.gender}>
        <section>
          <span className={styles.heading}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              height={14}
              width={14}
              style={{ marginRight: "10px" }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 8.25l-7.5 7.5-7.5-7.5"
              />
            </svg>
            <span>GENDER</span>
          </span>
          <strong>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              height={14}
              width={14}
              style={{ marginRight: "10px" }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </strong>
        </section>

        <section className={styles.genderIcon}>
          <span className={styles.genderIconContent}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="#575ada"
              height={32}
              width={24}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
              />
            </svg>

            <strong>All</strong>
          </span>
          <span className={styles.genderIconContent}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="#575ada"
              height={32}
              width={24}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
              />
            </svg>
            <strong>Male</strong>
          </span>
          <span className={styles.genderIconContent}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="#575ada"
              height={32}
              width={24}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z"
              />
            </svg>
            <strong>Female</strong>
          </span>
        </section>
      </aside>
      <aside className={styles.categories}>
        <section>
          <span className={styles.heading}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              height={14}
              width={14}
              style={{ marginRight: "10px" }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 8.25l-7.5 7.5-7.5-7.5"
              />
            </svg>{" "}
            <span>CATEGORIES</span>
          </span>
          <strong>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              height={14}
              width={14}
              style={{ marginRight: "10px" }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />{" "}
            </svg>{" "}
          </strong>
        </section>

        <ul>
          <li>
            <span>Mens </span> <strong> 3</strong>
          </li>
          <li>
            <span>Womens </span> <strong> 231</strong>
          </li>
          <li>
            <span>Watches </span> <strong> 2</strong>
          </li>
          <li>
            <span>Sunglasses </span> <strong> 3</strong>
          </li>
          <li>
            <span>T-Shirts </span> <strong> 23</strong>
          </li>
          <li>
            <span>Shoes </span> <strong> 23</strong>
          </li>
          <li>
            <span>Lockets </span> <strong> 263</strong>
          </li>
          <li>
            <span>Caps </span> <strong> 23</strong>
          </li>
          <li>
            <span>Masks </span> <strong> 213</strong>
          </li>
        </ul>
      </aside>
      <aside className={styles.price}>
        <section>
          <span className={styles.heading}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              height={14}
              width={14}
              style={{ marginRight: "10px" }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 8.25l-7.5 7.5-7.5-7.5"
              />
            </svg>{" "}
            <span>PRICE</span>
          </span>
          <strong>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              height={14}
              width={14}
              style={{ marginRight: "10px" }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </strong>
        </section>

        <form>
          <section>
            <input type="number" /> <input type="number" />
          </section>
          <input type="range" />
        </form>
      </aside>

      <aside className={styles.color}>
        <section>
          <span className={styles.heading}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              height={14}
              width={14}
              style={{ marginRight: "10px" }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 8.25l-7.5 7.5-7.5-7.5"
              />
            </svg>
            <span>COLORS</span>
          </span>
          <strong>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              height={14}
              width={14}
              style={{ marginRight: "10px" }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </strong>
        </section>

        <div className={styles.colorGrid}>
          <span style={{ backgroundColor: "yellow" }}> </span>{" "}
          <span style={{ backgroundColor: "green" }}> </span>{" "}
          <span style={{ backgroundColor: "pink" }}> </span>{" "}
          <span style={{ backgroundColor: "white" }}> </span>
          <span style={{ backgroundColor: "red" }}> </span>{" "}
          <span style={{ backgroundColor: "gray" }}> </span>{" "}
          <span style={{ backgroundColor: "gold" }}> </span>
          <span style={{ backgroundColor: "brown" }}> </span>{" "}
          <span style={{ backgroundColor: "purple" }}> </span> <span> </span>
        </div>
      </aside>
      <aside className={styles.sizes}>
        <section>
          <span className={styles.heading}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              height={14}
              width={14}
              style={{ marginRight: "10px" }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 8.25l-7.5 7.5-7.5-7.5"
              />
            </svg>{" "}
            <span>SIZE</span>
          </span>
          <strong>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              height={14}
              width={14}
              style={{ marginRight: "10px" }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </strong>
        </section>

        <div className={styles.sizeGrid}>
          <span>
            <strong>SM </strong>
          </span>
          <span>
            <strong>X </strong>
          </span>
          <span>
            <strong>XL </strong>
          </span>
          <span>
            <strong>XXL </strong>
          </span>
          <span>
            <strong>XML </strong>
          </span>
          <span>
            <strong>XXS </strong>
          </span>
          <span>
            <strong>XXXL </strong>
          </span>
          <span>
            <strong>M </strong>
          </span>
        </div>
      </aside>
      <aside className={styles.services}>
        <section>
          <span className={styles.heading}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              height={14}
              width={14}
              style={{ marginRight: "10px" }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 8.25l-7.5 7.5-7.5-7.5"
              />
            </svg>{" "}
            <span>SERVICE</span>
          </span>
          <strong>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              height={14}
              width={14}
              style={{ marginRight: "10px" }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </strong>
        </section>

        <section className={styles.serviceIcon}>
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="blue"
              height={32}
              width={32}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
              />
            </svg>

            <strong>FREE DELIVERY</strong>
          </span>
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="blue"
              height={32}
              width={32}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
              />
            </svg>
            <strong>CASH ON DELIVERY</strong>
          </span>
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="blue"
              height={32}
              width={32}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z"
              />
            </svg>

            <strong>GlOBAL DELIVERY</strong>
          </span>
        </section>
      </aside>
      {/* <aside className={styles.shortlistedProducts}>
        <section>
          <span className={styles.heading}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              height={14}
              width={14}
              style={{ marginRight: "10px" }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 8.25l-7.5 7.5-7.5-7.5"
              />
            </svg>
            <span style={{ marginLeft: "5px" }}>HOT OFFERS</span>
          </span>
          <strong>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              height={14}
              width={14}
              style={{ marginRight: "10px" }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </strong>
        </section>
        <div className={styles.sidebarProducts}>SIDEBAR PRODUCTS</div>
      </aside> */}
    </div>
  );
}
