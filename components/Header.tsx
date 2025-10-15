"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Heart, ShoppingBag, ChevronDown } from "lucide-react";

export default function Header() {
  const [shopOpen, setShopOpen] = useState(false);

  return (
    <header className="w-full border-b border-gray-200 bg-white/90 backdrop-blur-md fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* LEFT SIDE NAV */}
        <nav className="flex items-center space-x-8 text-sm font-medium text-gray-700">
          <Link href="#" className="hover:text-emerald-600 transition">
            Početna
          </Link>
          <Link href="#" className="hover:text-emerald-600 transition">
            Blog
          </Link>

          <div
            className="relative cursor-pointer select-none"
            onMouseEnter={() => setShopOpen(true)}
            onMouseLeave={() => setShopOpen(false)}
          >
            <div className="flex items-center hover:text-emerald-600">
              <span>Shop</span>
              <ChevronDown size={16} className="ml-1" />
            </div>

            {/* DROPDOWN */}
            {shopOpen && (
              <div className="absolute top-8 left-0 bg-white shadow-xl border rounded-xl w-[700px] p-6 grid grid-cols-3 gap-6 z-50">
                <div>
                  <h3 className="font-semibold mb-3">👗 Moda</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li><Link href="#">Trenerke</Link></li>
                    <li><Link href="#">Suknje</Link></li>
                    <li><Link href="#">Haljine</Link></li>
                    <li><Link href="#">Majice</Link></li>
                    <li><Link href="#">Outwear</Link></li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">🌸 Ljepota i parfemi</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li><Link href="#">Body Mist</Link></li>
                    <li><Link href="#">Kozmetika</Link></li>
                    <li><Link href="#">HI Sun</Link></li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">👜 Dodaci</h3>
                  <ul className="space-y-2 text-gray-600">
                    <li><Link href="#">Torbe</Link></li>
                    <li><Link href="#">HI Home</Link></li>
                    <li><Link href="#">Acc</Link></li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* CENTER LOGO */}
        <Link
          href="/"
          className="text-2xl font-semibold tracking-wide text-gray-900 hover:text-emerald-600 transition"
        >
          HI
        </Link>

        {/* RIGHT SIDE ICONS */}
        <div className="flex items-center space-x-5 text-gray-600">
          <button className="hover:text-emerald-600 transition">
            <Search size={20} />
          </button>
          <button className="hover:text-emerald-600 transition relative">
            <Heart size={20} />
            <span className="absolute -top-1 -right-1 bg-emerald-600 text-white text-[10px] rounded-full px-1">
              2
            </span>
          </button>
          <button className="hover:text-emerald-600 transition relative">
            <ShoppingBag size={20} />
            <span className="absolute -top-1 -right-1 bg-emerald-600 text-white text-[10px] rounded-full px-1">
              3
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}

