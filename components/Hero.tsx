"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { SlideItem } from "@/types";
import { heroSlides } from "@/data/mockData";

export default function Hero() {
  const [activeIndex, setActiveIndex] = useState(0);

  // Auto slide interval
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % heroSlides.length);
    }, 5000); // Slide every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    setActiveIndex((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    setActiveIndex((prev) => (prev + 1) % heroSlides.length);
  };

  return (
    <section className="featured-news-section mb-4">
      <div id="featuredNewsCarousel" className="carousel slide">
        {/* Indicators */}
        <div className="carousel-indicators custom-indicators">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={index === activeIndex ? "active" : ""}
              aria-label={`Slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Slides */}
        <div className="carousel-inner border border-dark rounded-3 overflow-hidden">
          {heroSlides.map((item: SlideItem, index: number) => (
            <div
              key={index}
              className={`carousel-item ${index === activeIndex ? "active" : ""}`}
              style={{
                display: "block",
                position: index === activeIndex ? "relative" : "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                opacity: index === activeIndex ? 1 : 0,
                pointerEvents: index === activeIndex ? "auto" : "none",
                transition: "opacity 0.8s ease-in-out",
                zIndex: index === activeIndex ? 1 : 0,
              }}
            >
              <Link href="#" className="d-block text-decoration-none">
                <Image
                  src={item.image}
                  alt={item.title}
                  width={1200}
                  height={650}
                  className="featured-img w-100"
                  priority={index === 0}
                  fetchPriority={index === 0 ? "high" : "auto"}
                  sizes="(max-width: 768px) 100vw, 1200px"
                  style={{ objectFit: "cover" }}
                />

                <div className="featured-overlay"></div>

                <div className="carousel-caption custom-caption w-50 text-start">
                  <span className="badge fw-normal ms-badge bg-dark mb-3 rounded-pill small">
                    FEATURED NEWS
                  </span>

                  <h2 className="fw-semibold mb-3">
                    {item.title}
                  </h2>

                  <p className="mb-4 text-light">
                    {item.desc}
                  </p>

                  <button className="btn btn-success px-4 py-2">
                    Read Full Story
                    <i className="bi bi-arrow-right ms-2"></i>
                  </button>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="carousel-controls-custom">
          <button
            className="btn btn-dark-control"
            type="button"
            onClick={handlePrev}
            aria-label="Previous Slide"
          >
            <i className="bi bi-chevron-left"></i>
          </button>

          <button
            className="btn btn-dark-control"
            type="button"
            onClick={handleNext}
            aria-label="Next Slide"
          >
            <i className="bi bi-chevron-right"></i>
          </button>
        </div>
      </div>
    </section>
  );
}