import { describe, it, expect } from "vitest";
import { canTransitionStatus, getStatusBadge } from "./workflow";

describe("Project Workflow State Machine", () => {
  it("allows developer to submit a draft project they own", () => {
    const result = canTransitionStatus({
      currentStatus: "draft",
      targetStatus: "submitted",
      userRole: "developer",
      isDeveloperOwner: true,
    });
    expect(result.allowed).toBe(true);
  });

  it("prevents developer from submitting a project they do NOT own", () => {
    const result = canTransitionStatus({
      currentStatus: "draft",
      targetStatus: "submitted",
      userRole: "developer",
      isDeveloperOwner: false,
    });
    expect(result.allowed).toBe(false);
    expect(result.reason).toContain("only transition projects you own");
  });

  it("PREVENTS DEVELOPER FROM VERIFYING THEIR OWN PROJECT (Conflict of Interest check)", () => {
    const result = canTransitionStatus({
      currentStatus: "under_review",
      targetStatus: "verified",
      userRole: "developer",
      isDeveloperOwner: true,
    });
    expect(result.allowed).toBe(false);
    expect(result.reason).toContain("Conflict of Interest");
  });

  it("allows reviewer to transition project to under_review, verified, changes_requested, or rejected", () => {
    // Submitted -> Under Review
    expect(
      canTransitionStatus({
        currentStatus: "submitted",
        targetStatus: "under_review",
        userRole: "reviewer",
        isDeveloperOwner: false,
      }).allowed
    ).toBe(true);

    // Under Review -> Verified
    expect(
      canTransitionStatus({
        currentStatus: "under_review",
        targetStatus: "verified",
        userRole: "reviewer",
        isDeveloperOwner: false,
      }).allowed
    ).toBe(true);

    // Under Review -> Changes Requested
    expect(
      canTransitionStatus({
        currentStatus: "under_review",
        targetStatus: "changes_requested",
        userRole: "reviewer",
        isDeveloperOwner: false,
      }).allowed
    ).toBe(true);

    // Under Review -> Rejected
    expect(
      canTransitionStatus({
        currentStatus: "under_review",
        targetStatus: "rejected",
        userRole: "reviewer",
        isDeveloperOwner: false,
      }).allowed
    ).toBe(true);
  });

  it("allows developer to resubmit after changes are requested", () => {
    const result = canTransitionStatus({
      currentStatus: "changes_requested",
      targetStatus: "submitted",
      userRole: "developer",
      isDeveloperOwner: true,
    });
    expect(result.allowed).toBe(true);
  });

  it("rejects illegal transitions (e.g. draft directly to verified)", () => {
    const result = canTransitionStatus({
      currentStatus: "draft",
      targetStatus: "verified",
      userRole: "reviewer",
      isDeveloperOwner: false,
    });
    expect(result.allowed).toBe(false);
    expect(result.reason).toContain("Illegal state transition");
  });

  it("provides status badges for all states", () => {
    expect(getStatusBadge("draft").label).toBe("Draft");
    expect(getStatusBadge("submitted").label).toBe("Submitted");
    expect(getStatusBadge("under_review").label).toBe("Under Review");
    expect(getStatusBadge("verified").label).toBe("Verified");
    expect(getStatusBadge("changes_requested").label).toBe("Changes Requested");
    expect(getStatusBadge("rejected").label).toBe("Rejected");
  });
});

