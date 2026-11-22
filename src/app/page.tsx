'use client'

import ClientCard from '@/components/ClientCard'
import ClientsList from '@/components/ClientsList'
import Header from '@/components/Header'
import { clients, plans } from '@/lib/data'
import {
  clearClientsStorage,
  readClientsFromStorage,
  writeClientsToStorage,
  type ClientsState
} from '@/lib/storage'
import { startTransition, useEffect, useState } from 'react'

const styles = {
  page: 'flex min-h-screen w-full flex-col bg-slate-50',
  main: 'mx-auto w-full max-w-6xl flex-1 px-4 py-5 sm:px-6 sm:py-6',
  toolbar: 'mb-4 flex justify-end',
  resetButton:
    'cursor-pointer rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-100',
  layout:
    'grid grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(320px,380px)_1fr] lg:gap-6'
} as const

export default function Home() {
  // Состояние для хранения списка клиентов
  const [clientsList, setClientsList] = useState<ClientsState>(clients)

  // Состояние для выбранного клиента (id)
  const [selectedId, setSelectedId] = useState<number | null>(null)

  // Флаг нужен, чтобы запись в localStorage не сработала раньше первичного чтения
  const [isHydratedFromStorage, setIsHydratedFromStorage] = useState(false)

  useEffect(() => {
    // Читаем сохранённый список после монтирования на клиенте и оборачиваем в startTransition
    const savedClients = readClientsFromStorage()

    startTransition(() => {
      if (savedClients) {
        setClientsList(savedClients)
        // Если выбранный id существовал, оставляем его; если нет — сбрасываем выбор
        setSelectedId(prevId =>
          prevId !== null && savedClients.some(client => client.id === prevId)
            ? prevId
            : null
        )
      }
      setIsHydratedFromStorage(true)
    })
  }, [])

  useEffect(() => {
    // Записываем в localStorage при изменении clientsList, но только после первичного чтения
    if (!isHydratedFromStorage) {
      return
    }

    writeClientsToStorage(clientsList)
  }, [clientsList, isHydratedFromStorage])

  // Находим выбранного клиента по id
  const selectedClient = (clientsList.find(
    client => client.id === selectedId
  ) ?? null) as (typeof clients)[number] | null

  // Отмечаем посещение: списываем 1 занятие (если не безлимит) и пишем дату
  // Примечание: toISOString() считает дату в UTC; при локальном сдвиге времени
  // ближе к краю суток может отличаться от локального календаря
  const handleMarkVisit = (clientId: number) => {
    const today = new Date().toISOString().slice(0, 10)

    setClientsList(prevClients =>
      prevClients.map(client => {
        if (client.id !== clientId || !client.membership) {
          return client
        } else {
          let nextVisitsLeft = client.membership.visitsLeft

          if (nextVisitsLeft !== null) {
            nextVisitsLeft = Math.max(0, nextVisitsLeft - 1)
          }

          return {
            ...client,
            membership: {
              ...client.membership,
              visitsLeft: nextVisitsLeft
            },
            visits: [...client.visits, today]
          }
        }
      })
    )
  }

  // Продаём абонемент: ставим новый срок от сегодняшнего дня и остаток занятий из тарифа
  // Примечание: здесь тоже используется UTC через toISOString()
  const handleSellPlan = (clientId: number, planId: number) => {
    const selectedPlan = plans.find(plan => plan.id === planId)
    if (!selectedPlan) {
      return
    }

    const startDate = new Date()
    const endDateObj = new Date(startDate)
    endDateObj.setDate(endDateObj.getDate() + selectedPlan.days)
    const endDate = endDateObj.toISOString().slice(0, 10)

    setClientsList(prevClients =>
      prevClients.map(client => {
        if (client.id !== clientId) {
          return client
        }

        return {
          ...client,
          membership: {
            planId: selectedPlan.id,
            endDate,
            visitsLeft: selectedPlan.visits
          }
        }
      })
    )
  }

  // Очищаем localStorage и возвращаем исходный массив clients из @/lib/data
  const handleResetDemoData = () => {
    clearClientsStorage()
    setClientsList(clients)
    setSelectedId(null)
  }

  return (
    <div className={styles.page}>
      <Header />

      <main className={styles.main}>
        <div className={styles.toolbar}>
          <button
            type="button"
            className={styles.resetButton}
            onClick={handleResetDemoData}
          >
            Сбросить демо-данные
          </button>
        </div>

        <div className={styles.layout}>
          <ClientsList
            selectedId={selectedId}
            onSelectClient={setSelectedId}
            clients={clientsList as typeof clients}
          />
          <ClientCard
            client={selectedClient}
            onMarkVisit={handleMarkVisit}
            onSellPlan={handleSellPlan}
          />
        </div>
      </main>
    </div>
  )
}
