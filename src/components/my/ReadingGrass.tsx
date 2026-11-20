import { useLayoutEffect, useRef } from 'react'
import type { StreakLevel } from '@/types/home'
import { getGrassWeeks } from '@/utils/grass'

const LEVEL_COLOR: Record<StreakLevel, string> = {
  0: 'bg-surface-white',
  1: 'bg-green-300',
  2: 'bg-green-400',
  3: 'bg-green-500',
  4: 'bg-green-600',
}

const WEEKDAY_LABELS = ['', '월', '', '수', '', '금', '']

// 모바일: 16주, 칸 15px / 웹: 26주, 칸 17px
const VARIANT = {
  mobile: {
    weeks: 16,
    cell: 15,
    cellClass: 'size-[15px]',
    labelClass: 'text-m-caption',
    labelRowClass: 'h-[15px]',
    gridGap: 'gap-1.5',
    monthRowClass: 'h-4',
    weekdayPadding: 'pt-[22px]',
    legendCell: 'size-2.5 rounded-[2px]',
    legendGap: 'gap-[3px]',
    legendWhite: '',
  },
  web: {
    weeks: 26,
    cell: 17,
    cellClass: 'size-[17px]',
    labelClass: 'text-w-caption',
    labelRowClass: 'h-[17px]',
    gridGap: 'gap-2',
    monthRowClass: 'h-[18px]',
    weekdayPadding: 'pt-[26px]',
    legendCell: 'size-3 rounded-[3px]',
    legendGap: 'gap-1',
    legendWhite: 'border border-border-strong',
  },
} as const

type ReadingGrassGridProps = {
  grass: Record<string, StreakLevel>
  /** 잔디 마지막 날짜 ('YYYY-MM-DD') */
  endDate: string
  variant: keyof typeof VARIANT
}

/** 요일 + 월 표시가 붙은 잔디 격자 (한 열 = 한 주, 일요일 시작) */
export function ReadingGrassGrid({ grass, endDate, variant }: ReadingGrassGridProps) {
  const v = VARIANT[variant]
  const weeks = getGrassWeeks(grass, v.weeks, endDate)
  // 좁은 화면에서는 칸 크기를 유지한 채 옆으로 스크롤
  const minWidth = v.weeks * v.cell + (v.weeks - 1) * 2
  const scrollRef = useRef<HTMLDivElement>(null)

  // 스크롤이 생기면 최근 주(오른쪽 끝)부터 보이게
  useLayoutEffect(() => {
    const element = scrollRef.current
    if (element) element.scrollLeft = element.scrollWidth
  }, [endDate])

  return (
    <div className={`flex w-full items-start ${variant === 'mobile' ? 'gap-1.5' : 'gap-2'}`}>
      <div
        aria-hidden
        className={`flex shrink-0 flex-col gap-0.5 text-text-weak-brown ${v.weekdayPadding} ${v.labelClass}`}
      >
        {WEEKDAY_LABELS.map((label, index) => (
          <span key={index} className={`flex w-3.5 items-center justify-center ${v.labelRowClass}`}>
            {label}
          </span>
        ))}
      </div>

      <div
        ref={scrollRef}
        className="min-w-0 flex-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <div className={`flex flex-col ${v.gridGap}`} style={{ minWidth }}>
          <div
            aria-hidden
            className={`relative text-text-weak-brown ${v.monthRowClass} ${v.labelClass}`}
          >
            {weeks.map(({ monthStart }, index) =>
              monthStart ? (
                <span
                  key={index}
                  className="absolute top-0 whitespace-nowrap"
                  style={{
                    left: `calc((100% - ${v.cell}px) * ${index / (weeks.length - 1)})`,
                  }}
                >
                  {monthStart}월
                </span>
              ) : null,
            )}
          </div>
          <ol className="flex items-start justify-between">
            {weeks.map((week, weekIndex) => (
              <li key={weekIndex}>
                <ol className="flex flex-col gap-0.5">
                  {week.cells.map((cell) => (
                    <li
                      key={cell.date}
                      aria-label={cell.date}
                      className={`rounded-[3px] ${v.cellClass} ${cell.isFuture ? 'border border-dashed border-action-disabled bg-surface-white' : LEVEL_COLOR[cell.level]}`}
                    />
                  ))}
                </ol>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  )
}

type GrassLegendProps = {
  variant: keyof typeof VARIANT
}

export function GrassLegend({ variant }: GrassLegendProps) {
  const v = VARIANT[variant]
  return (
    <div
      aria-hidden
      className={`flex shrink-0 items-center text-text-weak-brown ${v.legendGap} ${v.labelClass}`}
    >
      적게
      {([0, 1, 2, 3, 4] as const).map((level) => (
        <span
          key={level}
          className={`${v.legendCell} ${LEVEL_COLOR[level]} ${level === 0 ? v.legendWhite : ''}`}
        />
      ))}
      많이
    </div>
  )
}
