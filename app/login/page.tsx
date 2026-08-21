import { redirect } from "next/navigation";
import { LoginExperience } from "@/components/LoginExperience";
import { getSessionUser } from "@/lib/auth";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string }>;
}) {
  const user = await getSessionUser();
  if (user) redirect("/");

  const params = await searchParams;
  const mode = params.mode === "register" ? "register" : "login";

  return <LoginExperience mode={mode} />;
}
