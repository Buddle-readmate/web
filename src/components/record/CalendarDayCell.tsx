import type { RecordBook } from '@/types/calendar'

// 표지 위치 (피그마 day 칸 기준, 표지 사이 흰 틈 약 1px)
// 2권: 좌우 반반 / 3~4권: 4칸 (3권이면 오른쪽 아래는 빈칸)
const HALF_LEFT = 'left-0 w-[48.83%]'
const HALF_RIGHT = 'left-[51.17%] w-[48.83%]'
const HALF_TOP = 'top-0 h-[49.18%]'
const HALF_BOTTOM = 'top-[50.82%] h-[49.18%]'

const COVER_POSITIONS: Record<number, string[]> = {
  1: ['inset-0'],
  2: [`${HALF_LEFT} inset-y-0`, `${HALF_RIGHT} inset-y-0`],
  4: [
    `${HALF_LEFT} ${HALF_TOP}`,
    `${HALF_RIGHT} ${HALF_TOP}`,
    `${HALF_LEFT} ${HALF_BOTTOM}`,
    `${HALF_RIGHT} ${HALF_BOTTOM}`,
  ],
}

type CalendarDayCellProps = {
  day: number
  /** 그날 읽은 책 (중복 없이) */
  books: RecordBook[]
  isToday: boolean
  isSelected: boolean
  isFuture: boolean
  onSelect: () => void
  label: string
}

/** 달력 하루 칸: 읽은 책 표지를 퍼즐처럼 채우고, 기록이 없으면 날짜만 표시 */
function CalendarDayCell({
  day,
  books,
  isToday,
  isSelected,
  isFuture,
  onSelect,
  label,
}: CalendarDayCellProps) {
  const covers = books.slice(0, 4)
  const positions = COVER_POSITIONS[covers.length > 2 ? 4 : covers.length] ?? []
  const hasCovers = covers.length > 0

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-label={label}
      aria-pressed={isSelected}
      className="relative aspect-[128/183] overflow-hidden bg-surface-white text-left"
    >
      {covers.map((book, index) =>
        book.coverUrl ? (
          <img
            key={book.id}
            src={book.coverUrl}
            alt=""
            className={`absolute object-cover ${positions[index]}`}
          />
        ) : (
          <span key={book.id} className={`absolute bg-surface-brown ${positions[index]}`} />
        ),
      )}

      {isToday ? (
        <span className="absolute top-1 left-1 flex items-center gap-1.5 lg:top-1.5 lg:left-1.5">
          <span className="flex size-5 items-center justify-center rounded-full bg-action-green text-[11px] leading-4 font-medium tracking-[-0.3px] text-text-contrast lg:size-[26px] lg:text-xs lg:font-semibold">
            {day}
          </span>
          {!hasCovers && (
            <span className="hidden text-xs leading-4 font-medium tracking-[-0.3px] text-text-green lg:inline">
              오늘
            </span>
          )}
        </span>
      ) : (
        !hasCovers && (
          <span
            className={`absolute top-[5px] left-1.5 text-[11px] leading-4 font-medium tracking-[-0.3px] lg:top-2 lg:left-2.5 lg:text-caption ${isFuture ? 'text-text-weak' : 'text-text-weak-brown'}`}
          >
            {day}
          </span>
        )
      )}

      {isSelected && (
        <span className="pointer-events-none absolute inset-0 border border-action-green lg:border-2" />
      )}
    </button>
  )
}

export default CalendarDayCell
