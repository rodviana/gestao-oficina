export const UserRole = Object.freeze({
  ADMIN: 'ADMIN',
  ATTENDANT: 'ATTENDANT',
  MECHANIC: 'MECHANIC',
});

export const UserRoleOptions = [
  { value: UserRole.ATTENDANT, label: 'Atendente' },
  { value: UserRole.MECHANIC, label: 'Mecânico' },
];

export function isAdminRole(role) {
  return role === UserRole.ADMIN;
}

export function roleLabel(role) {
  const option = UserRoleOptions.find((item) => item.value === role);
  if (option) return option.label;
  if (role === UserRole.ADMIN) return 'Administrador';
  return role;
}
