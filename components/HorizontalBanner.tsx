"use client";

import Image from "next/image";
import Link from "next/link";

export default function HorizontalBanner() {
    return (
        <section
            className="horizontal-ad-section rounded-3 border border-dark overflow-hidden mt-4 position-relative d-flex align-items-center horizontal-banner-bg"
        >
            <Link href="#">
                <Image
                    src="/assets/imgs/ad-2.webp"
                    alt="Sports Gear"
                    width={1400}
                    height={220}
                    className="img-fluid w-100 h-auto"
                    priority
                    sizes="(max-width: 768px) 100vw, 1400px"
                />
            </Link>
        </section>
    );
}