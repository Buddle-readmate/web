import { useEffect, useId, useRef, type ReactNode } from 'react'
import icBack from '@/assets/icons/ic-back.svg'
import icClose from '@/assets/icons/ic-close.svg'

type ResponsiveModalProps = {
  title: string
  onClose: () => void
  children: ReactNode
  /** 웹(lg) 모달 높이. 기본은 약관 시안 기준 712px 고정 */
  webHeightClassName?: string
  /** 웹(lg) 세로 위치. top: 위에서 32px (약관 시안) / center: 화면 정가운데 */
  webPosition?: 'top' | 'center'
}

/**
 * 화면 크기에 따라 모양이 바뀌는 모달
 * - 모바일: 전체 화면 (뒤로가기 + 제목)
 * - 웹(lg): 어두운 배경 위 가운데 모달 554px (제목 + 닫기)
 * 닫기: 뒤로가기·X 버튼 / ESC / 바깥 영역 클릭
 */
function ResponsiveModal({
  title,
  onClose,
  children,
  webHeightClassName = 'lg:h-[712px]',
  webPosition = 'top',
}: ResponsiveModalProps) {
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
      className={`fixed inset-0 z-50 flex flex-col bg-surface-page lg:items-center lg:bg-dim ${webPosition === 'center' ? 'lg:justify-center' : 'lg:pt-8'}`}
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(event) => event.stopPropagation()}
        className={`flex min-h-0 flex-1 flex-col lg:max-h-[calc(100dvh-64px)] lg:w-[554px] lg:flex-none lg:gap-9 lg:rounded-3xl lg:bg-surface-page lg:px-9 lg:pt-9 lg:pb-8 lg:shadow-weak ${webHeightClassName}`}
      >
        {/* 모바일: 뒤로가기 + 제목 / 웹: 제목 + 닫기 */}
        <header className="flex h-14 shrink-0 items-center gap-2 px-6 lg:h-auto lg:justify-between lg:gap-0 lg:px-0">
          <button type="button" aria-label="뒤로" onClick={onClose} className="lg:hidden">
            <img src={icBack} alt="" className="size-6" />
          </button>
          <h1 id={titleId} className="text-m-head-m text-text-default lg:text-w-head-m">
            {title}
          </h1>
          <button type="button" aria-label="닫기" onClick={onClose} className="hidden lg:block">
            <img src={icClose} alt="" className="size-6" />
          </button>
        </header>

        {/* 웹: 스크롤바가 본문 오른쪽 여백 안(모달 끝에서 24px)에 오도록 오른쪽으로 12px 확장 */}
        <div className="scrollbar-slim min-h-0 flex-1 overflow-y-auto px-6 pt-3 pb-[52px] lg:-mr-3 lg:pt-0 lg:pr-2 lg:pb-0 lg:pl-0">
          {children}
        </div>
      </div>
    </div>
  )
}

export default ResponsiveModal
