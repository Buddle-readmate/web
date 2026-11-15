import type { HomeNotification } from '@/types/home'

type NotificationItemProps = {
  notification: HomeNotification
}

/** 알림 한 줄 (프로필 + 내용 + 미리보기 + 시간) */
function NotificationItem({ notification }: NotificationItemProps) {
  return (
    <li className="flex items-center gap-3 py-4">
      {notification.avatarUrl ? (
        <img src={notification.avatarUrl} alt="" className="size-9 shrink-0 rounded-full" />
      ) : (
        <span className="size-9 shrink-0 rounded-full bg-gray-200" />
      )}
      <div className="flex min-w-0 flex-1 items-start justify-between gap-2">
        <div className="flex min-w-0 flex-1 flex-col">
          <p className="text-m-body-m font-medium text-text-default lg:text-w-body-m lg:font-medium">
            {notification.message}
          </p>
          <p className="truncate text-m-caption text-text-secondary lg:text-w-caption">
            {notification.preview}
          </p>
        </div>
        <span className="shrink-0 text-m-caption text-text-weak lg:text-w-caption">
          {notification.timeAgo}
        </span>
      </div>
    </li>
  )
}

export default NotificationItem
