import type { Metadata } from "next";
import ManagementStudio from "../management-studio";

export const metadata: Metadata = {
  title: "Management Studio — ASSEMBLY",
  description: "Interactive content management demo for ASSEMBLY talent management.",
};

export default function StudioPage() {
  return <ManagementStudio />;
}
