import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from 'react'

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

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
  const pressedOutsideRef = useRef(false)
  // 창을 열기 직전 포커스 (닫으면 돌려줌)
  // 안쪽 autoFocus가 먼저 포커스를 가져가기 전, 처음 그릴 때 한 번만 기억
  const [previousFocus] = useState(() => document.activeElement as HTMLElement | null)

  useEffect(() => {
    onCloseRef.current = onClose
  })

  // 열려 있는 동안 뒤 화면 스크롤 막기 + ESC로 닫기 + 창으로 포커스 옮기기
  useEffect(() => {
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    // 안쪽 요소가 autoFocus로 포커스를 먼저 가져갔으면 그대로 둠
    if (!dialogRef.current?.contains(document.activeElement)) dialogRef.current?.focus()
    const handleKeyDown = (event: KeyboardEvent) => {
      // 안쪽 입력칸이 ESC를 먼저 쓴 경우(검색어 지우기 등)는 닫지 않음
      if (event.key === 'Escape' && !event.defaultPrevented) onCloseRef.current()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = overflow
      window.removeEventListener('keydown', handleKeyDown)
      previousFocus?.focus?.()
    }
  }, [previousFocus])

  // Tab 포커스가 창 밖(뒤 목록)으로 빠지지 않게 처음·끝에서 돌리기
  const trapFocus = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key !== 'Tab' || !dialogRef.current) return
    const focusables = [...dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
      (element) => element.offsetParent !== null,
    )
    if (focusables.length === 0) return
    const first = focusables[0]
    const last = focusables[focusables.length - 1]
    const active = document.activeElement
    if (event.shiftKey && (active === first || active === dialogRef.current)) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && active === last) {
      event.preventDefault()
      first.focus()
    }
  }

  const isFullscreen = mobileVariant === 'fullscreen'

  return (
    <div
      className={`fixed inset-0 z-50 flex lg:items-center lg:justify-center lg:bg-dim lg:p-6 ${isFullscreen ? 'bg-surface-page' : 'items-center justify-center bg-dim px-6'}`}
      // 모바일 전체 화면은 바깥 영역이 없어서 웹·카드일 때만 바깥 클릭으로 닫힘
      // 누른 곳과 뗀 곳이 모두 바깥일 때만 닫기 (창 안에서 글자 드래그하다 밖에서 떼도 안 닫히게)
      onPointerDown={(event) => {
        pressedOutsideRef.current = event.target === event.currentTarget
      }}
      onClick={(event) => {
        if (pressedOutsideRef.current && event.target === event.currentTarget) onClose()
        pressedOutsideRef.current = false
      }}
    >
      <div
        ref={dialogRef}
        onKeyDown={trapFocus}
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
