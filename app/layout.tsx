import type { Metadata } from "next";
import { Geist, Outfit, Space_Mono } from "next/font/google";
import AdminShortcut from "@/components/AdminShortcut";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  preload: false,
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  variable: "--font-space-mono",
  subsets: ["latin"],
  preload: false,
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL("https://dhananjayproject-rho.vercel.app"),
  title: "Dhanunjay Three Lenses Studio | Photography · Cinematography · Graphic Design",
  description:
    "Dhanunjay Three Lenses Studio is a creative studio by Dhanunjay offering professional photography, cinematography, and graphic designing services. Book your shoot today.",
  keywords: [
    "photography",
    "cinematography",
    "graphic design",
    "wedding photography",
    "studio",
    "Dhanunjay Three Lenses Studio",
  ],
  openGraph: {
    title: "It's Dhanunjay Three Lenses",
    description:
      "Capturing stories, one frame at a time. Photography · Cinematography · Graphic Design.",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} ${spaceMono.variable} ${outfit.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <div className="grain-overlay" aria-hidden="true" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ProfessionalService",
              name: "Dhanunjay Three Lenses Studio",
              description:
                "Professional photography, cinematography and graphic design studio by Dhanunjay. Weddings, brand films and creative design.",
              url: "https://dhananjayproject-rho.vercel.app",
              foundingDate: "2024",
              founder: { "@type": "Person", name: "Dhanunjay" },
              priceRange: "₹₹",
              address: { "@type": "PostalAddress", addressCountry: "IN" },
              knowsAbout: ["Photography", "Cinematography", "Graphic Design"],
            }),
          }}
        />
        <AdminShortcut />
        {children}
      </body>
    </html>
  );
}
