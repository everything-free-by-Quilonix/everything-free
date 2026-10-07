import type { Metadata } from "next";
import { StudentExplorer } from "@/features/students/components/student-explorer";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Free Software & Perks for Students",
  description:
    "Claim over $10,000 in free student developer packs, cloud infrastructure, AI models, IDEs, design suites and campus benefits with your student status.",
  path: "/students",
});

export default function StudentsPage() {
  return (
    <main className="min-h-screen">
      <StudentExplorer />
    </main>
  );
}
