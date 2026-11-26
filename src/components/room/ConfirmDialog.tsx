import { useId } from 'react'
import RoomFlowModal from '@/components/room/RoomFlowModal'

type ConfirmDialogProps = {
  title: string
  description: string
  /** 빨간 확인 버튼 문구 (삭제하기 / 나가기 / 내보내기) */
  confirmLabel: string
  onConfirm: () => void
  onCancel: () => void
}

/** 되돌릴 수 없는 동작 전에 한 번 더 묻는 창 (취소 / 빨간 확인 버튼) */
function ConfirmDialog({
  title,
  description,
  confirmLabel,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const titleId = useId()

  return (
    <RoomFlowModal labelledBy={titleId} onClose={onCancel} mobileVariant="card">
      <div className="flex flex-col gap-5 lg:gap-6">
        <div className="flex flex-col gap-1">
          <h2 id={titleId} className="text-m-head-m text-text-default lg:text-w-head-m">
            {title}
          </h2>
          <p className="text-m-body-m font-medium text-text-secondary lg:text-w-body-l lg:font-medium">
            {description}
          </p>
        </div>
        <div className="flex gap-2 lg:gap-3">
          {/* 실수로 확인하지 않도록 취소에 먼저 포커스 */}
          <button
            type="button"
            autoFocus
            onClick={onCancel}
            className="flex h-12 flex-1 items-center justify-center rounded-2xl bg-action-white text-m-label-m text-text-secondary lg:h-14 lg:text-w-label-l"
          >
            취소
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex h-12 flex-1 items-center justify-center rounded-2xl bg-surface-error text-m-label-m text-text-error lg:h-14 lg:text-w-label-l"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </RoomFlowModal>
  )
}

export default ConfirmDialog
