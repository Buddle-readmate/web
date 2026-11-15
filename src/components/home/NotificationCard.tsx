import icRight from '@/assets/icons/ic-right.svg'
import NotificationItem from '@/components/home/NotificationItem'
import type { HomeNotification } from '@/types/home'

type NotificationCardProps = {
  notifications: HomeNotification[]
  onShowAll: () => void
  className?: string
}

/** 웹 홈 오른쪽 위 "새 알림" 카드 (최대 3개) */
function NotificationCard({ notifications, onShowAll, className = '' }: NotificationCardProps) {
  return (
    <section
      aria-label="새 알림"
      className={`flex-col gap-2 overflow-hidden rounded-3xl bg-surface-gray-light px-8 pt-8 pb-4 ${className}`}
    >
      <div className="flex items-center justify-between">
        <h2 className="text-w-label-m text-text-secondary">새 알림</h2>
        <button
          type="button"
          onClick={onShowAll}
          className="flex items-center gap-1 text-w-label-s text-text-weak"
        >
          모두 보기
          <img src={icRight} alt="" className="size-4" />
        </button>
      </div>

      {notifications.length === 0 ? (
        <p className="flex flex-1 items-center justify-center text-w-label-l text-text-weak">
          새로운 알림이 없어요
        </p>
      ) : (
        <ul className="flex flex-col divide-y-[1.5px] divide-border-strong">
          {notifications.slice(0, 3).map((item) => (
            <NotificationItem key={item.id} notification={item} />
          ))}
        </ul>
      )}
    </section>
  )
}

export default NotificationCard
