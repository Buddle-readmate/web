import { useEffect, useRef, type ReactNode } from 'react'

type RoomFlowModalProps = {
  /** 대화상자 이름이 되는 제목 요소의 id */
  labelledBy: string
  onClose: () => void
  /**
   * 모바일 모양
   * - fullscreen: 화면 전체 (방 만들기)
   * - card: 가운데 뜨는 카드 (코드로 참가하기)
   * 웹(lg)은 둘 다 화면 가운데 520px 모달
   */
  mobileVariant: 'fullscreen' | 'card'
  children: ReactNode
}

/**
 * 교환독서 방 만들기·참가하기 창
 * 닫기: ESC / (카드·웹) 바깥 영역 클릭 / 안쪽 닫기 버튼
 */
function RoomFlowModal({ labelledBy, onClose, mobileVariant, children }: RoomFlowModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const onCloseRef = useRef(onClose)

  useEffect(() => {
    onCloseRef.current = onClose
  })

  // 열려 있는 동안 뒤 화면 스크롤 막기 + ESC로 닫기 + 창으로 포커스 옮기기
  useEffect(() => {
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    const previousFocus = document.activeElement as HTMLElement | null
    dialogRef.current?.focus()
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onCloseRef.current()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = overflow
      window.removeEventListener('keydown', handleKeyDown)
      previousFocus?.focus?.()
    }
  }, [])

  const isFullscreen = mobileVariant === 'fullscreen'

  return (
    <div
      className={`fixed inset-0 z-50 flex lg:items-center lg:justify-center lg:bg-dim lg:p-6 ${isFullscreen ? 'bg-surface-page' : 'items-center justify-center bg-dim px-6'}`}
      // 모바일 전체 화면은 바깥 영역이 없어서 웹·카드일 때만 바깥 클릭으로 닫힘
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        tabIndex={-1}
        className={`flex flex-col outline-none lg:max-h-[calc(100dvh-48px)] lg:w-[520px] lg:flex-none lg:rounded-3xl lg:bg-surface-page lg:p-8 lg:shadow-modal ${isFullscreen ? 'min-h-0 w-full flex-1' : 'max-h-[calc(100dvh-48px)] w-full max-w-[342px] -translate-y-[96px] rounded-[20px] bg-surface-page p-5 shadow-strong lg:max-w-none lg:translate-y-0'}`}
      >
        {children}
      </div>
    </div>
  )
}

export default RoomFlowModal
