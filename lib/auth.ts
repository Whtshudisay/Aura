import { createClient } from "@/lib/supabase/server";

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  weeklyGoalMin: number;
};

export async function getSessionUser(): Promise<SessionUser | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("name, email, weekly_goal_min")
    .eq("id", user.id)
    .maybeSingle();

  const email = profile?.email || user.email || "";
  const name =
    profile?.name ||
    (typeof user.user_metadata?.name === "string" ? user.user_metadata.name : null) ||
    email.split("@")[0] ||
    "Friend";

  return {
    id: user.id,
    email,
    name,
    weeklyGoalMin: profile?.weekly_goal_min ?? 60,
  };
}

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
}
