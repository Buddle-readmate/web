import type { RoomMember } from '@/types/room'

type MemberAvatarsProps = {
  members: RoomMember[]
  /** 앞에 보여줄 사람 수, 나머지는 +N */
  max?: number
}

/** 생각을 남긴 멤버 (겹친 프로필 2개 + "+N") */
function MemberAvatars({ members, max = 2 }: MemberAvatarsProps) {
  const shown = members.slice(0, max)
  const rest = members.length - shown.length

  return (
    <ul className="flex shrink-0">
      {shown.map((member) => (
        <li key={member.id} className="-mr-1 size-7 lg:size-6">
          {member.avatarUrl ? (
            <img
              src={member.avatarUrl}
              alt=""
              className="size-full rounded-full border-[1.5px] border-surface-white"
            />
          ) : (
            <span className="block size-full rounded-full border-[1.5px] border-surface-white bg-surface-gray" />
          )}
        </li>
      ))}
      {rest > 0 && (
        <li className="flex size-7 items-center justify-center rounded-full border-[1.5px] border-surface-white bg-surface-gray text-m-caption text-text-weak lg:size-6 lg:text-[10.3px] lg:leading-[13.7px]">
          +{rest}
        </li>
      )}
    </ul>
  )
}

export default MemberAvatars
