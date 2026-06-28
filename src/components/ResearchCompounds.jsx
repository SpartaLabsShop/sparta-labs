"use client";

import { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { PrimaryProductCard } from "@/components/shop/PrimaryProductCard";

const HelmetLogo = ({ className }) => (
  <svg viewBox="0 0 190 300" className={className} fill="#D31118">
    <path d="M94.02,228.41c-5.98-3.52-19.52-15.64-19.13-22.16l3.19-52.86-55.56-24.18c-.45,9.37,1.22,17.33,2.88,25.78,2.03,13.88,15.02,16.75,26.2,22.56,3.74,2.15,9.43,5.67,9.43,11.05v94.56S2.59,206.44,2.59,206.44c-2.8-3.68-2.25-8.49-2.59-12.84l.17-90.97c.02-10.06,3.04-19.08,8.62-27.26,17.61-25.3,57.52-45.01,84.79-58.71,28.42,14.43,62.61,31.25,82.58,55.75,5.71,7.74,10.53,15.88,10.55,26.07l.26,101.36c-1.24,3.84-2.61,6.9-5,10.05l-55.98,73.44-.54-89.59c-.04-5.96.76-11.19,6.44-14.24l17.88-9.14c6.75-3.45,11.37-9.02,11.89-16.81,1.64-8.05,3.33-15.91,2.67-24.57l-55.92,24.83,3.16,54.98c-2.32,8.15-11.11,13.39-17.57,19.62Z" />
  </svg>
);

const ResearchCompounds = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("/api/products?where[status][equals]=active&where[isVisible][equals]=true&limit=6&sort=-createdAt&depth=1")
      .then((r) => r.json())
      .then((data) => {
        if (data.docs) {
          const mapped = data.docs.map((doc) => {
            let imageUrl = "/temp-products/product-image.png";
            if (doc.images?.length > 0 && typeof doc.images[0].image === "object" && doc.images[0].image?.url) {
              imageUrl = doc.images[0].image.url;
            }

            let categoryName = "Research";
            if (doc.categories?.length > 0 && typeof doc.categories[0] === "object") {
              categoryName = doc.categories[0].name || categoryName;
            }

            const displayPrice = typeof doc.salePrice === "number" && doc.salePrice > 0
              ? doc.salePrice
              : typeof doc.price === "number" ? doc.price : 0;

            return {
              id: doc.id,
              name: doc.name,
              slug: doc.slug || "",
              image: imageUrl,
              shortDescription: doc.description || "",
              priceRange: `$${displayPrice.toFixed(2)}`,
              category: categoryName,
            };
          });
          setProducts(mapped);
        }
      })
      .catch(() => {});
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <motion.section
      className="bg-white py-24"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={containerVariants}
    >
      <div className="mx-auto max-w-[1700px] px-8 max-[768px]:px-4 max-[480px]:px-3">
        <motion.div className="mb-16 flex flex-col items-center text-center" variants={itemVariants}>
          <HelmetLogo className="mb-6 h-[50px] w-10" />
          <h2 className="mb-6 text-[2.5rem] font-semibold tracking-[-0.5px] text-ink uppercase font-[var(--font-inter)]">Research Compounds</h2>
          <Link
            href="/shop"
            className="inline-flex items-center rounded border border-line bg-transparent px-6 py-3 text-[0.9rem] font-medium text-ink transition-all duration-200 hover:border-[#d0d0d0] hover:bg-hover"
          >
            View all compounds <ChevronRight size={14} className="ml-1" />
          </Link>
        </motion.div>

        <motion.div
          className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3"
          variants={itemVariants}
        >
          {products.map((product) => (
            <motion.div key={product.id} className="flex h-full w-full" variants={itemVariants}>
              <PrimaryProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default ResearchCompounds;
