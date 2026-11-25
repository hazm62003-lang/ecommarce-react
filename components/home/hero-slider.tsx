"use client";
import Link from "next/link";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { Button } from "@/components/ui/button";

let PHOTO = "/images/hero-groceries.png";

let overlay = "linear-gradient(90deg, rgba(22,163,74,0.92) 0%, rgba(34,197,94,0.78) 45%, rgba(34,197,94,0.55) 100%)";

let slides = [
  { title: "Fresh Products Delivered to your Door", text: "Get 20% off your first order", cta: "Shop Now", href: "/products" },
  { title: "New Arrivals Every Day", text: "Fashion, electronics and more from top brands", cta: "Explore Brands", href: "/brands" },
];

export function HeroSlider() {
  return (
    <section aria-label="Promotions">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        loop
        className="h-[300px] md:h-[400px]"
      >
        {slides.map((s) => (
          <SwiperSlide key={s.title}>
            <div
              className="flex h-full items-center bg-cover bg-center"
              style={{ backgroundImage: `${overlay}, url(${PHOTO})`, backgroundColor: "#16a34a" }}
            >
              <div className="container text-white">
                <h2 className="max-w-md text-3xl font-bold leading-tight md:text-4xl">{s.title}</h2>
                <p className="mt-3 text-base text-white/90">{s.text}</p>
                <div className="mt-6 flex gap-3">
                  <Button asChild variant="light"><Link href={s.href}>{s.cta}</Link></Button>
                  <Button asChild className="border border-white/70 bg-transparent hover:bg-white/10"><Link href="/products">View Deals</Link></Button>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
