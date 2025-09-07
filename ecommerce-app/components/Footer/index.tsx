import styles from "./footer.module.css";
export default function Footer() {
  return (
    <section className={styles.footerContainer}>
      <section className={styles.footerTop}>
        <div className={styles.footerSection}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="#4a42ec"
            height={55}
            width={55}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
            />
          </svg>

          <h3 className={styles.footerSectionTitle}>FREE SHIPPING</h3>
          <span className={styles.info}>
            We provide service free all around the world for free. Here it
            starts now from todays.
          </span>
        </div>
        <div className={styles.footerSection}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="#4a42ec"
            height={55}
            width={55}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
            />
          </svg>

          <h3 className={styles.footerSectionTitle}>24/7 TECHNICAL SUPPORT</h3>
          <span className={styles.info}>
            We provide service free all around the world for free. Here it
            starts now from todays.
          </span>
        </div>{" "}
        <div className={styles.footerSection}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="#4a42ec"
            height={55}
            width={55}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
            />
          </svg>

          <h3 className={styles.footerSectionTitle}>RETURN & EXCHANGE</h3>
          <span className={styles.info}>
            We provide service free all around the world for free. Here it
            starts now from todays.
          </span>
        </div>{" "}
        <div className={styles.footerSection}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="#4a42ec"
            height={55}
            width={55}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
            />
          </svg>

          <h3 className={styles.footerSectionTitle}>CUSTOMER CARE</h3>
          <span className={styles.info}>
            We provide service free all around the world for free. Here it
            starts now from todays.
          </span>
        </div>
      </section>
      <section className={styles.footer}>
        <p className={styles.footerTitle}>@NepalOnlineStore</p>

        <section className={styles.footerLinks}>
          <p className={styles.footerTitle}>Contact Us</p>
          <p className={styles.footerTitle}>About Us</p>
          <p className={styles.footerTitle}>Support Us</p>
          <p className={styles.footerTitle}>Shop </p>
          <p className={styles.footerTitle}>Best Offers</p>
        </section>
      </section>
    </section>
  );
}
