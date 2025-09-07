import Link from "next/link";
import styles from "./shippingform.module.css";
function ShippingForm() {
  return (
    <div className={styles.shipping__cart__maincontent}>
      <div className={styles.cart__shipping__form}>
        <div className={styles.shipping__form__signin}>
          <h2>Sign in</h2>
          <form className={styles.signin__form}>
            <div className={styles.form_group}>
              <input type="email" id="email" />
              <label htmlFor="email">E-mail</label>
            </div>
            <div className={styles.form_group}>
              <input type="password" id="password" />
              <label htmlFor="password">Password</label>
            </div>
            <button>Sign in</button>
          </form>
          <a href="#" className={styles.forget_password}>
            Forgot your password
          </a>
        </div>
        <div className={styles.shipping__form__signup}>
          <span className={styles.or_middle_round}>OR</span>
          <h2>Fill all the Fields</h2>
          <form className={styles.signup__form}>
            <div className={styles.form_group}>
              <input type="text" id="firstname" />
              <label htmlFor="firstname">FirstName</label>
            </div>
            <div className={styles.form_group}>
              <input type="text" id="LastName" />
              <label htmlFor="LastName">LastName</label>
            </div>
            <div className={styles.form_group}>
              <input type="email" id="emails" />
              <label htmlFor="emails">E-mail</label>
            </div>
            <div className={styles.form_group}>
              <input type="text" id="phone" />
              <label htmlFor="phone">Phone</label>
            </div>
            <div className={styles.form_group}>
              <input type="text" id="city" />
              <label htmlFor="city">City</label>
            </div>
            <div className={styles.form_group}>
              <input type="text" id="zipaddress" />
              <label htmlFor="zipaddress">Zip/Posctal Code</label>
            </div>
            <div className={styles.form_group}>
              <input type="text" id="address" />
              <label htmlFor="address">Address</label>
            </div>
          </form>
        </div>
      </div>
      <div className={styles.cart__shipping__footer}>
        <Link href='/cart' className={styles.cart__shipping__footer__previous}>
          <section>
            <strong>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                height={16}
                width={16}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 19.5L8.25 12l7.5-7.5"
                />
              </svg>
            </strong>{" "}
            <strong>Previous</strong>
          </section>
        </Link>
        <Link href={'/cart/payment'} className={styles.cart__shipping__footer__next}>
          <section>
            <strong>Next</strong>{" "}
            <strong>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                height={16}
                width={16}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 4.5l7.5 7.5-7.5 7.5"
                />
              </svg>
            </strong>
          </section>
        </Link>
      </div>
    </div>
  );
}

export default ShippingForm;
