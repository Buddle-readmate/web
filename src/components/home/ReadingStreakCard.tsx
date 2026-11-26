import { useNavigate } from 'react-router-dom'
import icChevronRight from '@/assets/icons/ic-chevron-right.svg'
import icRight from '@/assets/icons/ic-right.svg'
import type { ReadingStreak, StreakLevel } from '@/types/home'
import { getMonthCells } from '@/utils/calendar'

const WEEKDAYS = ['월', '화', '수', '목', '금', '토', '일']

const LEVEL_COLOR: Record<StreakLevel, string> = {
  0: 'bg-surface-white',
  1: 'bg-green-300',
  2: 'bg-green-400',
  3: 'bg-green-500',
  4: 'bg-green-600',
}

type ReadingStreakCardProps = {
  nickname: string
  streak: ReadingStreak
  className?: string
}

/** 이번 달 독서 잔디 카드 */
function ReadingStreakCard({ nickname, streak, className = '' }: ReadingStreakCardProps) {
  const navigate = useNavigate()
  const cells = getMonthCells(streak.year, streak.month)
  const stats = [
    { value: streak.days, mobile: '일간,', web: '일에 걸쳐서,' },
    { value: streak.pages, mobile: '쪽,', web: '쪽의 분량을 읽고,' },
    { value: streak.thoughts, mobile: '개 생각', web: '개의 생각을 공유했어요.' },
  ]

  return (
    <section
      aria-label="이번 달 독서 잔디"
      className={`flex items-center justify-between overflow-hidden rounded-3xl bg-surface-brown p-5 lg:items-end lg:gap-6 lg:px-7 lg:py-8 xl:gap-9 xl:px-9 ${className}`}
    >
      {/* 왼쪽: 월 + 통계 */}
      <div className="flex flex-col justify-between self-stretch lg:flex-1">
        <div className="flex flex-col gap-1">
          <button
            type="button"
            onClick={() => navigate('/calendar')}
            className="flex items-center gap-0.5 lg:gap-1"
          >
            <span className="text-w-label-m whitespace-nowrap text-text-secondary-brown lg:text-w-head-m">
              {String(streak.year).slice(2)}년 {streak.month}월
            </span>
            <img src={icRight} alt="" className="size-4 lg:hidden" />
            <img src={icChevronRight} alt="" className="hidden size-6 lg:block" />
          </button>
          <p className="hidden text-w-body-l font-medium text-text-weak-brown lg:block">
            이번달 {nickname}님은...
          </p>
        </div>

        <div className="flex gap-2 lg:gap-3">
          <span className="w-0.5 shrink-0 rounded-full bg-icon-weak" />
          <dl className="flex flex-col gap-2">
            {stats.map(({ value, mobile, web }) => (
              <div
                key={web}
                className="flex items-center gap-0.5 whitespace-nowrap lg:items-end lg:gap-2"
              >
                <dt className="sr-only">{web}</dt>
                <dd className="text-m-label-l text-text-secondary-brown lg:text-w-head-m">
                  {value}
                </dd>
                <dd className="text-m-body-m font-medium text-text-weak-brown lg:text-w-body-l lg:font-medium">
                  <span className="lg:hidden">{mobile}</span>
                  <span className="hidden lg:inline">{web}</span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* 오른쪽: 요일 + 잔디 (아이패드 가로처럼 카드가 좁으면 칸 28px, 1280px부터 시안 36px) */}
      <div className="flex shrink-0 flex-col items-center gap-1 lg:gap-2">
        <div className="flex w-full justify-between px-[9px] text-m-caption text-text-weak-brown lg:text-w-caption">
          {WEEKDAYS.map((day) => (
            <span key={day}>{day}</span>
          ))}
        </div>
        <ol className="grid grid-cols-7 gap-1 xl:gap-2">
          {cells.map((date, index) =>
            date === null ? (
              <li key={`empty-${index}`} aria-hidden className="size-6 lg:size-7 xl:size-9" />
            ) : (
              <li
                key={date}
                aria-label={`${date}일`}
                className={`size-6 rounded-lg lg:size-7 xl:size-9 ${LEVEL_COLOR[streak.levels[date] ?? 0]}`}
              />
            ),
          )}
        </ol>
      </div>
    </section>
  )
}

export default ReadingStreakCard
