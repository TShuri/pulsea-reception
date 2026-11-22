'use client'

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
  statusBadge:
    'shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700',
  emptyState:
    'rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500'
} as const

import { type clients } from '@/data'

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
  return (
    <section className={styles.section}>
      <div className={styles.searchWrapper}>
        <input
          type="search"
          placeholder="Поиск по имени или телефону..."
          className={styles.searchInput}
        />
      </div>

      <ul className={styles.list}>
        {clients.map(client => (
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
              <span className={styles.statusBadge}>
                {client.membership ? 'Абонемент' : 'Нет'}
              </span>
            </button>
          </li>
        ))}
      </ul>

      {/* <div className={styles.emptyState}>Ничего не найдено</div> */}
    </section>
  )
}
