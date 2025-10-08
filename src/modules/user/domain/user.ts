export interface UserDomain {
  id: string;
  email: string;
  type: string | null;
  enterpriseId?: string | null;
  sub_sectorId?: string | null;
}
