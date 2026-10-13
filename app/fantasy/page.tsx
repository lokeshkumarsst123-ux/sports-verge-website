import PageHeader from "@/components/PageHeader";
import { contentApi } from "@/lib/content-api";
import { buildSeoMetadata, getSeoDefaultsForPath } from "@/lib/seo";

export async function generateMetadata() {
  const path = "/fantasy";
  const seo = await contentApi.seo(path).catch(() => null);
  const defaults = getSeoDefaultsForPath(path);
  return buildSeoMetadata(seo?.data, {
    title: defaults.defaultTitle,
    description: defaults.defaultDescription,
  }, path, { preferDefaults: true });
}

export default function FantasyLeaguesPage() {
  return <main className="font-outfit"><PageHeader title="Fantasy Leagues" subtitle="Fantasy competitions are shown when a supported fantasy provider is connected." className="mb-5" /><div className="container custom-container"><div className="card bg-card border border-dark rounded-4 p-5 text-center text-muted">No fantasy-league API is configured, so no dummy leagues are displayed.</div></div></main>;
}
