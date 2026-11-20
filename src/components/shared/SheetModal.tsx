import { useEffect, useId, useRef, type ReactNode } from 'react'
import icClose from '@/assets/icons/ic-close.svg'

type SheetModalProps = {
  title: string
  description?: ReactNode
  onClose: () => void
  children: ReactNode
}

/**
 * 화면 크기에 따라 모양이 바뀌는 창
 * - 모바일: 아래에서 올라오는 바텀시트 (손잡이 + 제목 + 닫기)
 * - 웹(lg): 화면 가운데 모달 560px
 * 닫기: X 버튼 / ESC / 바깥 영역 클릭
 */
function SheetModal({ title, description, onClose, children }: SheetModalProps) {
  const titleId = useId()
  const onCloseRef = useRef(onClose)

  useEffect(() => {
    onCloseRef.current = onClose
  })

  // 열려 있는 동안 뒤 화면 스크롤 막기 + ESC로 닫기
  useEffect(() => {
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onCloseRef.current()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = overflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  return (
    <div
      className="fixed inset-0 z-50 flex items-end bg-gray-900/50 lg:items-center lg:justify-center"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(event) => event.stopPropagation()}
        className="flex max-h-[calc(100dvh-24px)] w-full flex-col gap-5 overflow-y-auto rounded-t-3xl bg-surface-page px-6 pt-3 pb-[52px] lg:max-h-[calc(100dvh-64px)] lg:w-[560px] lg:gap-6 lg:rounded-2xl lg:bg-gray-50 lg:p-8 lg:shadow-modal"
      >
        <div className="flex justify-center lg:hidden">
          <span className="h-1 w-[84px] rounded-xl bg-[rgb(200_200_184/0.41)]" />
        </div>

        <header className="flex items-start justify-between">
          <div className="flex flex-col gap-0.5 lg:gap-1">
            <h2 id={titleId} className="text-m-head-m text-text-default lg:text-w-head-m">
              {title}
            </h2>
            {description && (
              <p className="text-m-caption text-text-weak lg:text-w-caption">{description}</p>
            )}
          </div>
          <button type="button" aria-label="닫기" onClick={onClose}>
            <img src={icClose} alt="" className="size-6" />
          </button>
        </header>

        {children}
      </div>
    </div>
  )
}

export default SheetModal
