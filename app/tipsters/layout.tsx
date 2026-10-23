import type { ReactNode } from "react";
import TipsAuthGate from "@/components/TipsAuthGate";

export default function TipstersLayout({ children }: { children: ReactNode }) {
  return <TipsAuthGate>{children}</TipsAuthGate>;
}
