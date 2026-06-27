"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ShoppingBag,
  Trash2,
  CreditCard,
  PackageCheck,
  Search,
  Minus,
  Plus,
} from "lucide-react";
import type { Locale } from "@/lib/i18n";
import { formatOmr, storeProducts } from "@/lib/platform";

type CartItem = {
  id: string;
  name: string;
  unitAmount: number;
  quantity: number;
};

const copy = {
  en: {
    title: "Nizwa Accessories",
    subtitle: "A complete Arabic-first store demo with product tables, cart, checkout, Thawani adapter, and admin-ready order data.",
    category: "Category",
    search: "Search products",
    all: "All",
    add: "Add",
    cart: "Cart",
    checkout: "Checkout",
    customer: "Customer details",
    name: "Name",
    email: "Email",
    phone: "WhatsApp phone",
    area: "Delivery area",
    placeOrder: "Create checkout",
    empty: "Add products to test checkout.",
    success: "Checkout created. The order is now visible in admin.",
    orderStatus: "Order status",
    orderId: "Order ID",
    checkStatus: "Check status",
    statusLabel: "Status",
    orders: "Order operations preview",
    stock: "Stock",
    total: "Total",
  },
  ar: {
    title: "إكسسوارات نزوى",
    subtitle: "عرض متجر عربي متكامل مع جداول منتجات وسلة دفع وتكامل ثواني وبيانات طلبات جاهزة للإدارة.",
    category: "التصنيف",
    search: "ابحث في المنتجات",
    all: "الكل",
    add: "أضف",
    cart: "السلة",
    checkout: "الدفع",
    customer: "بيانات العميل",
    name: "الاسم",
    email: "البريد",
    phone: "رقم واتساب",
    area: "منطقة التوصيل",
    placeOrder: "إنشاء الدفع",
    empty: "أضف منتجات لتجربة الدفع.",
    success: "تم إنشاء الدفع. الطلب يظهر الآن في لوحة الإدارة.",
    orderStatus: "حالة الطلب",
    orderId: "رقم الطلب",
    checkStatus: "تحقق من الحالة",
    statusLabel: "الحالة",
    orders: "معاينة إدارة الطلبات",
    stock: "المخزون",
    total: "الإجمالي",
  },
} as const;

