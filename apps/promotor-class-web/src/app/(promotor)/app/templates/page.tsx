import type { Metadata } from "next";
import { TemplatesClient } from "./templates-client";

export const metadata: Metadata = {
  title: "Template",
};

export default function TemplatesPage() {
  return <TemplatesClient />;
}
