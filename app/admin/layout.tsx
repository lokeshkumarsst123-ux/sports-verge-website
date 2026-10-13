import "./admin.css";
import "react-datepicker/dist/react-datepicker.css";
import AdminShell from "@/components/admin/AdminShell";
import AdminToastProvider from "@/components/admin/AdminToast";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminToastProvider><AdminShell>{children}</AdminShell></AdminToastProvider>;
}
