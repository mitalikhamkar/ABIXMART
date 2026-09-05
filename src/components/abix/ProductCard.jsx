import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Check } from 'lucide-react';
import { useShop } from '@/lib/ShopContext';

// Reusable product card for available products.
export default function ProductCard({ product, index = 0 }) {
  const { addToCart, toggleWishlist, isInWishlist } = useShop();

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay: (index % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className="group flex flex-col"
    >
      <Link to={`/shop/${product.slug}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden bg-sand">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.05]"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center">
              <span className="font-display text-5xl text-greendark/25">{product.name.charAt(0)}</span>
            </div>
          )}
          <div className="absolute inset-0 ring-1 ring-inset ring-greendark/10" />
          <span className="absolute top-4 left-4 text-[10px] uppercase tracking-luxe-sm text-greendark/60 bg-ivory/80 px-2 py-1">
            {product.subtitle}
          </span>
        </div>
      </Link>

      <div className="mt-5 flex-1 flex flex-col">
        <Link to={`/shop/${product.slug}`}>
          <h3 className="font-display text-2xl text-greendark leading-tight group-hover:text-gold transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="mt-1.5 text-sm text-foreground/60 leading-relaxed">{product.shortDesc}</p>

        <div className="mt-5 flex items-center justify-between">
          <span className="font-display text-2xl text-greendark">
            {product.currency}{product.price}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleWishlist(product.id)}
              className="h-11 w-11 inline-flex items-center justify-center border border-greendark/20 text-greendark hover:border-gold hover:text-gold transition-colors"
              aria-label="Add to wishlist"
            >
              {isInWishlist(product.id) ? <Check size={17} className="text-gold" /> : <Plus size={17} />}
            </button>
            <button
              onClick={() => addToCart(product.id, 1)}
              className="h-11 px-5 inline-flex items-center bg-greendark text-ivory text-[11px] font-semibold tracking-luxe-sm uppercase hover:bg-gold hover:text-greendark transition-colors duration-300"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}