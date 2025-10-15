"use client";

import { gql, useQuery } from "@apollo/client";
import client from "../lib/apolloClient";
import Link from "next/link";

const GET_PRODUCTS = gql`
  query AllProducts {
    products(first: 12) {
      nodes {
        id
        name
        slug
        image {
          sourceUrl
        }
        ... on SimpleProduct {
          price
        }
      }
    }
  }
`;

export default function Home() {
  const { loading, error, data } = useQuery(GET_PRODUCTS, { client });

  if (loading)
    return (
      <p className="text-center text-gray-500 mt-20 text-lg animate-pulse">
        Učitavam proizvode...
      </p>
    );
  if (error)
    return (
      <p className="text-center text-red-600 mt-20 text-lg">
        Greška: {error.message}
      </p>
    );

  const products = data?.products?.nodes || [];

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100 py-14">
      {/* HEADER */}
      <header className="flex justify-between items-center px-8 mb-12">
        <h1 className="text-3xl font-bold text-emerald-700 tracking-tight">
          MojShop
        </h1>
        <nav className="space-x-6 text-gray-700 font-medium">
          <Link href="#" className="hover:text-emerald-600 transition">
            Početna
          </Link>
          <Link href="#" className="hover:text-emerald-600 transition">
            Proizvodi
          </Link>
          <Link href="#" className="hover:text-emerald-600 transition">
            Kontakt
          </Link>
        </nav>
      </header>

      {/* NASLOV */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-extrabold text-gray-800 mb-2">
          Naši proizvodi
        </h2>
        <p className="text-gray-500">
          Istražite pažljivo odabrane artikle po vrhunskim cijenama.
        </p>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 px-8">
        {products.map((product: any) => (
          <Link
            href={`/proizvod/${product.slug}`}
            key={product.id}
            className="group bg-white rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100"
          >
            <div className="overflow-hidden rounded-t-2xl">
              {product.image?.sourceUrl ? (
                <img
                  src={product.image.sourceUrl}
                  alt={product.name}
                  className="w-full h-64 object-cover transform group-hover:scale-110 transition duration-500"
                />
              ) : (
                <div className="w-full h-64 bg-gray-200 flex items-center justify-center text-gray-400">
                  Nema slike
                </div>
              )}
            </div>
            <div className="p-5 text-center">
              <h3 className="text-lg font-semibold text-gray-800 group-hover:text-emerald-700 transition">
                {product.name}
              </h3>
              <p className="text-emerald-600 font-bold mt-2">
                {product.price ? product.price : "Cijena na upit"}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* FOOTER */}
      <footer className="mt-16 text-center text-gray-400 text-sm">
        © {new Date().getFullYear()} MojShop. Sva prava zadržana.
      </footer>
    </main>
  );
}

