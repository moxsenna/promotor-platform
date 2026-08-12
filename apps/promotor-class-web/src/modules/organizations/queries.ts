/**
 * Organizations queries (M0.6): workspace identity + public profile for the
 * /p/[workspaceSlug] landing (promotor name/headline/city/instagram).
 * Workspace identity is static mock state — no dedicated repository needed.
 */
import type { PromotorPublicProfile } from "@promotor/promotor-class-fixtures";
import { getDefaultStore } from "@/adapters/mock/mock-state-store";
import type { MockStateStore } from "@/adapters/mock/mock-state-store";
import type { OrganizationQueryPort, WorkspaceView } from "./ports";

export interface OrganizationQueriesDeps {
  workspace: OrganizationQueryPort;
}

class MockWorkspacePort implements OrganizationQueryPort {
  constructor(private readonly store: MockStateStore) {}
  getWorkspace(): WorkspaceView {
    return this.store.getData().workspace;
  }
}

function resolveDeps(deps?: Partial<OrganizationQueriesDeps>): OrganizationQueryPort {
  return deps?.workspace ?? new MockWorkspacePort(getDefaultStore());
}

export function getWorkspace(deps?: Partial<OrganizationQueriesDeps>): WorkspaceView {
  return resolveDeps(deps).getWorkspace();
}

export function getPromotorPublicProfile(
  deps?: Partial<OrganizationQueriesDeps>
): PromotorPublicProfile {
  return resolveDeps(deps).getWorkspace().promotorPublicProfile;
}
