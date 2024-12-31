export const UserRole = {
  Admin: 'admin',
  Citizen: 'citizen',
  Staff: 'staff',
};

export type UserRoleType = (typeof UserRole)[keyof typeof UserRole];
