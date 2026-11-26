import { useEffect, useId, useRef, useState } from 'react'
import icLock from '@/assets/icons/ic-lock.svg'
import icPlus from '@/assets/icons/ic-plus.svg'
import GroupIcon from '@/components/shared/GroupIcon'
import MaskIcon from '@/components/shared/MaskIcon'

type RoomCreateMenuProps = {
  onCreate: () => void
  onJoin: () => void
}

/** 모바일 헤더 + 버튼 → 방 만들기 / 코드로 참여하기 메뉴 */
function RoomCreateMenu({ onCreate, onJoin }: RoomCreateMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const menuId = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  // 열려 있는 동안 바깥 클릭·ESC로 닫기
  useEffect(() => {
    if (!isOpen) return
    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setIsOpen(false)
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setIsOpen(false)
      buttonRef.current?.focus()
    }
    document.addEventListener('pointerdown', handlePointerDown)
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  // 메뉴를 닫기 전에 + 버튼으로 포커스를 돌려둠 → 띄운 창을 닫으면 + 버튼으로 돌아옴
  const choose = (action: () => void) => {
    buttonRef.current?.focus()
    setIsOpen(false)
    action()
  }

  return (
    <div
      ref={rootRef}
      // Tab으로 메뉴 밖으로 포커스가 나가면 닫기
      onBlur={(event) => {
        if (!rootRef.current?.contains(event.relatedTarget as Node | null)) setIsOpen(false)
      }}
      className="relative"
    >
      <button
        ref={buttonRef}
        type="button"
        aria-label="교환독서 추가"
        aria-expanded={isOpen}
        aria-controls={menuId}
        onClick={() => setIsOpen((open) => !open)}
        className="flex"
      >
        <img src={icPlus} alt="" width={28} height={28} className="size-7" />
      </button>

      {isOpen && (
        <ul
          id={menuId}
          className="absolute top-[calc(100%+20px)] right-0 z-30 flex w-[194px] flex-col rounded-2xl border border-border-strong bg-surface-white px-3 py-1 shadow-strong"
        >
          <li>
            <button
              type="button"
              onClick={() => {
                choose(onCreate)
              }}
              className="flex w-full items-center gap-2 py-3 text-m-label-m text-text-secondary"
            >
              <MaskIcon src={icPlus} className="size-5 bg-icon-weak" />방 만들기
            </button>
          </li>
          <li aria-hidden className="h-[1.5px] bg-border-default" />
          <li>
            <button
              type="button"
              onClick={() => {
                choose(onJoin)
              }}
              className="flex w-full items-center gap-2 py-3 text-m-label-m text-text-secondary"
            >
              <GroupIcon
                src={icLock}
                className="size-5"
                insetClassName="inset-[8.33%_12.5%]"
                bleedClassName="inset-[-5%_-5.56%]"
              />
              코드로 참여하기
            </button>
          </li>
        </ul>
      )}
    </div>
  )
}

export default RoomCreateMenu
