import type { ExchangeRoom } from '@/types/home'

type ExchangeCardProps = {
  room: ExchangeRoom
  className?: string
}

/** 진행 중인 교환독서 카드 (표지 + 방 이름 + 책 정보 + 멤버 + 진행률) */
function ExchangeCard({ room, className = '' }: ExchangeCardProps) {
  return (
    // TODO: 교환독서 방 상세 연결 (/rooms/:roomId)
    <article
      className={`flex h-32 shrink-0 items-center overflow-hidden rounded-2xl border-[1.5px] border-border-strong bg-surface-white shadow-weak lg:h-[195px] ${className}`}
    >
      {room.coverUrl ? (
        <img src={room.coverUrl} alt="" className="h-full w-[84px] shrink-0 object-cover lg:w-32" />
      ) : (
        <span className="h-full w-[84px] shrink-0 bg-border-strong lg:w-32" />
      )}

      <div className="flex h-full min-w-0 flex-1 flex-col justify-between p-4 lg:p-6">
        <div className="flex flex-col gap-1 lg:gap-2">
          <div className="flex flex-col">
            <h3 className="truncate text-m-body-l font-medium text-text-default lg:text-w-body-l">
              {room.name}
            </h3>
            <p className="flex items-center gap-1 text-m-caption text-text-weak lg:text-w-caption">
              <span className="truncate">{room.bookTitle}</span>
              <span aria-hidden className="h-3 w-px shrink-0 bg-text-weak" />
              <span className="truncate">{room.author}</span>
            </p>
          </div>
          <ul aria-label={`멤버 ${room.memberAvatarUrls.length}명`} className="flex">
            {room.memberAvatarUrls.map((url, index) => (
              <li key={index} className="-mr-1 size-5 last:mr-0 lg:-mr-[4.8px] lg:size-6">
                {url ? (
                  <img src={url} alt="" className="size-full rounded-full" />
                ) : (
                  <span className="block size-full rounded-full bg-gray-200" />
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center gap-1 lg:gap-2">
          <span className="text-m-label-s text-text-secondary lg:text-w-label-s">
            {room.progress}%
          </span>
          <div
            role="progressbar"
            aria-valuenow={room.progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="진행률"
            className="flex h-[18px] flex-1 rounded-full bg-surface-gray-light p-0.5 lg:h-5"
          >
            <span className="rounded-full bg-border-green" style={{ width: `${room.progress}%` }} />
          </div>
        </div>
      </div>
    </article>
  )
}

export default ExchangeCard
