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
      {/* 아이패드 가로(1280px 미만)는 카드가 좁아 표지·여백을 줄여 방 이름 자리 확보 */}
      {room.coverUrl ? (
        <img
          src={room.coverUrl}
          alt=""
          className="h-full w-[84px] shrink-0 object-cover lg:w-28 xl:w-32"
        />
      ) : (
        <span className="h-full w-[84px] shrink-0 bg-border-strong lg:w-28 xl:w-32" />
      )}

      <div className="flex h-full min-w-0 flex-1 flex-col justify-between p-4 xl:p-6">
        <div className="flex items-start gap-2">
          <div className="flex min-w-0 flex-1 flex-col gap-1 lg:gap-2">
            <div className="flex flex-col">
              <h3 className="truncate text-m-body-l font-medium text-text-default lg:text-w-label-l lg:font-semibold">
                {room.name}
              </h3>
              <p className="flex items-center gap-1 text-m-caption font-medium text-text-weak lg:text-w-body-m lg:font-medium">
                <span className="truncate">{room.bookTitle}</span>
                <span aria-hidden className="h-3 w-px shrink-0 bg-text-weak" />
                <span className="truncate">{room.author}</span>
                <span aria-hidden className="h-3 w-px shrink-0 bg-text-weak" />
                <span className="shrink-0">{room.totalPages}쪽</span>
              </p>
            </div>
            <ul aria-label={`멤버 ${room.memberAvatarUrls.length}명`} className="flex">
              {room.memberAvatarUrls.map((url, index) => (
                <li
                  key={index}
                  className="-mr-1 size-5 last:mr-0 lg:-mr-1.5 lg:size-7 lg:last:mr-0"
                >
                  {url ? (
                    <img src={url} alt="" className="size-full rounded-full" />
                  ) : (
                    <span className="block size-full rounded-full bg-gray-200" />
                  )}
                </li>
              ))}
            </ul>
          </div>
          {/* 모바일: 방 이름 줄 가운데 정렬 (22px 줄에서 12px 글자) / 웹: 위쪽 정렬 */}
          <span className="mt-[3px] shrink-0 text-m-caption font-medium text-text-weak lg:mt-0 lg:text-w-body-m lg:font-medium">
            {room.lastActivityAgo}
          </span>
        </div>

        <div className="flex items-center gap-1 lg:gap-2">
          <span className="min-w-7 shrink-0 text-m-caption font-medium text-text-green lg:min-w-[38px] lg:text-w-label-m lg:font-semibold">
            {room.progress}%
          </span>
          <div
            role="progressbar"
            aria-valuenow={room.progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="진행률"
            className="flex h-3.5 flex-1 rounded-full bg-surface-gray-light p-0.5 lg:h-4"
          >
            <span className="rounded-full bg-border-green" style={{ width: `${room.progress}%` }} />
          </div>
        </div>
      </div>
    </article>
  )
}

export default ExchangeCard
