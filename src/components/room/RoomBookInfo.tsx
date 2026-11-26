import { Link } from 'react-router-dom'
import icChevronRight16 from '@/assets/icons/ic-chevron-right-16.svg'
import type { RoomDetail } from '@/types/room'

type RoomBookInfoProps = {
  room: RoomDetail
}

/** 방 이름 + 책 표지·제목·저자 + 책장에서 보기 */
function RoomBookInfo({ room }: RoomBookInfoProps) {
  return (
    <div className="flex items-stretch gap-3">
      {room.coverUrl ? (
        <img
          src={room.coverUrl}
          alt={`${room.bookTitle} 표지`}
          width={84}
          height={126}
          className="h-[120px] w-[82px] shrink-0 rounded-[9px] border border-border-strong object-cover lg:h-[126px] lg:w-[84px]"
        />
      ) : (
        <span className="h-[120px] w-[82px] shrink-0 rounded-[9px] border border-border-strong bg-surface-gray lg:h-[126px] lg:w-[84px]" />
      )}

      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div className="flex flex-col gap-0.5 lg:gap-0">
          <h1 className="text-m-head-m break-keep [overflow-wrap:anywhere] text-text-default lg:text-w-head-m">
            {room.name}
          </h1>
          <p className="flex min-w-0 items-center gap-2 text-m-body-l font-medium text-text-weak">
            <span className="truncate">{room.bookTitle}</span>
            <span aria-hidden className="h-4 w-px shrink-0 bg-text-weak" />
            <span className="truncate">{room.author}</span>
          </p>
        </div>
        {/* TODO: 책장 상세 화면 나오면 해당 책으로 연결 */}
        <Link
          to="/shelf"
          className="flex items-center gap-1 self-start text-m-label-s text-text-weak lg:text-w-label-s"
        >
          책장에서 보기
          <img src={icChevronRight16} alt="" width={16} height={16} className="size-4" />
        </Link>
      </div>
    </div>
  )
}

export default RoomBookInfo
