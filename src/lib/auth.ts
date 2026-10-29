import { isServerSupabaseConfigured, createServerSupabaseClient } from "./supabase/server";
import { UserRole } from "@/types/database";
import { ProfileRow } from "@/types/project";

export interface CurrentUserSession {
  user: {
    id: string;
    email: string;
  } | null;
  profile: ProfileRow | null;
  isAuthenticated: boolean;
  role: UserRole;
  isDemoSession?: boolean;
}

/**
 * Retrieves the currently logged-in user and their profile record server-side.
 */
export async function getCurrentUser(): Promise<CurrentUserSession> {
  if (!isServerSupabaseConfigured()) {
    // Return unauthenticated guest state when Supabase credentials are not configured
    return {
      user: null,
      profile: null,
      isAuthenticated: false,
      role: "public",
      isDemoSession: true,
    };
  }

  try {
    const supabase = createServerSupabaseClient();
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user) {
      return {
        user: null,
        profile: null,
        isAuthenticated: false,
        role: "public",
      };
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", session.user.id)
      .maybeSingle();

    const typedProfile = profile as ProfileRow | null;
    const role: UserRole = typedProfile?.role || "user";

    return {
      user: {
        id: session.user.id,
        email: session.user.email || "",
      },
      profile: typedProfile,
      isAuthenticated: true,
      role,
    };
  } catch (err) {
    console.error("Error retrieving user session:", err);
    return {
      user: null,
      profile: null,
      isAuthenticated: false,
      role: "public",
    };
  }
}

/**
 * Server-side authorization check to ensure the actor holds one of the required roles.
 * Throws or returns an authorization error.
 */
export async function assertAuthorizedRole(allowedRoles: UserRole[]): Promise<CurrentUserSession> {
  const session = await getCurrentUser();

  if (!session.isAuthenticated || !session.user) {
    throw new Error("Authentication required. Please sign in to access this resource.");
  }

  if (!allowedRoles.includes(session.role)) {
    throw new Error(
      `Access denied. Role '${session.role}' is not authorized. Required: ${allowedRoles.join(", ")}`
    );
  }

  return session;
}
