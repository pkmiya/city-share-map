export const UserRole = {
  Admin: 'super_admin',
  Citizen: 'citizen',
  Staff: 'staff',
};

export type UserRoleType = (typeof UserRole)[keyof typeof UserRole];
