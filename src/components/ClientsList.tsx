'use client'

import { type clients } from '@/lib/data'
import {
  formatLocalIsoDate,
  getMembershipStatus,
  type MembershipStatus
} from '@/lib/membership'
import { startTransition, useEffect, useState } from 'react'

const styles = {
  section:
    'flex w-full flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-xs sm:p-4',
  searchWrapper: 'w-full',
  searchInput:
    'w-full rounded-xl border border-slate-300 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition-colors focus:border-indigo-500 focus:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/30',
  list: 'flex flex-col gap-2',
  item: 'flex w-full cursor-pointer items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-left transition-colors hover:border-slate-300 hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500',
  itemActive:
    '!border-indigo-500 !bg-indigo-100/90 !text-indigo-950 hover:!border-indigo-600 hover:!bg-indigo-100',
  itemMain: 'flex min-w-0 flex-col gap-0.5',
  name: 'truncate text-sm font-semibold text-slate-900',
  phone: 'truncate text-xs text-slate-500',
  statusBadge: 'shrink-0 rounded-full px-2.5 py-1 text-xs font-medium',
  emptyState:
    'rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500'
} as const

const statusBadgeStyles: Record<MembershipStatus, string> = {
  Активен:
    'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20 ring-inset',
  Истёк: 'bg-amber-50 text-amber-800 ring-1 ring-amber-600/20 ring-inset',
  'Занятия закончились':
    'bg-orange-50 text-orange-800 ring-1 ring-orange-600/20 ring-inset',
  'Нет абонемента':
    'bg-slate-100 text-slate-600 ring-1 ring-slate-300/60 ring-inset'
}

interface ClientsListProps {
  clients: typeof clients // Список клиентов
  selectedId: number | null // Для подсветки выбранного клиента
  onSelectClient: (id: number) => void // Передаем id выбранного клиента в родительский компонент
}

export default function ClientsList({
  clients,
  selectedId,
  onSelectClient
}: ClientsListProps) {
  // Состояние для хранения текущей даты в формате ISO
  const [today, setToday] = useState<string | null>(null)
  useEffect(() => {
    const localToday = formatLocalIsoDate(new Date())
    startTransition(() => {
      setToday(localToday)
    })
  }, [])

  // Состояние для хранения поискового запроса
  const [searchQuery, setSearchQuery] = useState('')

  const trimmedQuery = searchQuery.trim().toLowerCase()
  const digitsQuery = searchQuery.replace(/\D/g, '')

  const filteredClients = clients.filter(client => {
    if (!trimmedQuery && !digitsQuery) {
      return true
    }

    const matchesName =
      Boolean(trimmedQuery) && client.name.toLowerCase().includes(trimmedQuery)

    const phoneTextMatch =
      Boolean(trimmedQuery) && client.phone.toLowerCase().includes(trimmedQuery)

    const clientDigits = client.phone.replace(/\D/g, '')
    const phoneDigitsMatch =
      digitsQuery.length > 0 && clientDigits.includes(digitsQuery)

    return matchesName || phoneTextMatch || phoneDigitsMatch
  })

  return (
    <section className={styles.section}>
      <div className={styles.searchWrapper}>
        <input
          type="search"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Поиск по имени или телефону..."
          className={styles.searchInput}
        />
      </div>

      {filteredClients.length === 0 ? (
        <div className={styles.emptyState}>Ничего не найдено</div>
      ) : (
        <ul className={styles.list}>
          {filteredClients.map(client => {
            const status = getMembershipStatus(
              client.membership,
              today ?? '1970-01-01'
            )

            return (
              <li key={client.id}>
                <button
                  type="button"
                  className={
                    styles.item +
                    (selectedId === client.id ? ` ${styles.itemActive}` : '')
                  }
                  onClick={() => onSelectClient(client.id)}
                >
                  <div className={styles.itemMain}>
                    <span className={styles.name}>{client.name}</span>
                    <span className={styles.phone}>{client.phone}</span>
                  </div>
                  <span
                    className={`${styles.statusBadge} ${statusBadgeStyles[status]}`}
                  >
                    {status}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
