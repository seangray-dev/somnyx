interface Referrer {
  firstName: string | undefined;
  lastName: string | undefined;
  email: string;
}

export function getDisplayName(referrer: Referrer): string {
  if (referrer.firstName && referrer.lastName) {
    return `${referrer.firstName} ${referrer.lastName}`;
  }
  return referrer.email;
}
