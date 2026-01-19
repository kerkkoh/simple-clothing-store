'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { PrintfulProduct } from '@/types/printful';

interface StoreClientProps {
  products: PrintfulProduct[];
  error: string | null;
}

export default function StoreClient({ products, error }: StoreClientProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = products.filter((product) =>
    product.sync_product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (error) {
    return (
      <div className="error-message">
        <h3>Error</h3>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Our Products</h1>
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-5">
          <p className="text-muted">
            {searchTerm
              ? 'No products found matching your search.'
              : 'No products available at the moment.'}
          </p>
        </div>
      ) : (
        <div className="row">
          {filteredProducts.map((product) => (
            <div key={product.id} className="col-md-4 mb-4">
              <Link
                href={`/product/${product.sync_product.id}`}
                className="text-decoration-none"
              >
                <div className="card product-card h-100">
                  <img
                    src={product.sync_product.thumbnail_url}
                    className="card-img-top"
                    alt={product.sync_product.name}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{product.sync_product.name}</h5>
                    {product.sync_variants && product.sync_variants.length > 0 && (
                      <p className="card-text text-muted">
                        From {product.sync_variants[0].currency}{' '}
                        {product.sync_variants[0].retail_price}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
