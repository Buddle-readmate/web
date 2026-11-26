import icTagArrow from '@/assets/icons/ic-tag-arrow.svg'
import type { RoomMember } from '@/types/room'

type ReadingProgressProps = {
  totalPages: number
  members: RoomMember[]
  myId: number
}

const toPercent = (page: number, total: number) =>
  total > 0 ? Math.min(100, Math.round((page / total) * 100)) : 0

/** 웹: 읽은 쪽수 / 총 쪽수 + 멤버별 위치가 보이는 진행 막대 */
function ReadingProgress({ totalPages, members, myId }: ReadingProgressProps) {
  const me = members.find((member) => member.id === myId)
  const myPage = me?.readPage ?? 0
  const myPercent = toPercent(myPage, totalPages)
  // 내 프로필이 다른 멤버 위에 보이도록 맨 뒤에 그리기
  const ordered = [...members].sort((a, b) => Number(a.id === myId) - Number(b.id === myId))

  return (
    <section aria-label="읽기 진행" className="flex items-end">
      <div className="flex w-[140px] shrink-0 flex-col">
        <span className="text-m-body-m text-text-weak">읽은 쪽수 / 총 쪽수</span>
        <span className="text-m-head-m text-text-secondary-brown">
          <span className="text-text-green">{myPage}쪽</span> / {totalPages}쪽
        </span>
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1 py-1">
        <ul className="relative h-8">
          {ordered.map((member) => {
            const isMe = member.id === myId
            const percent = toPercent(member.readPage, totalPages)
            return (
              <li
                key={member.id}
                className="absolute top-0"
                // 프로필(32px)이 막대 밖으로 나가지 않게 남은 폭 기준으로 위치
                style={{ left: `calc((100% - 32px) * ${percent / 100})` }}
              >
                <span className="sr-only">
                  {isMe ? '나' : member.nickname} {member.readPage}쪽
                </span>
                {member.avatarUrl ? (
                  <img
                    src={member.avatarUrl}
                    alt=""
                    className={`size-8 rounded-full border-[1.5px] ${isMe ? 'border-border-green' : 'border-border-strong'}`}
                  />
                ) : (
                  <span
                    aria-hidden
                    className={`block size-8 rounded-full border-[1.5px] bg-surface-gray ${isMe ? 'border-border-green' : 'border-border-strong'}`}
                  />
                )}
                {isMe && (
                  <span
                    aria-hidden
                    className="absolute -top-[23px] left-1/2 flex -translate-x-1/2 flex-col items-center"
                  >
                    <span className="rounded-full bg-action-brown-selected px-2.5 py-0.5 text-w-label-s text-text-contrast">
                      {myPercent}%
                    </span>
                    <img src={icTagArrow} alt="" width={10} height={5} className="-scale-y-100" />
                  </span>
                )}
              </li>
            )
          })}
        </ul>

        <div
          role="progressbar"
          aria-valuenow={myPercent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="내 진행률"
          className="flex h-4 rounded-full bg-surface-page p-0.5"
        >
          <span
            className="rounded-full bg-border-green"
            style={{ width: `max(12px, ${myPercent}%)` }}
          />
        </div>
      </div>
    </section>
  )
}

export default ReadingProgress
