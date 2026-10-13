import LegalDocument from "@/components/LegalDocument";
import { contentApi } from "@/lib/content-api";
import { DEFAULT_TERMS_OF_SERVICE } from "@/lib/legal-content";
import { buildSeoMetadata, getSeoDefaultsForPath } from "@/lib/seo";

export async function generateMetadata() {
  const path = "/terms-of-use";
  const seo = await contentApi.seo(path).catch(() => null);
  const defaults = getSeoDefaultsForPath(path);
  return buildSeoMetadata(seo?.data, {
    title: defaults.defaultTitle,
    description: defaults.defaultDescription,
  }, path, { preferDefaults: true });
}

export default async function TermsOfUsePage() {
  const legal = await contentApi.legal().catch(() => null);
  const updatedAt = legal?.data.legal.updatedAt;
  const subtitle = updatedAt
    ? `Last updated: ${new Date(updatedAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })} · Effective immediately`
    : "Last updated: July 2026 · Please read carefully before using our services";

  return (
    <LegalDocument
      title="Terms of Service"
      subtitle={subtitle}
      content={legal?.data.legal.termsOfService?.trim() || DEFAULT_TERMS_OF_SERVICE}
      contactText="Questions about our Terms of Service? Contact us at:"
      contactEmail="legal@sportsverge.com"
    />
  );
}
