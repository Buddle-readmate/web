import icArrowLeft from '@/assets/icons/ic-arrow-left.svg'
import icArrowRight from '@/assets/icons/ic-arrow-right.svg'
import CalendarDayCell from '@/components/record/CalendarDayCell'
import type { ReadingRecord, RecordBook } from '@/types/calendar'
import { formatDateLabel, getMonthCells, toDateKey } from '@/utils/calendar'

const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토']

type ReadingCalendarProps = {
  year: number
  /** 1~12 */
  month: number
  records: ReadingRecord[]
  todayKey: string
  selectedKey: string
  onSelect: (dateKey: string) => void
  onPrevMonth: () => void
  onNextMonth: () => void
  onToday: () => void
  className?: string
}

/** 독서 캘린더 카드 (월 이동 + 일요일 시작 달력) */
function ReadingCalendar({
  year,
  month,
  records,
  todayKey,
  selectedKey,
  onSelect,
  onPrevMonth,
  onNextMonth,
  onToday,
  className = '',
}: ReadingCalendarProps) {
  const cells = getMonthCells(year, month, 'sun')

  // 날짜별 읽은 책 (같은 책은 한 번만)
  const booksByDate = new Map<string, RecordBook[]>()
  for (const record of records) {
    const books = booksByDate.get(record.date) ?? []
    if (!books.some((book) => book.id === record.book.id)) books.push(record.book)
    booksByDate.set(record.date, books)
  }

  const navButtonClass =
    'flex size-7 items-center justify-center rounded-full border-[1.5px] border-border-strong bg-surface-white lg:size-8'

  return (
    <section
      aria-label="독서 캘린더"
      className={`flex flex-col gap-3 overflow-hidden rounded-3xl bg-surface-white py-4 lg:rounded-2xl lg:py-6 ${className}`}
    >
      <div className="flex items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-2 lg:gap-3">
          <button
            type="button"
            aria-label="이전 달"
            onClick={onPrevMonth}
            className={navButtonClass}
          >
            <img src={icArrowLeft} alt="" className="size-3.5 lg:size-4" />
          </button>
          <h3
            className="text-m-head-m text-text-secondary-brown lg:text-w-head-m"
            aria-live="polite"
          >
            {year}년 {month}월
          </h3>
          <button
            type="button"
            aria-label="다음 달"
            onClick={onNextMonth}
            className={navButtonClass}
          >
            <img src={icArrowRight} alt="" className="size-3.5 lg:size-4" />
          </button>
        </div>
        <button
          type="button"
          onClick={onToday}
          className="rounded-2xl border-[1.5px] border-border-strong bg-surface-white px-3 py-1 text-m-caption text-text-secondary-brown lg:px-3.5 lg:py-1.5 lg:text-w-caption"
        >
          오늘
        </button>
      </div>

      <div className="grid grid-cols-7 text-center text-m-caption text-text-weak-brown lg:text-w-caption">
        {WEEKDAYS.map((weekday) => (
          <span key={weekday}>{weekday}</span>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {cells.map((day, index) => {
          if (day === null) return <span key={`blank-${index}`} className="aspect-[128/183]" />
          const dateKey = toDateKey(year, month, day)
          const books = booksByDate.get(dateKey) ?? []
          const isToday = dateKey === todayKey
          return (
            <CalendarDayCell
              key={dateKey}
              day={day}
              books={books}
              isToday={isToday}
              isSelected={dateKey === selectedKey}
              isFuture={dateKey > todayKey}
              onSelect={() => onSelect(dateKey)}
              label={`${formatDateLabel(dateKey)}${isToday ? ', 오늘' : ''}, ${books.length > 0 ? `${books.length}권 기록` : '기록 없음'}`}
            />
          )
        })}
      </div>
    </section>
  )
}

export default ReadingCalendar
