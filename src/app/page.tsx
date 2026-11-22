'use client'

import ClientCard from '@/components/ClientCard'
import ClientsList from '@/components/ClientsList'
import Header from '@/components/Header'
import { clients, plans } from '@/data'
import { useState } from 'react'

const styles = {
  page: 'flex min-h-screen w-full flex-col bg-slate-50',
  main: 'mx-auto w-full max-w-6xl flex-1 px-4 py-5 sm:px-6 sm:py-6',
  layout:
    'grid grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(320px,380px)_1fr] lg:gap-6'
} as const

type Client = {
  id: number
  name: string
  phone: string
  membership: {
    planId: number
    endDate: string
    visitsLeft: number | null
  } | null
  visits: string[]
}

export default function Home() {
  // Состояние для списка клиентов
  const [clientsList, setClientsList] = useState<Client[]>(clients)

  // Состояние для выбранного клиента (id)
  const [selectedId, setSelectedId] = useState<number | null>(null)

  // Находим выбранного клиента по id
  const selectedClient =
    clientsList.find(client => client.id === selectedId) ?? null

  // Отмечаем посещение: списываем 1 занятие (если не безлимит) и пишем сегодняшнюю дату без проверки абонемента
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
  const handleSellPlan = (clientId: number, planId: number) => {
    const selectedPlan = plans.find((plan) => plan.id === planId)
    if (!selectedPlan) {
      return
    }

    const startDate = new Date()
    const endDateObj = new Date(startDate)
    endDateObj.setDate(endDateObj.getDate() + selectedPlan.days)
    const endDate = endDateObj.toISOString().slice(0, 10)

    setClientsList((prevClients) =>
      prevClients.map((client) => {
        if (client.id !== clientId) {
          return client
        }

        return {
          ...client,
          membership: {
            planId: selectedPlan.id,
            endDate,
            visitsLeft: selectedPlan.visits,
          },
        }
      })
    )
  }

  return (
    <div className={styles.page}>
      <Header />

      <main className={styles.main}>
        <div className={styles.layout}>
          <ClientsList
            selectedId={selectedId}
            onSelectClient={setSelectedId}
            clients={clientsList as typeof clients}
          />
          <ClientCard
            client={selectedClient as (typeof clients)[number] | null}
            onMarkVisit={handleMarkVisit}
            onSellPlan={handleSellPlan}
          />
        </div>
      </main>
    </div>
  )
}
