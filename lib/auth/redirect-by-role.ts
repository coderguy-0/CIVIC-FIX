export function redirectByRole(role?: string) {
  switch (role) {
    case 'volunteer':
      return '/app/volunteer';
    case 'admin':
    case 'moderator':
      return '/app/admin';
    case 'user':
    default:
      return '/app/user';
  }
}
