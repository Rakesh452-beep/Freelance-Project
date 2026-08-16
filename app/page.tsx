import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import { getAdminClient } from "@/lib/supabase";

export const dynamic = "force-dynamic";

async function fetchStats() {
  try {
    const supabase = getAdminClient();
    const { data, error } = await supabase
      .from("bookings")
      .select("client_email, service");
    if (error || !data) {
      return { shoots: 0, clients: 0, cinematic: 0 };
    }
    const emails = new Set<string>();
    let cinematic = 0;
    for (const booking of data) {
      if (booking.client_email) emails.add(booking.client_email as string);
      if (booking.service === "cinematography") cinematic += 1;
    }
    return { shoots: data.length, clients: emails.size, cinematic };
  } catch {
    return { shoots: 0, clients: 0, cinematic: 0 };
  }
}
import Services from "@/components/Services";
import Portfolio from "@/components/Portfolio";
import About from "@/components/About";
import Testimonials from "@/components/Testimonials";
import CtaBanner from "@/components/CtaBanner";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import SectionDivider from "@/components/SectionDivider";

export default async function HomePage() {
  const stats = await fetchStats();

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero stats={stats} />
        <SectionDivider variant="lens" />
        <Services />
        <SectionDivider variant="film" />
        <Portfolio />
        <SectionDivider variant="pixel" />
        <About />
        <SectionDivider variant="lens" />
        <Testimonials />
        <SectionDivider variant="film" />
        <CtaBanner />
        <SectionDivider variant="pixel" />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
