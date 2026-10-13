import LegalDocument from "@/components/LegalDocument";
import { contentApi } from "@/lib/content-api";
import { DEFAULT_PRIVACY_POLICY } from "@/lib/legal-content";
import { buildSeoMetadata, getSeoDefaultsForPath } from "@/lib/seo";

export async function generateMetadata() {
  const path = "/privacy-policy";
  const seo = await contentApi.seo(path).catch(() => null);
  const defaults = getSeoDefaultsForPath(path);
  return buildSeoMetadata(seo?.data, {
    title: defaults.defaultTitle,
    description: defaults.defaultDescription,
  }, path, { preferDefaults: true });
}

export default async function PrivacyPolicyPage() {
  const legal = await contentApi.legal().catch(() => null);
  const updatedAt = legal?.data.legal.updatedAt;
  const subtitle = updatedAt
    ? `Last updated: ${new Date(updatedAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })} · Effective immediately`
    : "Last updated: July 2026 · Effective immediately";

  return (
    <LegalDocument
      title="Privacy Policy"
      subtitle={subtitle}
      content={legal?.data.legal.privacyPolicy?.trim() || DEFAULT_PRIVACY_POLICY}
      contactText="If you have questions about this Privacy Policy, contact us at:"
      contactEmail="privacy@sportsverge.com"
    />
  );
}
