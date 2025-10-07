export interface UserDomain {
  id: string;
  email: string;
  type: string | null;
  enterprise_id?: string | null;
  sub_sector_id?: string | null;
}