export default function StoreDemo({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const [category, setCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [form, setForm] = useState({
    name: "Maha Al Hinai",
    email: "maha@example.com",
    phone: "+968 9000 1234",
    area: "Muscat - Al Khuwair",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [orderId, setOrderId] = useState<string>("");
  const [orderLookup, setOrderLookup] = useState("");
  const [lookupResult, setLookupResult] = useState("");

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(storeProducts.map((item) => item.category)))],
    []
  );
  const products = (category === "All"
    ? storeProducts
    : storeProducts.filter((item) => item.category === category)
  ).filter((item) => {
    const text = `${item.name.en} ${item.name.ar} ${item.description.en} ${item.description.ar} ${item.category}`.toLowerCase();
    return text.includes(query.toLowerCase());
  });
  const total = cart.reduce((sum, item) => sum + item.quantity * item.unitAmount, 0);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const checkout = searchParams.get("checkout");
    const returnedOrderId = searchParams.get("order");
    if (checkout === "success" && returnedOrderId) {
      setOrderId(returnedOrderId);
      setStatus("success");
      fetch("/api/demo/store/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: returnedOrderId }),
      }).catch(() => undefined);
    }
    if (checkout === "cancelled" && returnedOrderId) {
      setOrderId(returnedOrderId);
      setStatus("error");
    }
  }, []);

  function addToCart(product: (typeof storeProducts)[number]) {
    setCart((current) => {
      const existing = current.find((item) => item.id === product.id);
      if (existing) {
        return current.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [
        ...current,
        {
          id: product.id,
          name: product.name[locale],
          unitAmount: product.price,
          quantity: 1,
        },
      ];
    });
  }

  function updateQuantity(id: string, delta: number) {
    setCart((current) =>
      current
        .map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(0, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  async function checkOrderStatus() {
    if (!orderLookup.trim()) return;
    setLookupResult("...");
    const res = await fetch("/api/demo/store/status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId: orderLookup.trim() }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setLookupResult("not_found");
      return;
    }
    setLookupResult(data.order?.status || data.paymentStatus || "paid");
  }

  async function checkout() {
    if (!cart.length) return;
    setStatus("loading");
    const res = await fetch("/api/demo/store/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: cart, customer: form, locale }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setStatus("error");
      return;
    }
    setOrderId(data.orderId || "");
    setOrderLookup(data.orderId || "");
    setStatus("success");
    if (data.provider === "thawani" && data.checkoutUrl) {
      window.location.href = data.checkoutUrl;
    }
  }

  return (
    <div className="space-y-10">
      <section className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 text-sm font-semibold uppercase text-emerald-600 dark:text-emerald-300">
                <ShoppingBag className="h-4 w-4" />
                Thawani-ready commerce
              </div>
              <h2 className="mt-2 font-display text-4xl font-bold">{t.title}</h2>
              <p className="mt-3 max-w-2xl text-[rgb(var(--text-muted))]">
                {t.subtitle}
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="text-sm font-medium">
                {t.search}
                <div className="mt-2 flex items-center gap-2 rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--surface))] px-3 py-2">
                  <Search className="h-4 w-4 text-[rgb(var(--text-muted))]" />
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    className="min-w-0 bg-transparent text-sm outline-none"
                  />
                </div>
              </label>
              <label className="text-sm font-medium">
                {t.category}
                <select
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                  className="mt-2 block w-full rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--surface))] px-3 py-2"
                >
                  {categories.map((item) => (
                    <option key={item} value={item}>
                      {item === "All" ? t.all : item}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {products.map((product) => (
              <article
                key={product.id}
                className="overflow-hidden rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--surface))]"
              >
                <div className="aspect-square overflow-hidden bg-[rgb(var(--surface-2))]">
                  <img
                    src={product.image}
                    alt={product.name[locale]}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-display text-lg font-bold">
                      {product.name[locale]}
                    </h3>
                    <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-300">
                      {formatOmr(product.price, locale)}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-[rgb(var(--text-muted))]">
                    {product.description[locale]}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs text-[rgb(var(--text-muted))]">
                      {t.stock}: {product.stock}
                    </span>
                    <button
                      onClick={() => addToCart(product)}
                      className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white"
                    >
                      {t.add}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <aside className="h-fit rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-5">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-2xl font-bold">{t.cart}</h3>
            <CreditCard className="h-5 w-5 text-emerald-500" />
          </div>
          <div className="mt-5 space-y-3">
            {!cart.length && (
              <p className="rounded-lg bg-[rgb(var(--surface-2))] p-4 text-sm text-[rgb(var(--text-muted))]">
                {t.empty}
              </p>
            )}
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-3 border-b border-[rgb(var(--border))] pb-3"
              >
                <div>
                  <div className="font-semibold">{item.name}</div>
                  <div className="text-sm text-[rgb(var(--text-muted))]">
                    {item.quantity} x {formatOmr(item.unitAmount, locale)}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    aria-label="Decrease"
                    onClick={() => updateQuantity(item.id, -1)}
                    className="rounded-full p-2 hover:bg-[rgb(var(--surface-2))]"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <button
                    aria-label="Increase"
                    onClick={() => updateQuantity(item.id, 1)}
                    className="rounded-full p-2 hover:bg-[rgb(var(--surface-2))]"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                  <button
                    aria-label="Remove"
                    onClick={() => setCart((current) => current.filter((cartItem) => cartItem.id !== item.id))}
                    className="rounded-full p-2 text-rose-500 hover:bg-rose-500/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 flex items-center justify-between text-lg font-bold">
            <span>{t.total}</span>
            <span>{formatOmr(total, locale)}</span>
          </div>

          <div className="mt-6 border-t border-[rgb(var(--border))] pt-5">
            <h4 className="font-semibold">{t.customer}</h4>
            <div className="mt-4 grid gap-3">
              {(["name", "email", "phone", "area"] as const).map((key) => (
                <label key={key} className="text-sm">
                  {t[key]}
                  <input
                    value={form[key]}
                    onChange={(event) => setForm({ ...form, [key]: event.target.value })}
                    className="mt-1 w-full rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2"
                  />
                </label>
              ))}
            </div>
            <button
              onClick={checkout}
              disabled={!cart.length || status === "loading"}
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-600 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"
            >
              <PackageCheck className="h-4 w-4" />
              {status === "loading" ? "..." : t.placeOrder}
            </button>
            {status === "success" && (
              <p className="mt-3 rounded-lg bg-emerald-500/10 p-3 text-sm text-emerald-700 dark:text-emerald-300">
                {t.success} {orderId && `#${orderId}`}
              </p>
            )}
            {status === "error" && (
              <p className="mt-3 rounded-lg bg-rose-500/10 p-3 text-sm text-rose-600">
                Checkout could not be created. Try again.
              </p>
            )}
          </div>

          <div className="mt-6 border-t border-[rgb(var(--border))] pt-5">
            <h4 className="font-semibold">{t.orderStatus}</h4>
            <label className="mt-3 block text-sm">
              {t.orderId}
              <input
                value={orderLookup}
                onChange={(event) => setOrderLookup(event.target.value)}
                className="mt-1 w-full rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--bg))] px-3 py-2"
              />
            </label>
            <button
              onClick={checkOrderStatus}
              className="mt-3 w-full rounded-full border border-[rgb(var(--border))] px-4 py-2 text-sm font-semibold"
            >
              {t.checkStatus}
            </button>
            {lookupResult && (
              <div className="mt-3 rounded-lg bg-[rgb(var(--surface-2))] p-3 text-sm">
                {t.statusLabel}: <span className="font-semibold">{lookupResult}</span>
              </div>
            )}
          </div>
        </aside>
      </section>

      <section className="rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--surface))] p-5">
        <h3 className="font-display text-2xl font-bold">{t.orders}</h3>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm rtl:text-right">
            <thead className="text-[rgb(var(--text-muted))]">
              <tr>
                <th className="border-b border-[rgb(var(--border))] py-3">Order</th>
                <th className="border-b border-[rgb(var(--border))] py-3">Customer</th>
                <th className="border-b border-[rgb(var(--border))] py-3">Payment</th>
                <th className="border-b border-[rgb(var(--border))] py-3">Fulfillment</th>
                <th className="border-b border-[rgb(var(--border))] py-3">Total</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["ORD-1042", "Maha Al Hinai", "Paid via Thawani", "Packing", "84.900 OMR"],
                ["ORD-1041", "Salim Al Busaidi", "Pending", "Awaiting payment", "21.400 OMR"],
                ["ORD-1040", "Aisha Al Rawahi", "Paid via Thawani", "Delivered", "39.500 OMR"],
              ].map((row) => (
                <tr key={row[0]}>
                  {row.map((cell) => (
                    <td key={cell} className="border-b border-[rgb(var(--border))] py-3">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
