import NotificationItem from '@/components/home/NotificationItem'
import ResponsiveModal from '@/components/shared/ResponsiveModal'
import type { HomeNotification } from '@/types/home'

type NotificationModalProps = {
  notifications: HomeNotification[]
  onClose: () => void
}

// TODO: 알림 상세 시안 나오면 맞추기 (지금은 약관 모달 틀 + 홈 "새 알림" 목록 스타일)
function NotificationModal({ notifications, onClose }: NotificationModalProps) {
  return (
    <ResponsiveModal
      title="알림"
      onClose={onClose}
      webHeightClassName="lg:h-auto"
      webPosition="center"
    >
      {notifications.length === 0 ? (
        <p className="flex h-[222px] items-center justify-center text-m-label-l text-text-weak lg:text-w-label-l">
          새로운 알림이 없어요
        </p>
      ) : (
        <ul className="flex flex-col divide-y-[1.5px] divide-border-strong">
          {notifications.map((item) => (
            <NotificationItem key={item.id} notification={item} />
          ))}
        </ul>
      )}
    </ResponsiveModal>
  )
}

export default NotificationModal
