import React from "react";

const DEFAULT_BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://arumtenda.com";

/**
 * LocalBusiness & PartyEquipmentRentalService Schema.org structured data
 * Optimizes local presence for Purbalingga and Banyumas Raya
 */
export function LocalBusinessJsonLd({ baseUrl = DEFAULT_BASE_URL }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "PartyEquipmentRentalService"],
    "@id": `${baseUrl}/#localbusiness`,
    name: "Arum Tenda",
    alternateName:
      "Arum Tenda Purbalingga — Persewaan Tenda & Perlengkapan Pesta",
    description:
      "Penyedia jasa sewa tenda pernikahan elegan, tenda acara keluarga, panggung, dekorasi kain serut, meja kursi, dan perlengkapan katering terpercaya di Purbalingga, Purwokerto, Banyumas, Cilacap, Banjarnegara, dan Kebumen.",
    url: baseUrl,
    telephone: "+6281234567890",
    priceRange: "Rp 65.000 - Rp 6.200.000",
    image: [
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&h=630&q=85",
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&h=630&q=85",
    ],
    address: {
      "@type": "PostalAddress",
      streetAddress: "Purbalingga",
      addressLocality: "Purbalingga",
      addressRegion: "Jawa Tengah",
      postalCode: "53372",
      addressCountry: "ID",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: -7.3887,
      longitude: 109.3564,
    },
    areaServed: [
      { "@type": "AdministrativeArea", name: "Kabupaten Purbalingga" },
      { "@type": "AdministrativeArea", name: "Kabupaten Banyumas" },
      { "@type": "City", name: "Purwokerto" },
      { "@type": "AdministrativeArea", name: "Kabupaten Cilacap" },
      { "@type": "AdministrativeArea", name: "Kabupaten Banjarnegara" },
      { "@type": "AdministrativeArea", name: "Kabupaten Kebumen" },
    ],
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "08:00",
        closes: "21:00",
      },
    ],
    sameAs: [
      "https://www.instagram.com/arumtendapbg/",
      "https://wa.me/6281234567890",
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Layanan Sewa Tenda & Alat Pesta",
      itemListElement: [
        {
          "@type": "OfferCatalog",
          name: "Sewa Tenda Acara & Pernikahan",
        },
        {
          "@type": "OfferCatalog",
          name: "Sewa Dekorasi Kain Serut & Plafon VIP",
        },
        {
          "@type": "OfferCatalog",
          name: "Sewa Perlengkapan Pesta & Jamuan Katering",
        },
      ],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * FAQPage Schema for Generative Engine Optimization (GEO)
 * Directly answers queries for Google AI Overviews, Perplexity, ChatGPT Search, and Gemini
 */
export function FaqJsonLd() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Berapa kisaran harga sewa tenda di Arum Tenda Purbalingga?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Harga sewa di Arum Tenda sangat fleksibel mulai dari Rp 65.000 untuk perlengkapan katering hingga paket tenda lengkap lamaran (Rp 1.850.000), resepsi rumah (Rp 3.500.000), hingga paket VIP tenda transparan (mulai Rp 6.200.000). Harga akhir disesuaikan dengan dimensi ukuran (m²) dan konfigurasi pilihan Anda.",
        },
      },
      {
        "@type": "Question",
        name: "Wilayah mana saja yang dijangkau pengiriman dan instalasi Arum Tenda?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Arum Tenda melayani pengantaran, pemasangan, dan pembongkaran menyeluruh untuk seluruh kawasan Banyumas Raya yang meliputi Kabupaten Purbalingga, Kota Purwokerto, Kabupaten Banyumas, Kabupaten Cilacap, Banjarnegara, serta Kebumen dan sekitarnya.",
        },
      },
      {
        "@type": "Question",
        name: "Apakah Arum Tenda menyediakan layanan survei denah lokasi venue langsung?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Ya, tim teknis Arum Tenda siap melakukan survei lokasi langsung ke tempat acara untuk mengukur bentang area, memeriksa kemiringan tanah/halaman, dan merekomendasikan konfigurasi tenda serta tata letak dekorasi yang paling aman dan estetis.",
        },
      },
      {
        "@type": "Question",
        name: "Apa saja varian tenda dan dekorasi yang disediakan Arum Tenda?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Arum Tenda menyediakan beragam varian: Tenda Plafon standar, Tenda Serut VIP dua warna, Tenda Roder semi-permanen, Tenda Transparan modern, panggung pelaminan, karpet jalan, AC standing, misty fan blower, serta kursi tiffany dan futura.",
        },
      },
      {
        "@type": "Question",
        name: "Apakah bisa menyewa perlengkapan katering dan alat jamuan saja tanpa tenda?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Bisa. Arum Tenda menyediakan inventaris perlengkapan jamuan mandiri seperti pemanas makanan (roll top / chafing dish), dispenser air stainless, piring makan keramik, mangkuk soup, gelas, toples kaca, sendok garpu, dan nampan saji kayu.",
        },
      },
      {
        "@type": "Question",
        name: "Bagaimana prosedur reservasi dan kapan jadwal pemasangan tenda dilakukan?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Reservasi dapat dilakukan via WhatsApp resmi Arum Tenda (+6281234567890) atau melalui katalog situs web. Tim instalasi umumnya memasang tenda H-1 atau H-2 sebelum hari acara agar keluarga dan vendor dekorasi lain memiliki waktu leluasa melakukan persiapan.",
        },
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
    />
  );
}

