import { VerificationStatus, UserRole } from "@/types/database";

export interface WorkflowTransitionRule {
  from: VerificationStatus;
  to: VerificationStatus;
  allowedRoles: UserRole[];
  description: string;
}

export const WORKFLOW_TRANSITIONS: WorkflowTransitionRule[] = [
  {
    from: "draft",
    to: "submitted",
    allowedRoles: ["developer", "admin"],
    description: "Submit draft project dossier for verification review",
  },
  {
    from: "submitted",
    to: "under_review",
    allowedRoles: ["reviewer", "admin"],
    description: "Reviewer claims submission and initiates technical audit",
  },
  {
    from: "under_review",
    to: "verified",
    allowedRoles: ["reviewer", "admin"],
    description: "Reviewer approves verification claims and assigns Trust Score",
  },
  {
    from: "under_review",
    to: "changes_requested",
    allowedRoles: ["reviewer", "admin"],
    description: "Reviewer requests additional documentation or revisions from developer",
  },
  {
    from: "under_review",
    to: "rejected",
    allowedRoles: ["reviewer", "admin"],
    description: "Reviewer formally rejects project due to unverifiable claims or fatal flaw",
  },
  {
    from: "changes_requested",
    to: "submitted",
    allowedRoles: ["developer", "admin"],
    description: "Developer addresses requested changes and resubmits for review",
  },
  {
    from: "verified",
    to: "under_review",
    allowedRoles: ["admin"],
    description: "Administrative trigger for re-review following material updates or audit",
  },
];

/**
 * Validates whether a requested status transition is allowed given the current status,
 * target status, user role, and developer ownership.
 */
export function canTransitionStatus({
  currentStatus,
  targetStatus,
  userRole,
  isDeveloperOwner,
}: {
  currentStatus: VerificationStatus;
  targetStatus: VerificationStatus;
  userRole: UserRole;
  isDeveloperOwner: boolean;
}): { allowed: boolean; reason?: string } {
  if (currentStatus === targetStatus) {
    return { allowed: true };
  }

  // Developer can NEVER approve/verify or reject projects!
  if (targetStatus === "verified" && isDeveloperOwner && userRole !== "admin") {
    return {
      allowed: false,
      reason: "Conflict of Interest: Developers cannot approve or verify their own projects.",
    };
  }

  // Find matching transition
  const rule = WORKFLOW_TRANSITIONS.find(
    (t) => t.from === currentStatus && t.to === targetStatus
  );

  if (!rule) {
    return {
      allowed: false,
      reason: `Illegal state transition from '${currentStatus}' to '${targetStatus}'.`,
    };
  }

  if (!rule.allowedRoles.includes(userRole)) {
    return {
      allowed: false,
      reason: `Role '${userRole}' is not authorized to transition project from '${currentStatus}' to '${targetStatus}'. Required roles: ${rule.allowedRoles.join(", ")}.`,
    };
  }

  // If role is developer, must be the owner of the project
  if (userRole === "developer" && !isDeveloperOwner) {
    return {
      allowed: false,
      reason: "You can only transition projects you own.",
    };
  }

  return { allowed: true };
}

/**
 * Get human-readable badge properties for verification status.
 */
export function getStatusBadge(status: VerificationStatus): {
  label: string;
  badgeBg: string;
  badgeColor: string;
  description: string;
} {
  switch (status) {
    case "verified":
      return {
        label: "Verified",
        badgeBg: "bg-emerald-50 border-emerald-300",
        badgeColor: "text-emerald-800",
        description: "Verification requirements met and corroborated by audit evidence.",
      };
    case "under_review":
      return {
        label: "Under Review",
        badgeBg: "bg-blue-50 border-blue-300",
        badgeColor: "text-blue-800",
        description: "Assigned to an independent reviewer for methodological verification.",
      };
    case "submitted":
      return {
        label: "Submitted",
        badgeBg: "bg-amber-50 border-amber-300",
        badgeColor: "text-amber-800",
        description: "Dossier submitted and awaiting reviewer assignment.",
      };
    case "changes_requested":
      return {
        label: "Changes Requested",
        badgeBg: "bg-orange-50 border-orange-300",
        badgeColor: "text-orange-800",
        description: "Reviewer requested clarifications or missing data from the developer.",
      };
    case "rejected":
      return {
        label: "Rejected",
        badgeBg: "bg-rose-50 border-rose-300",
        badgeColor: "text-rose-800",
        description: "Verification claims could not be established or project was rejected.",
      };
    case "draft":
    default:
      return {
        label: "Draft",
        badgeBg: "bg-slate-100 border-slate-300",
        badgeColor: "text-slate-700",
        description: "Initial preparation state. Visible only to the project developer.",
      };
  }
}
