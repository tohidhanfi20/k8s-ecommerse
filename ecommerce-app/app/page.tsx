import BannerSlider from "@/components/BannerSlider";
import Category from "@/components/Category";
import FeatureProducts from "@/components/FeatureProducts";
import Footer from "@/components/Footer";


export default function Home() {

  return (
<main>
<BannerSlider/>
<FeatureProducts title="Featured Products" />
<FeatureProducts title="Latest Products"/>
<Category/>


<Footer/>
</main>
  )
}
