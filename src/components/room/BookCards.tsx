import icRadioOff from '@/assets/icons/ic-radio-off.svg'
import icRadioOn from '@/assets/icons/ic-radio-on.svg'
import type { ShelfBook } from '@/types/room'

type BookCoverProps = {
  coverUrl?: string
  className: string
}

/** 작은 책 표지 (없으면 회색 칸) */
function BookCover({ coverUrl, className }: BookCoverProps) {
  return coverUrl ? (
    <img
      src={coverUrl}
      alt=""
      className={`shrink-0 rounded border border-border-strong object-cover ${className}`}
    />
  ) : (
    <span
      aria-hidden
      className={`shrink-0 rounded border border-border-strong bg-surface-gray ${className}`}
    />
  )
}

/** "헤르만 헤세 | 읽는 중 45%" 처럼 세로줄로 나눈 작은 글씨 */
function MetaLine({ items }: { items: string[] }) {
  return (
    <p className="flex min-w-0 items-center gap-1 text-m-caption text-text-secondary lg:text-w-caption">
      {items.map((item, index) => (
        // 제목과 저자가 같은 책도 있어서 순서로 구분
        <span key={index} className="flex min-w-0 items-center gap-1">
          {index > 0 && <span aria-hidden className="h-3 w-px shrink-0 bg-text-secondary" />}
          <span className="truncate">{item}</span>
        </span>
      ))}
    </p>
  )
}

const bookStatus = (book: ShelfBook) =>
  book.status === 'done' ? '완독' : `읽는 중 ${book.progress}%`

type BookOptionProps = {
  book: ShelfBook
  isSelected: boolean
  onSelect: () => void
}

/** 방 만들기 1단계: 내 책장 책 고르기 (라디오) */
export function BookOption({ book, isSelected, onSelect }: BookOptionProps) {
  return (
    <label
      className={`flex cursor-pointer items-center gap-3 rounded-2xl border-[1.5px] py-3 pr-5 pl-4 drop-shadow-bubble-w has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-border-green ${isSelected ? 'border-border-green bg-green-50' : 'border-border-default bg-surface-white'}`}
    >
      <input
        type="radio"
        name="room-book"
        checked={isSelected}
        onChange={onSelect}
        className="sr-only"
      />
      <BookCover coverUrl={book.coverUrl} className="h-[50px] w-8" />
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="truncate text-m-body-l font-medium text-text-default lg:text-w-body-l lg:font-medium">
          {book.title}
        </span>
        <MetaLine items={[book.author, bookStatus(book)]} />
      </span>
      <img src={isSelected ? icRadioOn : icRadioOff} alt="" width={20} height={20} />
    </label>
  )
}

type SelectedBookCardProps = {
  book: ShelfBook
  onChange: () => void
}

/** 방 만들기 2·3단계: 고른 책 + 변경 */
export function SelectedBookCard({ book, onChange }: SelectedBookCardProps) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border-[1.5px] border-border-default bg-surface-gray-light px-4 py-3">
      <BookCover coverUrl={book.coverUrl} className="h-[50px] w-8" />
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <p className="truncate text-m-body-l font-medium text-text-default lg:text-w-body-l lg:font-medium">
          {book.title}
        </p>
        <MetaLine items={[book.author, bookStatus(book)]} />
      </div>
      <button
        type="button"
        onClick={onChange}
        aria-label={`책 변경 (지금: ${book.title})`}
        className="p-1 text-m-label-m text-text-green lg:text-w-label-m"
      >
        변경
      </button>
    </div>
  )
}

type RoomInfoCardProps = {
  name: string
  bookTitle: string
  author: string
  totalPages: number
  coverUrl?: string
  memberCount: number
  maxMembers: number
  /** 완료 화면처럼 아래에 초대코드 칸이 붙을 때 위쪽 여백 */
  className?: string
}

/** 방 정보 카드 (표지 + 방 이름 + 책 정보 + 멤버 n/6명) */
export function RoomInfoCard({
  name,
  bookTitle,
  author,
  totalPages,
  coverUrl,
  memberCount,
  maxMembers,
  className = 'p-3',
}: RoomInfoCardProps) {
  return (
    <div className={`flex items-center gap-3 rounded-2xl bg-green-50 ${className}`}>
      <BookCover coverUrl={coverUrl} className="h-[68.5px] w-11" />
      <div className="flex min-w-0 flex-1 flex-col gap-[11px]">
        <div className="flex flex-col gap-0.5">
          <p className="truncate text-m-body-l font-medium text-text-default lg:text-w-body-l lg:font-medium">
            {name}
          </p>
          <MetaLine items={[bookTitle, author, `${totalPages}p`]} />
        </div>
        <p className="text-m-caption text-text-green lg:text-w-caption">
          멤버 {memberCount}/{maxMembers}명
        </p>
      </div>
    </div>
  )
}
