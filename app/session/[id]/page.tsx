import { notFound } from "next/navigation";
import { SessionView } from "@/components/SessionView";
import { getPatternById, patterns } from "@/data/patterns";

export function generateStaticParams() {
  return patterns.map((p) => ({ id: p.id }));
}

export default async function SessionPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ duration?: string }>;
}) {
  // Auth is enforced in middleware — skip a second Supabase round-trip here.
  const { id } = await params;
  const { duration: durationRaw } = await searchParams;
  const pattern = getPatternById(id);
  if (!pattern) notFound();

  const parsed = Number(durationRaw);
  const durationMin =
    Number.isFinite(parsed) && parsed > 0 ? parsed : pattern.defaultDurationMin;

  return <SessionView pattern={pattern} durationMin={durationMin} />;
}