/**
 * Product & AggregateOffer Schema for catalog item pages
 */
export function ProductJsonLd({ product, baseUrl = DEFAULT_BASE_URL }) {
  if (!product) return null;

  // Derive prices
  let lowPrice = null;
  let highPrice = null;

  if (product.product_prices && product.product_prices.length > 0) {
    const prices = product.product_prices
      .map((p) => Number(p.price))
      .filter((p) => !isNaN(p) && p > 0);
    if (prices.length > 0) {
      lowPrice = Math.min(...prices);
      highPrice = Math.max(...prices);
    }
  }

  // Derive images
  const images = [];
  if (product.product_colors && product.product_colors.length > 0) {
    product.product_colors.forEach((c) => {
      if (c.image_url) images.push(c.image_url);
    });
  }
  if (images.length === 0) {
    images.push(
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&h=630&q=85",
    );
  }

  const productUrl = `${baseUrl}/katalog/${product.slug}`;

  const offers =
    lowPrice && highPrice && lowPrice !== highPrice
      ? {
          "@type": "AggregateOffer",
          url: productUrl,
          priceCurrency: "IDR",
          lowPrice: lowPrice,
          highPrice: highPrice,
          offerCount: product.product_prices.length,
          availability: "https://schema.org/InStock",
          seller: {
            "@type": "LocalBusiness",
            name: "Arum Tenda",
          },
        }
      : {
          "@type": "Offer",
          url: productUrl,
          priceCurrency: "IDR",
          price: lowPrice || 100000,
          availability: "https://schema.org/InStock",
          seller: {
            "@type": "LocalBusiness",
            name: "Arum Tenda",
          },
        };

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description:
      product.description ||
      `Sewa tenda ${product.name} kualitas terbaik dari Arum Tenda untuk pernikahan dan acara di Purbalingga & Banyumas Raya.`,
    image: images,
    url: productUrl,
    sku: `AT-${product.slug}`,
    brand: {
      "@type": "Brand",
      name: "Arum Tenda",
    },
    offers,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * BreadcrumbList Schema for structured navigation trails
 */
export function BreadcrumbJsonLd({ items = [], baseUrl = DEFAULT_BASE_URL }) {
  if (!items || items.length === 0) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.path.startsWith("http") ? item.path : `${baseUrl}${item.path}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
