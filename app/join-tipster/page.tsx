import { redirect } from "next/navigation";

// Keep old bookmarks working without displaying a separate landing page.
export default function Page() {
  redirect("/tipster-register");
}
