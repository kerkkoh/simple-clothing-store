import type { Metadata } from 'next';
import 'bootstrap/dist/css/bootstrap.min.css';
import './globals.scss';

export const metadata: Metadata = {
  title: 'Simple Clothing Store',
  description: 'Quality clothing with print-on-demand fulfillment',
  keywords: ['clothing', 'store', 'ecommerce', 'printful', 'apparel'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <div className="container">
            <a className="navbar-brand" href="/">
              Simple Clothing Store
            </a>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav ms-auto">
                <li className="nav-item">
                  <a className="nav-link" href="/">
                    Store
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="/cart">
                    Cart
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
        <main className="container py-4">{children}</main>
        <footer className="bg-dark text-white text-center py-3 mt-5">
          <div className="container">
            <p className="mb-0">
              &copy; {new Date().getFullYear()} Simple Clothing Store. All
              rights reserved.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
