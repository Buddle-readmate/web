import icBookOpen from '@/assets/icons/ic-book-open.svg'
import type { ReadingRecord } from '@/types/calendar'
import { formatDateLabel, getRecordPages } from '@/utils/calendar'

type DayRecordPanelProps = {
  dateKey: string
  records: ReadingRecord[]
  isToday: boolean
  onAdd: () => void
  className?: string
}

function RecordItem({ record }: { record: ReadingRecord }) {
  return (
    <li className="flex items-center gap-3 rounded-2xl bg-surface-white p-3">
      {record.book.coverUrl ? (
        <img
          src={record.book.coverUrl}
          alt=""
          className="h-12 w-[34px] shrink-0 rounded object-cover lg:h-[50px] lg:w-9"
        />
      ) : (
        <span className="h-12 w-[34px] shrink-0 rounded bg-surface-brown lg:h-[50px] lg:w-9" />
      )}
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        {/* 아이패드 가로처럼 패널이 좁아지면 제목이 잘리지 않고 쪽수 배지가 아랫줄로 */}
        <div className="flex min-w-0 flex-wrap items-center gap-x-1.5 gap-y-0.5">
          <p className="min-w-0 text-m-label-s break-keep [overflow-wrap:anywhere] text-text-default lg:text-w-label-s">
            {record.book.title}
          </p>
          <span className="shrink-0 rounded-full bg-surface-brown px-2 py-0.5 text-m-caption text-text-secondary-brown">
            {record.startPage}–{record.endPage}p
          </span>
        </div>
        {/* 웹 시안은 책 제목 + 쪽수만 (메모는 모바일에서만) */}
        {record.memo && (
          <p className="truncate text-m-caption text-text-secondary lg:hidden">{record.memo}</p>
        )}
      </div>
    </li>
  )
}

/** 선택한 날짜의 독서 기록 (모바일: 달력 아래 / 웹: 달력 왼쪽 339px 베이지 패널) */
function DayRecordPanel({ dateKey, records, isToday, onAdd, className = '' }: DayRecordPanelProps) {
  const totalPages = records.reduce((sum, record) => sum + getRecordPages(record), 0)
  const bookCount = new Set(records.map((record) => record.book.id)).size
  const summary =
    records.length > 0
      ? `${bookCount}권 · ${totalPages}쪽`
      : `${isToday ? '오늘 · ' : ''}아직 기록이 없어요`

  return (
    <section
      aria-labelledby="day-record-title"
      className={`flex flex-col gap-3 rounded-3xl bg-surface-gray-light p-5 lg:rounded-2xl lg:bg-surface-brown lg:px-5 lg:py-6 ${className}`}
    >
      <div className="flex flex-col gap-0.5">
        <h3 id="day-record-title" className="text-m-label-l text-text-default lg:text-w-label-l">
          {formatDateLabel(dateKey)}
        </h3>
        <p className="text-m-caption text-text-weak lg:hidden">{summary}</p>
        {/* 웹 시안 문구 (기록이 없으면 기존 안내 그대로) */}
        <p className="hidden text-w-caption text-text-secondary-brown lg:block">
          {records.length > 0 ? '이날의 독서 기록이에요' : summary}
        </p>
      </div>

      {records.length > 0 ? (
        <ul className="flex flex-col gap-2 lg:gap-3">
          {records.map((record) => (
            <RecordItem key={record.id} record={record} />
          ))}
        </ul>
      ) : (
        <div className="flex flex-col items-center gap-2.5 rounded-2xl bg-surface-white px-5 py-6 text-center lg:gap-3 lg:py-7">
          <span className="flex size-11 items-center justify-center rounded-full bg-surface-brown lg:size-12">
            <img src={icBookOpen} alt="" className="size-[22px] lg:size-6" />
          </span>
          <p className="text-m-label-m text-text-default lg:text-w-label-s">
            오늘 읽은 책을 기록해 보세요
          </p>
          <p className="text-m-body-m text-text-secondary lg:text-caption lg:font-normal">
            기록하면 그날 칸에
            <br />책 표지가 퍼즐처럼 채워져요
          </p>
        </div>
      )}

      {/* 웹: 버튼을 패널 맨 아래로 */}
      <div className="hidden flex-1 lg:block" />

      <button
        type="button"
        onClick={onAdd}
        className="rounded-2xl bg-action-green py-3.5 text-m-label-s text-text-contrast lg:text-w-label-s"
      >
        + 이 날 기록 추가
      </button>
    </section>
  )
}

export default DayRecordPanel
