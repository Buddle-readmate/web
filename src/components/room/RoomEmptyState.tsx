import type { ReactNode } from 'react'

type RoomEmptyStateProps = {
  title: string
  description: string
  /** 아래 초록 버튼 (없으면 안내 문구만) */
  action?: ReactNode
  /** 위아래 여백 등 (화면마다 다름) */
  className?: string
}

/** 교환독서 목록·이야기 목록이 비었을 때 안내 (그래픽 자리 + 제목 + 설명 + 버튼) */
function RoomEmptyState({ title, description, action, className = '' }: RoomEmptyStateProps) {
  return (
    <div className={`flex flex-col items-center gap-5 text-center ${className}`}>
      <div className="flex flex-col items-center gap-3">
        {/* TODO: 빈 상태 그래픽 나오면 교체 (시안: "빈 네모에는 추후 그래픽 추가") */}
        <span aria-hidden className="size-[79px] bg-border-strong" />
        <div className="flex flex-col gap-1">
          <p className="text-m-head-m text-text-secondary lg:text-w-head-m">{title}</p>
          <p className="text-w-body-l font-medium text-text-weak">{description}</p>
        </div>
      </div>
      {action}
    </div>
  )
}

export default RoomEmptyState
