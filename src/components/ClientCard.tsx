'use client'

const styles = {
  card: 'flex w-full flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs sm:p-6',
  header:
    'flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-4',
  clientInfo: 'flex min-w-0 flex-col gap-1',
  name: 'truncate text-lg leading-tight font-bold text-slate-900 sm:text-xl',
  phone: 'text-sm text-slate-500',
  statusBadge:
    'shrink-0 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-600/20 ring-inset',
  membershipBlock:
    'flex flex-col gap-1 rounded-xl border border-slate-200/80 bg-slate-50 p-3.5 sm:p-4',
  membershipTitle: 'text-sm font-semibold text-slate-900 sm:text-base',
  membershipMeta: 'text-xs text-slate-600 sm:text-sm',
  actionsBlock: 'flex flex-col gap-2',
  visitButton:
    'w-full cursor-pointer rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-xs transition-colors hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500',
  saleBlock: 'flex flex-col gap-2.5 border-t border-slate-100 pt-4',
  saleTitle: 'text-sm font-semibold text-slate-800',
  tariffsList: 'grid grid-cols-1 gap-2 sm:grid-cols-2',
  tariffButton:
    'flex cursor-pointer flex-col items-start gap-0.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-left text-sm font-medium text-slate-800 transition-colors hover:border-indigo-400 hover:bg-indigo-50/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500',
  historyBlock: 'flex flex-col gap-2.5 border-t border-slate-100 pt-4',
  historyTitle: 'text-sm font-semibold text-slate-800',
  historyList: 'flex flex-col gap-1.5',
  historyItem:
    'flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600 sm:text-sm',
  emptyHistory:
    'rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 py-4 text-center text-xs text-slate-500 sm:text-sm',
  saleControls: 'flex flex-col gap-2 sm:flex-row',
  selectInput:
    'w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none',
  sellButton:
    'shrink-0 cursor-pointer rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700'
} as const


type Membership = {
  planId: number
  endDate: string
  visitsLeft: number | null
} | null

function isMembershipActive(membership: Membership): boolean {
  // Проверяем, активен ли абонемент
  if (!membership) {
    return false
  }

  const today = new Date().toISOString().slice(0, 10)

  // Если дата окончания уже прошла — абонемент неактивен
  if (membership.endDate < today) {
    return false
  }

  // Если не безлимит (visitsLeft не null) и занятия кончились — неактивен
  if (membership.visitsLeft !== null && membership.visitsLeft <= 0) {
    return false
  }
  
  return true
}

import { plans, type clients } from '@/data'
import { useState } from 'react'

type Client = (typeof clients)[number]

interface ClientCardProps {
  client: Client | null
  onMarkVisit: (clientId: number) => void
  onSellPlan: (clientId: number, planId: number) => void
}

export default function ClientCard({
  client,
  onMarkVisit,
  onSellPlan
}: ClientCardProps) {
  // Состояние выбранного тарифа для продажи абонемента по умолчанию первый тариф из списка
  const [selectedPlanId, setSelectedPlanId] = useState<number>(
    plans[0]?.id ?? 0
  )

  if (!client) {
    return (
      <section className={styles.card}>
        <p className={styles.emptyHistory}>Выбери клиента слева</p>
      </section>
    )
  }

  const currentPlan = client.membership
    ? plans.find(plan => plan.id === client.membership?.planId)
    : null
  const active = isMembershipActive(client.membership)

  return (
    <section className={styles.card}>
      {/* Имя, телефон клиента и статус абонемента */}
      <div className={styles.header}>
        <div className={styles.clientInfo}>
          <h2 className={styles.name}>{client.name}</h2>
          <p className={styles.phone}>{client.phone}</p>
        </div>
        <span className={styles.statusBadge}>
          {active ? 'Абонемент активен' : 'Абонемент неактивен'}
        </span>
      </div>

      {/* Информация о текущем абонементе */}
      <div className={styles.membershipBlock}>
        <p className={styles.membershipTitle}>Тариф: {currentPlan?.title}</p>
        <p className={styles.membershipMeta}>
          {client.membership
            ? `До ${client.membership.endDate} · Осталось: ${
                client.membership.visitsLeft === null
                  ? 'безлимит'
                  : client.membership.visitsLeft
              }`
            : 'Выбери тариф ниже'}
        </p>
      </div>

      {/* Блок действий */}
      {active ? (
        // Если абонемент активен, показываем кнопку "Отметить посещение"
        <div className={styles.actionsBlock}>
          <button
            type="button"
            className={styles.visitButton}
            onClick={() => onMarkVisit(client.id)}
          >
            Отметить посещение
          </button>
        </div>
      ) : (
        // Если абонемент неактивен, показываем блок с тарифами для продажи
        <div className={styles.saleBlock}>
          <h3 className={styles.saleTitle}>Оформить или продлить абонемент</h3>

          <div className={styles.saleControls}>
            <select
              value={selectedPlanId}
              onChange={e => setSelectedPlanId(Number(e.target.value))}
              className={styles.selectInput}
            >
              {plans.map(plan => (
                <option
                  key={plan.id}
                  value={plan.id}
                >
                  {plan.title} — {plan.days} дн.,{' '}
                  {plan.visits === null ? 'Безлимит' : `${plan.visits} зан.`},{' '}
                  {plan.price} ₽
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => onSellPlan(client.id, selectedPlanId)}
              className={styles.sellButton}
            >
              Продать
            </button>
          </div>
        </div>
      )}

      {/* История посещений выводится в сортированном виде*/}
      <div className={styles.historyBlock}>
        <h3 className={styles.historyTitle}>История посещений</h3>
        {client.visits.length === 0 ? (
          <p className={styles.emptyHistory}>Посещений пока нет</p>
        ) : (
          <ul className={styles.historyList}>
            {[...client.visits]
              .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
              .map((visit, index) => (
                <li
                  key={`${visit}-${index}`}
                  className={styles.historyItem}
                >
                  <span>Посещение</span>
                  <span>{visit}</span>
                </li>
              ))}
          </ul>
        )}
      </div>
    </section>
  )
}
