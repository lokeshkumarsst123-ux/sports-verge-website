"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { NewsItem } from "@/types";
import { footballNewsData } from "@/data/mockData";

export default function FootballNews() {
  return (
    <section className="news-section bg-card rounded-3 p-4 border border-dark mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="m-0 fw-semibold border-start border-success border-3 ps-2">
          Football News
        </h5>
        <Link href="#" className="text-success text-decoration-none small fw-medium">
          View All
        </Link>
      </div>

      <div className="d-flex flex-column gap-3">
        {footballNewsData.map((item: NewsItem, index: number) => (
          <Link
            href="#"
            key={index}
            className="news-card d-flex flex-column flex-sm-row gap-3 gap-md-4 text-decoration-none rounded-3 p-3 border border-dark bg-dark-subtle"
          >
            <div className="news-img-wrapper flex-shrink-0 rounded-2 overflow-hidden">
              <Image
                src={item.image}
                alt={item.title}
                width={300}
                height={190}
                className="w-100 h-100 news-thumb"
              />
            </div>
            <div className="news-content d-flex flex-column justify-content-center py-1">
              <h5 className="text-white fw-bold mb-2 lh-sm">
                {item.title}
              </h5>
              <p className="text-muted small mb-3 lh-sm">
                {item.description}
              </p>
              <div className="text-muted mt-auto fs-11">
                {item.date}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}