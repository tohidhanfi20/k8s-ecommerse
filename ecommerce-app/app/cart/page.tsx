import Image from 'next/image';
import Link from 'next/link';
import styles from './cart.module.css';
export default async function Cart() {
  const products = await (
    await fetch(`https://fakestoreapi.com/products/category/women's clothing`)
  ).json();
  console.log("🚀 ~ file: page.tsx:8 ~ Cart ~ products:", products)
  return (
    <div className={styles.cartList}>
    <div className={styles.cartListProducts}>
    {
        products.map((product:any) =>  
          <div key={product.id} className={styles.cartProductList}>
            <div className={styles.cartProductImage}>
              <Image src={product.image} alt="Shoes" style={{objectFit:'contain'}} width={130} height={110} />
            </div>
            <div className={styles.cartDetails}>
              <div className={styles.productName}>
                <h4>{product.title.replace(/(.{20})..+/, "$1…")}</h4>
                <strong>LIFESTYLE</strong>
              </div>
            </div>
            <div className={styles.cartProductPrice}>
              <span>$ {product.price}</span>
            </div>
            <div className={styles.cartProductAction}>
              <span>-</span>
              <span className={styles.cartProductQty}>2</span>
              <span>+</span>
            </div>
            <div className={styles.cartProductTotalPrice}>
              <span>$ {product.price}</span>
            </div>
            <div className={styles.cartClose}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" height={20} width={20}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    
            </div>
          </div>)
    }
    
     
    </div>
    <div className={styles.cartFooterResults}>
  
        <span className={styles.cartShowMoreIcon}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="rgb(250, 199, 78)" height={22} width={22}>
  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
</svg>
</span>
            <p className={styles.footerText}><span><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="rgb(250, 199, 78)" height={28} width={28}>
  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
</svg>
</span> We normally deliver within a day inside Valley.</p>
            <div className={styles.footerResultsRight}>
                <span>Total Value : </span>
                <strong>$ 829.00</strong>
                <span className={styles.footerRefresh}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="rgb(250, 199, 78)" height={22} width={22}>
  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
</svg>
</span>
            </div>
           
    </div>
    <Link href="/cart/shipping" className={styles.cartFooter}>
   
            <span>NEXT STEP</span> <span className={styles.footerNextIcon}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="rgb(250, 199, 78)" height={20} width={20}>
  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
</svg>
</span> 
    </Link>
  </div>  )
}
