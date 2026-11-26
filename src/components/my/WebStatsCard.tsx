import MonthlyBars from '@/components/my/MonthlyBars'
import type { getMyStats } from '@/components/my/myStats'
import { GrassLegend, ReadingGrassGrid } from '@/components/my/ReadingGrass'
import YearSelectButton from '@/components/my/YearSelectButton'
import type { YearStats } from '@/types/my'

type WebStatsCardProps = {
  data: YearStats
  stats: ReturnType<typeof getMyStats>
  year: number
  onYearClick: () => void
  onStart: () => void
  className?: string
}

/** 웹 마이페이지 오른쪽 통계 카드: 누적 통계 4칸 + 월별 독서량 + 독서 잔디 */
function WebStatsCard({
  data,
  stats,
  year,
  onYearClick,
  onStart,
  className = '',
}: WebStatsCardProps) {
  const { hasRecords } = stats
  const tiles = [
    { label: '완독', value: data.stats.finished, unit: '권' },
    { label: '읽은 페이지', value: data.stats.pages, unit: 'p' },
    { label: '독서일', value: data.stats.days, unit: '일' },
    { label: '남긴 생각', value: data.stats.thoughts, unit: '개' },
  ]

  return (
    <section
      aria-labelledby="web-stats-title"
      className={`flex min-w-0 flex-col gap-6 rounded-2xl bg-surface-brown p-8 ${className}`}
    >
      <div className="flex items-center justify-between">
        <h3 id="web-stats-title" className="text-w-head-m text-text-secondary-brown">
          {year}년 독서 통계
        </h3>
        <YearSelectButton year={year} onClick={onYearClick} />
      </div>

      <ul className="flex gap-3">
        {tiles.map(({ label, value, unit }) => (
          <li
            key={label}
            className="flex min-w-0 flex-1 flex-col gap-2 rounded-2xl bg-surface-white p-5 whitespace-nowrap"
          >
            <span className="text-w-caption text-text-weak-brown">{label}</span>
            <span className="flex items-baseline gap-0.5">
              <span className="text-w-head-m text-text-secondary-brown">
                {value.toLocaleString()}
              </span>
              <span className="text-w-label-s text-text-weak-brown">{unit}</span>
            </span>
          </li>
        ))}
      </ul>

      <div className="flex h-[366px] gap-6">
        {/* 시안 300px, 아이패드 가로처럼 카드가 좁으면 줄여서 잔디 자리 확보 */}
        <div className="relative flex w-[38%] max-w-[300px] shrink-0 flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h4 className="text-w-label-s text-text-secondary-brown">월별 독서량</h4>
            <p className="text-w-caption text-text-weak-brown">
              최근 6개월 · {hasRecords ? `${stats.webPages}p 읽음` : '아직 기록이 없어요'}
            </p>
          </div>
          <MonthlyBars months={stats.webMonths} variant="web" className="min-h-0 flex-1" />
          {!hasRecords && (
            <div className="absolute inset-x-0 top-[102px] flex flex-col items-center gap-4">
              <div className="flex flex-col items-center gap-1 text-center">
                <p className="text-[17px] leading-6 font-semibold tracking-[-0.3px] text-text-secondary-brown">
                  첫 기록을 기다리고 있어요
                </p>
                <p className="text-w-body-m text-text-weak-brown">
                  책을 읽고 기록을 남기면
                  <br />
                  월별 독서량이 여기에 쌓여요
                </p>
              </div>
              <button
                type="button"
                onClick={onStart}
                className="rounded-2xl bg-action-green px-5 py-3 text-w-label-s text-text-contrast"
              >
                첫 교환독서 시작하기
              </button>
            </div>
          )}
        </div>

        <span aria-hidden className="w-[1.5px] shrink-0 bg-action-disabled" />

        <div className="flex min-w-0 flex-1 flex-col justify-between">
          <div className="flex flex-col gap-1">
            <h4 className="text-w-label-s text-text-secondary-brown">독서 잔디</h4>
            <p className="text-w-caption text-text-weak-brown">
              최근 26주 · {stats.webGrassDays}일 기록
            </p>
          </div>
          <ReadingGrassGrid grass={data.grass} endDate={data.endDate} variant="web" />
          {/* 좁으면 문구와 범례를 두 줄로 (잘리지 않게) */}
          <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
            <p className="text-w-caption break-keep text-text-weak-brown">
              {hasRecords
                ? `가장 많이 읽은 달 ${stats.best.month}월 · 최장 연속 ${stats.longestStreak}일`
                : '첫 기록을 남기면 오늘 칸부터 잔디가 채워져요'}
            </p>
            <GrassLegend variant="web" />
          </div>
        </div>
      </div>
    </section>
  )
}

export default WebStatsCard
