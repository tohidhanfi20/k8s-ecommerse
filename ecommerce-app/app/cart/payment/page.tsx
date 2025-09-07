// pages/PaymentPage.js
"use client"
import { useState } from 'react';
import styles from './payment.module.css';

const PaymentPage = () => {
  const [selectedPayment, setSelectedPayment] = useState('paypal');

  const handlePaymentChange = (option:any) => {
    setSelectedPayment(option);
  };

  const paymentOptions = [
    { id: 'creditCard', label: 'Credit Card' },
    { id: 'paypal', label: 'PayPal' },
    { id: 'cod', label: 'Cash on Delivery' },
  ];

  return (
    <div className={styles.paymentPage}>
      <div className={styles.paymentOptions}>
        {paymentOptions.map((option) => (
          <label key={option.id} className={styles.optionLabel}>
            <input
              type="radio"
              name="paymentOption"
              value={option.id}
              checked={selectedPayment === option.id}
              onChange={() => handlePaymentChange(option.id)}
              className={styles.radioInput}
            />
            {option.label}
          </label>
        ))}
      </div>
      {selectedPayment === 'creditCard' && (
        <div className={styles.paymentForm}>
          <form className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="cardNumber" className={styles.label}>Card Number</label>
              <input type="text" id="cardNumber" className={styles.input} />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="expiryDate" className={styles.label}>Expiry Date</label>
              <input type="text" id="expiryDate" className={styles.input} />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="cvv" className={styles.label}>CVV</label>
              <input type="text" id="cvv" className={styles.input} />
            </div>
            <button className={styles.payButton}>Pay Now</button>
          </form>
        </div>
      )}
      {selectedPayment === 'paypal' && (
        <div className={styles.paypalContainer}>
          <p className={styles.paypalText}>You will be redirected to PayPal for payment.</p>
          <button className={styles.payButton}>Proceed to PayPal</button>
        </div>
      )}
      {selectedPayment === 'cod' && (
        <div className={styles.codInfo}>
          <p className={styles.codText}>Please have cash ready for payment upon delivery.</p>
          <button className={styles.payButton}>Place Order</button>
        </div>
      )}
    </div>
  );
};

export default PaymentPage;
