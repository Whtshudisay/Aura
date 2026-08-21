import { notFound, redirect } from "next/navigation";
import { SessionView } from "@/components/SessionView";
import { getPatternById, patterns } from "@/data/patterns";
import { getSessionUser } from "@/lib/auth";
import { isGuestAllowedPattern } from "@/lib/guestAccess";

export function generateStaticParams() {
  return patterns.map((p) => ({ id: p.id }));
}

export default async function SessionPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ duration?: string; autostart?: string }>;
}) {
  const user = await getSessionUser();
  const { id } = await params;
  const { duration: durationRaw, autostart: autostartRaw } = await searchParams;
  const pattern = getPatternById(id);
  if (!pattern) notFound();

  if (!user && !isGuestAllowedPattern(pattern.id)) {
    redirect(`/login?mode=register&next=/session/${pattern.id}`);
  }

  const parsed = Number(durationRaw);
  const durationMin =
    Number.isFinite(parsed) && parsed > 0 ? parsed : pattern.defaultDurationMin;
  const autoStart = autostartRaw === "1" || autostartRaw === "true";

  return (
    <SessionView pattern={pattern} durationMin={durationMin} autoStart={autoStart} />
  );
}
