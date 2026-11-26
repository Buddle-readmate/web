import { useEffect, useId, useRef, type RefObject } from 'react'
import icCancel from '@/assets/icons/ic-cancel.svg'
import InviteCodeBox from '@/components/room/InviteCodeBox'
import MemberList from '@/components/room/MemberList'
import { MAX_ROOM_MEMBERS } from '@/stores/createdRoomStore'
import type { RoomDetail, RoomMember } from '@/types/room'

type FriendsPopoverProps = {
  room: RoomDetail
  isHost: boolean
  onRemove: (member: RoomMember) => void
  onClose: () => void
  /** 바깥 클릭으로 닫을 때 빼야 하는 여는 버튼 (버튼을 다시 누르면 토글되게) */
  triggerRef: RefObject<HTMLElement | null>
}

/** 웹: 멤버 아이콘 아래 뜨는 친구 목록 (초대코드 + 멤버, 방장은 내보내기) */
function FriendsPopover({ room, isHost, onRemove, onClose, triggerRef }: FriendsPopoverProps) {
  const titleId = useId()
  const rootRef = useRef<HTMLElement>(null)
  const onCloseRef = useRef(onClose)

  useEffect(() => {
    onCloseRef.current = onClose
  })

  // 바깥 클릭·ESC로 닫기 (위에 뜬 확인 창 안을 누른 건 제외)
  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Element
      if (rootRef.current?.contains(target) || triggerRef.current?.contains(target)) return
      if (target.closest('[role="dialog"]')) return
      onCloseRef.current()
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || document.querySelector('[role="dialog"]')) return
      onCloseRef.current()
      triggerRef.current?.focus()
    }
    document.addEventListener('pointerdown', handlePointerDown)
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [triggerRef])

  return (
    <section
      ref={rootRef}
      aria-labelledby={titleId}
      className="absolute top-[calc(100%-4px)] left-0 z-30 flex w-full max-w-[342px] flex-col gap-4 rounded-3xl bg-surface-page p-6 shadow-strong"
    >
      <div className="flex items-start justify-between">
        <h2 id={titleId} className="text-w-label-l text-text-default">
          친구 {room.members.length}/{MAX_ROOM_MEMBERS}
        </h2>
        <button type="button" aria-label="친구 목록 닫기" onClick={onClose} className="flex">
          <img src={icCancel} alt="" width={24} height={24} className="size-6" />
        </button>
      </div>
      <div className="flex flex-col gap-2">
        <InviteCodeBox roomName={room.name} inviteCode={room.inviteCode} password={room.password} />
        <MemberList
          members={room.members}
          hostId={room.hostId}
          myId={room.myId}
          onRemove={isHost ? onRemove : undefined}
        />
      </div>
    </section>
  )
}

export default FriendsPopover
