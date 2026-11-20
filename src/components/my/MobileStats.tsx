import { useState } from 'react'
import icBookOpen from '@/assets/icons/ic-book-open.svg'
import MaskIcon from '@/components/shared/MaskIcon'
import MonthlyBars from '@/components/my/MonthlyBars'
import type { getMyStats } from '@/components/my/myStats'
import { GrassLegend, ReadingGrassGrid } from '@/components/my/ReadingGrass'
import type { YearStats } from '@/types/my'

type Tab = 'grass' | 'monthly'

type MobileStatsProps = {
  data: YearStats
  stats: ReturnType<typeof getMyStats>
  onStart: () => void
}

/** 모바일 마이페이지 통계: 탭(독서 잔디 / 월별 독서량) + 인사이트 + 누적 통계 */
function MobileStats({ data, stats, onStart }: MobileStatsProps) {
  const [tab, setTab] = useState<Tab>('grass')
  const { hasRecords, current, best } = stats

  const tabs: { id: Tab; label: string }[] = [
    { id: 'grass', label: '독서 잔디' },
    { id: 'monthly', label: '월별 독서량' },
  ]

  const recentMonths = [...stats.mobileMonths].reverse().slice(0, 3)

  const summary = [
    { label: '완독', value: data.stats.finished },
    { label: '읽은 쪽', value: data.stats.pages },
    { label: '독서일', value: data.stats.days },
    { label: '남긴 생각', value: data.stats.thoughts },
  ]

  return (
    <>
      <div role="tablist" className="flex rounded-full bg-surface-gray-light p-1">
        {tabs.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={tab === id}
            onClick={() => setTab(id)}
            className={`flex-1 rounded-full py-2.5 ${tab === id ? 'bg-surface-white text-m-label-s text-text-default shadow-tab' : 'text-m-body-m font-medium text-text-weak'}`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'grass' ? (
        <section className="flex flex-col gap-3 rounded-3xl bg-surface-brown p-5">
          <div className="flex flex-col gap-0.5">
            <h3 className="text-m-label-m text-text-secondary-brown">독서 잔디</h3>
            <p className="text-m-caption text-text-weak-brown">
              {stats.mobileRange} · {stats.mobileGrassDays}일 기록
            </p>
          </div>
          <ReadingGrassGrid grass={data.grass} endDate={data.endDate} variant="mobile" />
          <div className="flex items-center justify-between gap-2">
            <p className="text-m-caption text-text-secondary-brown">
              {hasRecords
                ? `최장 연속 ${stats.longestStreak}일`
                : '첫 기록을 남기면 잔디가 채워져요'}
            </p>
            <GrassLegend variant="mobile" />
          </div>
        </section>
      ) : (
        <section
          className={`flex flex-col rounded-3xl bg-surface-brown p-5 ${hasRecords ? 'gap-4' : 'gap-5'}`}
        >
          <div className="flex flex-col gap-0.5">
            <h3 className="text-m-label-m text-text-secondary-brown">월별 독서량</h3>
            <p className="text-m-caption text-text-weak-brown">
              {stats.mobileRange} ·{' '}
              {hasRecords ? `${stats.mobilePages}p 읽음` : '아직 기록이 없어요'}
            </p>
          </div>
          {!hasRecords && (
            <div className="flex flex-col items-center gap-1 pt-2 text-center">
              <p className="text-m-label-m text-text-secondary-brown">아직 쌓인 독서량이 없어요</p>
              <p className="text-m-body-m text-text-secondary">
                책을 읽고 쪽수를 기록하면
                <br />
                달마다 막대가 자라나요
              </p>
            </div>
          )}
          <MonthlyBars months={stats.mobileMonths} variant="mobile" />
          {hasRecords && (
            <ul className="flex flex-col gap-2.5 border-t-[1.5px] border-brown-200 pt-4">
              {recentMonths.map((item, index) => (
                <li key={item.month} className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span className="text-m-label-s text-text-secondary-brown">{item.month}월</span>
                    <span className="text-m-caption text-text-weak-brown">
                      {index === 0 && data.isCurrentYear
                        ? `진행 중 · ${item.recordDays}일 기록`
                        : `${item.recordDays}일 기록 · ${item.finishedBooks}권 완독`}
                    </span>
                  </span>
                  <span className="text-m-label-s text-text-secondary-brown">
                    {item.pages.toLocaleString()}쪽
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      <div className="flex items-center gap-3 rounded-3xl bg-surface-green-soft p-4">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-surface-white">
          <MaskIcon src={icBookOpen} className="size-5 bg-action-green" />
        </span>
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <p className="truncate text-m-label-s text-text-default">
            {!hasRecords
              ? '아직 기록이 없어요'
              : tab === 'grass'
                ? `${best.month}월에 가장 많이 읽었어요`
                : `${best.month}월에 ${best.pages.toLocaleString()}쪽으로 가장 많이 읽었어요`}
          </p>
          {/* 지난 해는 '이번 달'·'목표 페이스'가 없어서 해당 부분을 빼고 보여줌 */}
          {(!hasRecords || tab === 'grass' || data.isCurrentYear) && (
            <p className="truncate text-m-caption text-text-secondary">
              {!hasRecords
                ? '첫 기록을 남겨보세요'
                : tab === 'grass'
                  ? `최장 연속 ${stats.longestStreak}일${data.isCurrentYear ? ` · 이번 달은 ${current.recordDays}일째 기록 중` : ''}`
                  : `${current.month}월은 하루 ${data.dailyPagePace}쪽이면 목표 페이스예요`}
            </p>
          )}
        </div>
        {!hasRecords && (
          <button
            type="button"
            onClick={onStart}
            className="shrink-0 rounded-2xl bg-action-green px-3.5 py-2 text-m-label-s text-text-contrast"
          >
            시작하기
          </button>
        )}
      </div>

      <ul className="flex items-center rounded-3xl bg-surface-brown px-2 py-4">
        {summary.map(({ label, value }, index) => (
          <li
            key={label}
            className={`relative flex flex-1 flex-col items-center gap-0.5 text-center ${index > 0 ? 'before:absolute before:top-1/2 before:left-0 before:h-7 before:w-px before:-translate-y-1/2 before:bg-action-disabled' : ''}`}
          >
            <span className="text-m-caption text-text-weak-brown">{label}</span>
            <span className="text-m-label-l text-text-secondary-brown">
              {value.toLocaleString()}
            </span>
          </li>
        ))}
      </ul>
    </>
  )
}

export default MobileStats
