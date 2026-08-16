import type { Service } from "@/lib/types";

export const studioConfig = {
  name: "Dhanunjay Three Lenses Studio",
  founder: "Dhanunjay",
  tagline: "Capturing stories, one frame at a time",
  intro:
    "I'm Dhanunjay — from weddings to brand films, I help people tell their stories through the lens — photography, cinematography, and design, all under one studio roof.",
  email: "itsdhanunjaythreelensstudio@gmail.com",
  phone: "+91 76709 00935",
  phoneRaw: "917670900935",
  instagram: "@its_dhanunjay.studio",
  instagramUrl: "https://www.instagram.com/its_dhanunjay.studio?igsh=dWlnaDFqeTA2NjNq",
  location: "Gitam University, Bengaluru, Nagadenahalli, Doddaballapura",
  currency: "INR",
  currencySymbol: "₹",
  adminEmail: process.env.ADMIN_EMAIL ?? "",
  upiId: process.env.NEXT_PUBLIC_UPI_ID ?? "",
  upiName: process.env.NEXT_PUBLIC_UPI_NAME ?? "",
};

export const services: Service[] = [
  {
    id: "photography",
    name: "Photography",
    tagline: "Moments that never fade",
    description:
      "Complete event photography at one flat price — camera rentals included, for corporate event shoots and full event coverages.",
    features: [
      "Camera rentals included",
      "Corporate event shoots",
      "Full event coverage",
      "Weddings, functions & ceremonies",
      "Professional editing included",
    ],
    priceFrom: 5000,
    priceNote: "All-inclusive — camera rentals + corporate shoots + event coverage",
    depositPct: 20,
    duration: "Full-day & half-day packs",
    eventTypes: [
      {
        id: "corporate-event",
        label: "Corporate event shoot",
        priceFrom: 5000,
        advance: 2000,
        note: "₹5,000 total",
      },
      {
        id: "event-coverage",
        label: "Event coverage",
        priceFrom: 5000,
        advance: 2000,
        note: "₹5,000 total",
      },
      {
        id: "personal",
        label: "Personal photography",
        priceFrom: 5000,
        advance: 1000,
        note: "₹5,000 total",
      },
    ],
  },
  {
    id: "cinematography",
    name: "Cinematography",
    tagline: "Films that feel like memories",
    description:
      "Cinematography reels and cinematic vlogs — shooting plus editing, priced simply per reel.",
    features: [
      "Per reel — shooting + editing",
      "Cinematography reels",
      "Cinematic vlogs",
      "4K shooting & color grading",
      "Final edited video delivered",
    ],
    priceFrom: 1000,
    priceNote: "Per reel · shooting + editing included",
    depositPct: 20,
    duration: "Per reel",
    eventTypes: [
      {
        id: "reels",
        label: "Reels",
        priceFrom: 1000,
        advance: 500,
        note: "₹1,000 per reel · total",
      },
      {
        id: "cinematic-vlogs",
        label: "Cinematic vlogs",
        priceFrom: 5000,
        advance: 1500,
        note: "₹5,000 total",
      },
      {
        id: "editing",
        label: "Editing",
        priceFrom: 4000,
        advance: 2000,
        note: "₹4,000 total",
      },
    ],
  },
  {
    id: "graphic-design",
    name: "Graphic Designing",
    tagline: "Design that speaks for you",
    description:
      "Social media posts, posters, flyers, and banners — from ₹100 per post. Whole-event design quoted after a quick discussion.",
    features: [
      "Per post — ₹100 to ₹1,000",
      "Posters, flyers & banners",
      "Full-event design — by quote",
      "Invitations & social creatives",
      "Revisions until you love it",
    ],
    priceFrom: 100,
    priceNote: "Per post ₹100–₹1,000 · full-event posters/flyers/banners by quote",
    depositPct: 50,
    duration: "Per project",
    eventTypes: [
      {
        id: "per-post",
        label: "Per post (₹100–₹1,000)",
        priceFrom: 100,
        advance: 200,
        note: "₹100–₹1,000 per post",
      },
      {
        id: "full-event",
        label: "Full event posters / flyers / banners",
        priceFrom: 0,
        advance: 0,
        quoteOnly: true,
        note: "By discussion / contact",
      },
    ],
  },
];
