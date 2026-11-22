export type MembershipStatus =
  | 'Активен'
  | 'Истёк'
  | 'Занятия закончились'
  | 'Нет абонемента'

export type Membership = {
  planId: number
  endDate: string
  visitsLeft: number | null
} | null

export function getMembershipStatus(membership: Membership): MembershipStatus {
  if (!membership) {
    return 'Нет абонемента'
  }

  const today = new Date().toISOString().slice(0, 10)

  if (membership.endDate < today) {
    return 'Истёк'
  }

  if (membership.visitsLeft !== null && membership.visitsLeft <= 0) {
    return 'Занятия закончились'
  }

  return 'Активен'
}

export function isMembershipActive(membership: Membership): boolean {
  return getMembershipStatus(membership) === 'Активен'
}