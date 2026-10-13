import type { Metadata } from "next";
import { contentApi } from "@/lib/content-api";
import { buildSeoMetadata, getSeoDefaultsForPath } from "@/lib/seo";
import NewsPageClient from "./NewsPageClient";

type NewsPageProps = {
  searchParams?: Promise<{ category?: string | string[] }>;
};

const readCategory = (value?: string | string[]) => Array.isArray(value) ? value[0] : value || "";

export async function generateMetadata({ searchParams }: NewsPageProps): Promise<Metadata> {
  const params = await searchParams;
  const category = readCategory(params?.category);
  const path = category ? `/news?category=${category}` : "/news";
  const seo = await contentApi.seo(path).catch(() => null);
  const defaults = getSeoDefaultsForPath(path);
  return buildSeoMetadata(seo?.data, {
    title: defaults.defaultTitle,
    description: defaults.defaultDescription,
  }, path, { preferDefaults: true });
}

export default async function NewsPage({ searchParams }: NewsPageProps) {
  const params = await searchParams;
  const category = readCategory(params?.category) || "All News";
  return <NewsPageClient key={category} initialCategory={category} />;
}
