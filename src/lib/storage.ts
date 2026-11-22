const CLIENTS_STORAGE_KEY = 'reception-desk:clients:v1'

export type MembershipInfo = {
  planId: number
  endDate: string
  visitsLeft: number | null
}

export type ClientItem = {
  id: number
  name: string
  phone: string
  membership: MembershipInfo | null
  visits: string[]
}

export type ClientsState = ClientItem[]

export function readClientsFromStorage(): ClientsState | null {
  try {
    const raw = window.localStorage.getItem(CLIENTS_STORAGE_KEY)
    if (!raw) {
      return null
    }

    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) {
      return null
    }

    return parsed as ClientsState
  } catch {
    return null
  }
}

export function writeClientsToStorage(clientsData: ClientsState): void {
  try {
    window.localStorage.setItem(
      CLIENTS_STORAGE_KEY,
      JSON.stringify(clientsData)
    )
  } catch {
    // Игнорируем ошибки недоступного хранилища или превышения квоты
  }
}

export function clearClientsStorage(): void {
  try {
    window.localStorage.removeItem(CLIENTS_STORAGE_KEY)
  } catch {
    // Игнорируем ошибку при очистке хранилища
  }
}