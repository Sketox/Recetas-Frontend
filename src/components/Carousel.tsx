"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Image from "next/image";

const slides = [
  {
    title: "Paella Valenciana",
    image: "/images/paella.jpg",
  },
  {
    title: "Tacos Mexicanos",
    image: "/images/tacos.jpg",
  },
  {
    title: "Pastel de Chocolate",
    image: "/images/pastel.jpg",
  },
];

export default function RecipeCarousel() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-2">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 4000 }}
        loop
        className="rounded-lg overflow-hidden"
      >
        {slides.map((slide, i) => (
          <SwiperSlide key={i}>
            <div className="relative w-full h-[220px] md:h-[300px]">
              {/* Imagen */}
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                className="object-cover"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/30"></div>
              {/* Texto y botón */}
              <div className="absolute bottom-6 left-6 z-10">
                <h2 className="text-white text-2xl font-bold mb-2">
                  {slide.title}
                </h2>
                <button className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition">
                  Ver Receta →
                </button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
