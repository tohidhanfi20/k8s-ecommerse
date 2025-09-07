"use client";
import { useEffect, useState } from "react";
import Slider from "react-slick";
import ProductCard from "../ProductCards";
import Skeleton from "../Skeleton";
import styles from "./featureproducts.module.css";

export default function FeatureProducts({ title }: { title: string }) {
  const [products, setProducts] = useState([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://fakestoreapi.com/products?limit=18")
      .then((res) => res.json())
      .then((data) => {
        if(title !== 'Featured Products'){
          setProducts(data.slice(0,12).reverse())
        }else{
          setProducts(data);
        }
        setLoading(false);
      });
  }, [title]);
  const settings = {
    dots: false,
    infinite: false,
    centerMode: false,
    speed: 900,
    slidesToShow: 5,
    slidesToScroll: 3,
    responsive: [
      {
        breakpoint: 1300,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 3,
          infinite: false,
          dots: false
        }
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: false,
          dots: false
        }
      },
      {
        breakpoint: 769,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 3,
          infinite: false,
          dots: false,
          center:true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
          centerMode: false,

        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide:1,
          centerMode: true,
          
        }
      }
    ]
  };
  return (
    <section className={styles.featureProducts}>
      <div className={styles.featureTitleWrapper}>
        <h3 className={styles.featureTitle}>{title}</h3>
      </div>
    {
      isLoading ? <Skeleton height="300px" />:  <section className={styles.sliderContainer}>
      <Slider {...settings}>
        {products.map((product: any, i:number) => (
          <ProductCard
            key={i}
            id={product.id}
            title={product.title}
            price={product.price}
            image={product.image}
            category={product.category}
          />
        ))}
      </Slider>
    </section>
    }
    </section>
  );
}
