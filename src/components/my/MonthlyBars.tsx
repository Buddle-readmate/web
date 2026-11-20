import type { MonthlyReading } from '@/types/my'

// 모바일: 막대 40px, 가장 긴 막대 130px, 가운데 정렬 간격 32px
// 웹: 막대 32px, 가장 긴 막대 196px, 양끝 정렬
const VARIANT = {
  mobile: {
    maxHeight: 130,
    barClass: 'w-10',
    wrapClass: 'justify-center gap-8',
    labelClass: 'text-m-caption',
    gap: 'gap-1.5',
    emptyGap: 'gap-2',
    emptyBar: 'bg-gray-200',
  },
  web: {
    maxHeight: 196,
    barClass: 'w-8',
    wrapClass: 'justify-between',
    labelClass: 'text-w-caption',
    gap: 'gap-2',
    emptyGap: 'gap-2',
    emptyBar: 'bg-gray-300',
  },
} as const

type MonthlyBarsProps = {
  months: MonthlyReading[]
  variant: keyof typeof VARIANT
  className?: string
}

/** 월별 독서량 막대 (이번 달 = 초록 + 쪽수 말풍선). 기록이 없으면 6px 회색 막대 */
function MonthlyBars({ months, variant, className = '' }: MonthlyBarsProps) {
  const v = VARIANT[variant]
  const maxPages = Math.max(...months.map((item) => item.pages))
  const isEmpty = maxPages === 0

  return (
    <ol className={`flex items-end ${v.wrapClass} ${className}`}>
      {months.map((item, index) => {
        const isCurrent = index === months.length - 1
        return (
          <li
            key={`${item.year}-${item.month}`}
            className={`flex flex-col items-center ${isEmpty ? v.emptyGap : v.gap}`}
          >
            {isCurrent && !isEmpty && (
              <span
                className={`rounded-full bg-text-secondary-brown px-2 py-0.5 text-text-contrast ${v.labelClass}`}
              >
                {item.pages}p
              </span>
            )}
            <span
              aria-label={`${item.month}월 ${item.pages}쪽`}
              className={`rounded-t-md ${v.barClass} ${isEmpty ? `h-1.5 ${v.emptyBar}` : isCurrent ? 'bg-green-500' : 'bg-green-300'}`}
              style={isEmpty ? undefined : { height: (item.pages / maxPages) * v.maxHeight }}
            />
            <span
              className={`${v.labelClass} ${isCurrent && !isEmpty ? 'text-text-green' : 'text-text-weak-brown'}`}
            >
              {item.month}월
            </span>
          </li>
        )
      })}
    </ol>
  )
}

export default MonthlyBars
