/**
 * Organizations domain ports (M0.6). Workspace identity is static demo
 * identity, owned by the mock state seed (never redefined in web code).
 */
import type { Organization, User } from "@promotor/contracts";
import type { PromotorPublicProfile } from "@promotor/promotor-class-fixtures";

export interface WorkspaceView {
  organization: Organization;
  promotorUser: User;
  promotorPublicProfile: PromotorPublicProfile;
}

export interface OrganizationQueryPort {
  getWorkspace(): WorkspaceView;
}
