import { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "FitManager",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return children;
}
