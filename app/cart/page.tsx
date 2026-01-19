// Cart page

import { Metadata } from 'next';
import CartClient from './CartClient';

export const metadata: Metadata = {
  title: 'Shopping Cart - Simple Clothing Store',
  description: 'Review your shopping cart',
};

export default function CartPage() {
  return <CartClient />;
}
