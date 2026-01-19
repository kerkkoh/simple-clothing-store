'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { PrintfulProduct, PrintfulVariant } from '@/types/printful';
import type { CartItem } from '@/types/cart';

interface ProductClientProps {
  product: PrintfulProduct;
}

export default function ProductClient({ product }: ProductClientProps) {
  const router = useRouter();
  const [selectedVariant, setSelectedVariant] = useState<PrintfulVariant | null>(
    product.sync_variants?.[0] || null
  );
  const [selectedImage, setSelectedImage] = useState(
    product.sync_product.thumbnail_url
  );

  const handleAddToCart = () => {
    if (!selectedVariant) return;

    const cartItem: CartItem = {
      id: selectedVariant.id,
      name: product.sync_product.name,
      variantName: selectedVariant.name,
      retail_price: selectedVariant.retail_price,
      price: parseFloat(selectedVariant.retail_price),
      currency: selectedVariant.currency,
      image: selectedVariant.product.image || product.sync_product.thumbnail_url,
      quantity: 1,
      product: {
        variant_id: selectedVariant.variant_id,
        product_id: selectedVariant.product.product_id,
      },
    };

    // Get existing cart from localStorage
    const cartData = localStorage.getItem('cart');
    const cart = cartData ? JSON.parse(cartData) : { items: [] };

    // Add item to cart
    cart.items.push(cartItem);

    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    // Redirect to cart
    router.push('/cart');
  };

  return (
    <div className="row">
      <div className="col-md-6">
        <img
          src={selectedImage}
          alt={product.sync_product.name}
          className="img-fluid product-image mb-3"
        />
        {selectedVariant?.files && selectedVariant.files.length > 0 && (
          <div className="d-flex gap-2">
            {selectedVariant.files.map((file) => (
              <img
                key={file.id}
                src={file.thumbnail_url}
                alt="Product thumbnail"
                className="img-thumbnail"
                style={{ width: '80px', cursor: 'pointer' }}
                onClick={() => setSelectedImage(file.preview_url || file.url)}
              />
            ))}
          </div>
        )}
      </div>

      <div className="col-md-6">
        <h1>{product.sync_product.name}</h1>

        {selectedVariant && (
          <h3 className="text-primary mb-4">
            {selectedVariant.currency} {selectedVariant.retail_price}
          </h3>
        )}

        <div className="mb-4">
          <h5>Description</h5>
          <p>{product.description || 'No description available.'}</p>
        </div>

        {product.sync_variants && product.sync_variants.length > 0 && (
          <div className="mb-4">
            <h5>Select Size</h5>
            <div className="variant-selector">
              {product.sync_variants.map((variant) => (
                <button
                  key={variant.id}
                  className={`btn ${
                    selectedVariant?.id === variant.id
                      ? 'btn-primary'
                      : 'btn-outline-primary'
                  }`}
                  onClick={() => {
                    setSelectedVariant(variant);
                    setSelectedImage(
                      variant.product.image || product.sync_product.thumbnail_url
                    );
                  }}
                >
                  {variant.name.split(' - ').pop() || variant.name}
                </button>
              ))}
            </div>
          </div>
        )}

        <button
          className="btn btn-success btn-lg w-100"
          onClick={handleAddToCart}
          disabled={!selectedVariant}
        >
          Add to Cart
        </button>

        <div className="mt-4">
          <a href="/" className="btn btn-outline-secondary">
            &larr; Back to Store
          </a>
        </div>
      </div>
    </div>
  );
}
