import { Link } from 'react-router-dom'
import type { RoomSummary } from '@/types/room'

type RoomCardProps = {
  room: RoomSummary
}

/** 교환독서 목록 카드 (표지 + 방 이름 + 책 정보 + 멤버 + 진행률 / 완독) */
function RoomCard({ room }: RoomCardProps) {
  return (
    <Link
      to={`/rooms/${room.id}`}
      className="flex h-32 items-center overflow-hidden rounded-2xl border-[1.5px] border-border-strong bg-surface-white shadow-weak lg:h-[168px]"
    >
      {room.coverUrl ? (
        <img
          src={room.coverUrl}
          alt=""
          width={84}
          height={126}
          className="h-full w-[84px] shrink-0 object-cover lg:aspect-[128/192] lg:w-auto"
        />
      ) : (
        <span className="h-full w-[84px] shrink-0 bg-border-strong lg:aspect-[128/192] lg:w-auto" />
      )}

      <div className="flex h-full min-w-0 flex-1 flex-col justify-between p-4 lg:p-6">
        <div className="flex items-start gap-2">
          <div className="flex min-w-0 flex-1 flex-col gap-1 lg:gap-2">
            <div className="flex flex-col">
              <h3 className="truncate text-m-body-l font-medium text-text-default lg:text-w-label-l">
                {room.name}
              </h3>
              <p className="flex min-w-0 items-center gap-1 text-m-caption text-text-weak lg:text-w-body-m lg:font-medium">
                <span className="truncate">{room.bookTitle}</span>
                <span aria-hidden className="h-3 w-px shrink-0 bg-text-weak" />
                <span className="truncate">{room.author}</span>
                <span aria-hidden className="h-3 w-px shrink-0 bg-text-weak" />
                <span className="shrink-0">{room.totalPages}쪽</span>
              </p>
            </div>
            <ul aria-label={`멤버 ${room.memberAvatarUrls.length}명`} className="flex">
              {room.memberAvatarUrls.map((url, index) => (
                <li key={index} className="-mr-1 size-5 last:mr-0 lg:-mr-1.5 lg:size-7">
                  {url ? (
                    <img src={url} alt="" className="size-full rounded-full" />
                  ) : (
                    <span className="block size-full rounded-full border border-surface-white bg-surface-gray" />
                  )}
                </li>
              ))}
            </ul>
          </div>
          <span className="shrink-0 text-m-caption text-text-weak lg:text-w-body-m lg:font-medium">
            {room.lastActivity}
          </span>
        </div>

        <div className="flex items-center gap-1 lg:gap-2">
          <span className="w-7 shrink-0 text-m-caption text-text-green lg:w-[38px] lg:text-w-label-m">
            {room.isDone ? '완독' : `${room.progress}%`}
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
    </Link>
  )
}

export default RoomCard
