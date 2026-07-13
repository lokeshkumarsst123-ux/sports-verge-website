"use client";

import Image from "next/image";
import Link from "next/link";

export default function AdSection() {
  return (
    <aside className="ad-section rounded-3 border border-dark overflow-hidden mt-4 position-relative d-flex align-items-end">
      <Link href="#" className="w-100 h-100 d-block position-relative">
        <Image
          src="/assets/imgs/ad+1.webp"
          alt="Advertisement Background"
          fill
          sizes="(max-width: 991px) 100vw, 320px"
          className="object-fit-cover ad-bg-img"
        />
      </Link>
    </aside>
  );
}
