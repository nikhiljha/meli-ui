export interface UserOrg {
  org: {
    _id: string;
    name: string;
    color: string;
  };
  member: {
    userId: string;
    admin: boolean;
  };
}
