type MonthSummaryProps = {
  month: number
  days: number
  pages: number
  className?: string
}

/** 이번 달 독서 요약 띠 (모바일 시안에만 있음) */
function MonthSummary({ month, days, pages, className = '' }: MonthSummaryProps) {
  return (
    <div
      className={`flex items-center gap-2 rounded-2xl bg-surface-brown px-4 py-3 whitespace-nowrap ${className}`}
    >
      <span className="text-m-caption text-text-weak-brown">{month}월 독서 요약</span>
      {days > 0 ? (
        <p className="flex items-baseline text-m-body-m font-medium text-text-secondary-brown">
          <strong className="text-m-label-m">{days}</strong>일 동안&nbsp;
          <strong className="text-m-label-m">{pages.toLocaleString()}</strong>쪽을 읽었어요
        </p>
      ) : (
        <p className="text-m-label-s text-text-secondary-brown">아직 이번 달 기록이 없어요</p>
      )}
    </div>
  )
}

export default MonthSummary
