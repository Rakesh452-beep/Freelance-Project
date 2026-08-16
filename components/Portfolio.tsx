"use client";

import SectionHeading from "@/components/SectionHeading";
import AccordionGallery from "@/components/AccordionGallery";

const INSTAGRAM_URL =
  "https://www.instagram.com/its_dhanunjay.studio?igsh=dWlnaDFqeTA2NjNq";

const galleryItems = [
  { image: "/work-1.jpg", label: "Event" },
  { image: "/work-2.jpg", label: "Cinematic" },
  { image: "/architecture-shot.jpg", label: "Architecture shot" },
  { image: "/animal-shot.jpg", label: "Animal shot" },
  { image: "/portrait-shot.jpg", label: "Portrait shot" },
  { image: "/work-5.jpg", label: "Documentary" },
  { image: "/work-6.jpg", label: "Event" },
  { image: "/work-7.jpg", label: "Story Telling" },
  { image: "/work-8.jpg", label: "Brand Film" },
].map((item) => ({ ...item, link: INSTAGRAM_URL }));

export default function Portfolio() {
  return (
    <section id="work" className="relative overflow-hidden bg-abyss py-28">
      <div className="aurora pointer-events-none absolute inset-0 opacity-70" />
      <div className="vignette pointer-events-none absolute inset-0" />

      <div className="relative mx-auto max-w-6xl px-5">
        <SectionHeading
          index="02"
          eyebrow="Selected work"
          title="Frames from the archive"
          description="Hover a frame to expand it. The full portfolio is shared personally."
        />

        <div className="mt-12">
          <AccordionGallery
            items={galleryItems}
            defaultIndex={3}
            expandRatio={0.52}
            trigger="hover"
            accentColor="#dfe3e9"
            overlayColor="#0b1120"
            textColor="#dfe3e9"
            grayscale
            showLabels
            duration={0.6}
            ease="power3.out"
            parallax={0.5}
            tilt={8}
            stagger={0.06}
            height={460}
            gap={10}
            radius={16}
            orientation="horizontal"
          />
        </div>
      </div>
    </section>
  );
}
