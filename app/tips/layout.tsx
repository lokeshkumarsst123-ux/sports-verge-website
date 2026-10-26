import type { ReactNode } from "react";
import TipsAuthGate from "@/components/TipsAuthGate";

export default function TipsLayout({ children }: { children: ReactNode }) {
  return <TipsAuthGate>{children}</TipsAuthGate>;
}
