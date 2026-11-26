import icUserMinus from '@/assets/icons/ic-user-minus.svg'
import GroupIcon from '@/components/shared/GroupIcon'
import type { RoomMember } from '@/types/room'

type MemberListProps = {
  members: RoomMember[]
  hostId: number
  myId: number
  /** 방장만: 다른 멤버 내보내기 (없으면 버튼 안 보임) */
  onRemove?: (member: RoomMember) => void
}

/** 교환독서방 멤버 목록 (방장 맨 위, 방장은 다른 멤버 내보내기 가능) */
function MemberList({ members, hostId, myId, onRemove }: MemberListProps) {
  const ordered = [...members].sort((a, b) => Number(b.id === hostId) - Number(a.id === hostId))

  return (
    <ul className="flex flex-col">
      {ordered.map((member) => {
        const canRemove = onRemove && member.id !== hostId && member.id !== myId
        return (
          <li key={member.id} className="flex items-center gap-2 py-3 lg:h-13 lg:py-2">
            {member.avatarUrl ? (
              <img
                src={member.avatarUrl}
                alt=""
                className="size-8 shrink-0 rounded-full lg:size-7"
              />
            ) : (
              <span
                aria-hidden
                className="size-8 shrink-0 rounded-full bg-surface-gray lg:size-7"
              />
            )}
            <span className="min-w-0 flex-1 truncate text-m-body-l font-medium text-text-default lg:text-w-body-l lg:font-medium">
              {member.nickname}
              {member.id === myId && <span className="text-text-weak"> (나)</span>}
            </span>
            {member.id === hostId && (
              <span className="shrink-0 text-m-caption text-text-green lg:text-w-caption">
                방장
              </span>
            )}
            {canRemove && (
              <button
                type="button"
                aria-label={`${member.nickname} 내보내기`}
                onClick={() => onRemove(member)}
                className="flex shrink-0"
              >
                <GroupIcon
                  src={icUserMinus}
                  className="size-6"
                  insetClassName="inset-[12.5%_8.33%]"
                  bleedClassName="inset-[-5.56%_-5%]"
                />
              </button>
            )}
          </li>
        )
      })}
    </ul>
  )
}

export default MemberList
