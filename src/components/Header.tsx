import Image from 'next/image'

const styles = {
  header: 'w-full border-b border-slate-200 bg-white',
  container:
    'mx-auto flex w-full max-w-6xl items-center justify-between gap-2 px-4 py-3 sm:gap-4 sm:px-6 sm:py-4',
  brand: 'flex min-w-0 items-center gap-2.5 sm:gap-3',
  logo: 'h-9 w-9 shrink-0 rounded-xl object-contain sm:h-10 sm:w-10',
  brandText: 'flex min-w-0 flex-col',
  title: 'truncate text-base leading-tight font-bold text-slate-900 sm:text-lg',
  subtitle: 'hidden text-xs font-medium text-slate-500 md:inline',
  actions: 'flex shrink-0 items-center justify-end gap-2 sm:gap-3',
  today: 'hidden text-xs font-medium text-slate-500 sm:inline',
  resetButton:
    'cursor-pointer rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition-colors hover:border-slate-400 hover:bg-slate-50 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 sm:px-3.5 sm:text-sm',
} as const

interface HeaderProps {
  onReset?: () => void
}

export default function Header({ onReset }: HeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.brand}>
          <Image
            src="/logo.svg"
            alt="Pulsea"
            width={40}
            height={40}
            priority
            className={styles.logo}
          />
          <div className={styles.brandText}>
            <span className={styles.title}>Pulsea</span>
          </div>
        </div>

        <div className={styles.actions}>
          <span className={styles.subtitle}>Абонементы и посещения</span>
          <button
            type="button"
            onClick={onReset}
            className={styles.resetButton}
          >
            Сбросить данные
          </button>
        </div>
      </div>
    </header>
  )
}