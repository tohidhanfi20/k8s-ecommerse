import BannerSlider from "@/components/BannerSlider";
import ProductCard from "@/components/ProductCards";
import Sidebar from "@/components/Sidebar";
import TopController from "@/components/TopController";
import styles from "./categories.module.css";
export default async function Category({
  params,
}: {
  params: { slug: string };
}) {
  const products = await (
    await fetch(`https://fakestoreapi.com/products/category/${params.slug}`)
  ).json();
 
  return (
    <main>
      <BannerSlider />
      <TopController />
      <div className={styles.container}>
        <div className={styles.sideBar}>
        <Sidebar/>
        </div>
        <div className={styles.content}>
{
 [... products,... products,... products,... products].map((product:any)=> <ProductCard key={product.title} title={product.title} price={product.price} image={product.image} category={product.category} id={product.id}  />)
}        </div>
      </div>
    </main>
  );
}
