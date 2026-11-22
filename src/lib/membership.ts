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

export function formatLocalIsoDate(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

export function getMembershipStatus(
  membership: Membership,
  today: string
): MembershipStatus {
  if (!membership) {
    return 'Нет абонемента'
  }

  if (membership.endDate < today) {
    return 'Истёк'
  }

  if (membership.visitsLeft !== null && membership.visitsLeft <= 0) {
    return 'Занятия закончились'
  }

  return 'Активен'
}

export function isMembershipActive(
  membership: Membership,
  today: string
): boolean {
  return getMembershipStatus(membership, today) === 'Активен'
}