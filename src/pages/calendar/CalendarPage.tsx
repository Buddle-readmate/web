import { useEffect, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import calendarChakjjaki from '@/assets/characters/calendar-chakjjaki-draft.png'
import HomeHeader from '@/components/home/HomeHeader'
import DayRecordPanel from '@/components/record/DayRecordPanel'
import MonthSummary from '@/components/record/MonthSummary'
import ReadingCalendar from '@/components/record/ReadingCalendar'
import RecordAddSheet from '@/components/record/RecordAddSheet'
import { useOverlayParam } from '@/hooks/useOverlayParam'
import { CALENDAR_RECORDS_MOCK, EXCHANGE_BOOKS_MOCK } from '@/mocks/calendar'
import { useReadingRecordStore } from '@/stores/readingRecordStore'
import type { NewReadingRecord } from '@/types/calendar'
import { getRecordPages, getTodayKey, parseDateKey, toDateKey } from '@/utils/calendar'

function CalendarPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const todayKey = getTodayKey()
  const today = parseDateKey(todayKey)

  // TODO: 독서 기록 API 연동 전까지 더미 데이터 (개발 중 /calendar?mock=empty 로 빈 상태 확인)
  const baseRecords =
    import.meta.env.DEV && searchParams.get('mock') === 'empty' ? [] : CALENDAR_RECORDS_MOCK
  const addedRecords = useReadingRecordStore((state) => state.addedRecords)
  const addRecord = useReadingRecordStore((state) => state.addRecord)
  const records = [...baseRecords, ...addedRecords]
  const [viewMonth, setViewMonth] = useState({ year: today.year, month: today.month })
  const [selectedKey, setSelectedKey] = useState(todayKey)
  // 기록 추가는 ?sheet=add-record 로 캘린더 위에 띄움 (뒤로가기로 닫힘)
  const sheet = useOverlayParam('sheet')
  const [isFutureToastVisible, setIsFutureToastVisible] = useState(false)
  const toastTimerRef = useRef<number | undefined>(undefined)

  const { year, month } = viewMonth
  const monthPrefix = toDateKey(year, month, 1).slice(0, 8)
  const monthRecords = records.filter((record) => record.date.startsWith(monthPrefix))
  const monthDays = new Set(monthRecords.map((record) => record.date)).size
  const monthPages = monthRecords.reduce((sum, r) => sum + getRecordPages(r), 0)
  const selectedRecords = records.filter((record) => record.date === selectedKey)

  // 달을 옮기면 이번 달은 오늘, 다른 달은 1일을 선택
  const moveMonth = (offset: number) => {
    const date = new Date(year, month - 1 + offset, 1)
    const next = { year: date.getFullYear(), month: date.getMonth() + 1 }
    setViewMonth(next)
    const isThisMonth = next.year === today.year && next.month === today.month
    setSelectedKey(isThisMonth ? todayKey : toDateKey(next.year, next.month, 1))
  }

  const goToday = () => {
    setViewMonth({ year: today.year, month: today.month })
    setSelectedKey(todayKey)
  }

  // 미래 날짜에 기록을 추가하려 하면 위에 잠깐 안내
  const showFutureToast = () => {
    setIsFutureToastVisible(true)
    window.clearTimeout(toastTimerRef.current)
    toastTimerRef.current = window.setTimeout(() => setIsFutureToastVisible(false), 2000)
  }

  useEffect(() => () => window.clearTimeout(toastTimerRef.current), [])

  const handleSave = (record: NewReadingRecord) => {
    // TODO: 기록 저장 API 연동
    addRecord(record)
    sheet.close()
  }

  return (
    <div>
      <div className="mx-auto max-w-[1440px]">
        {/* TODO: 알림 여부는 알림 API 연동 시 공통 상태로 */}
        <HomeHeader
          hasUnreadNotification={false}
          onOpenNotifications={() => navigate('/?panel=notifications')}
        />

        <main className="flex flex-col gap-6 px-6 pt-6 pb-6 lg:gap-8 lg:px-10 lg:pt-9 lg:pb-9 desktop:px-[100px]">
          <div className="flex flex-col gap-1">
            <h2 className="text-m-head-l text-text-default lg:text-w-head-l">독서 캘린더</h2>
            <p className="text-m-body-m font-medium text-text-secondary lg:text-w-body-l lg:font-medium">
              날짜를 누르면 그날의 독서 기록을 볼 수 있어요
            </p>
          </div>

          <MonthSummary month={month} days={monthDays} pages={monthPages} className="lg:hidden" />

          {/* 모바일: 달력 → 기록
              웹(아이패드 가로 포함): 기록 패널 · 달력 · 책짹이를 시안(1440px) 폭 339:684:193 비율로 나눠
              화면이 좁아져도 같은 구성으로 보이게 함 */}
          <div className="flex flex-col gap-6 lg:grid lg:grid-cols-[339fr_684fr_193fr] lg:gap-3">
            <ReadingCalendar
              year={year}
              month={month}
              records={monthRecords}
              todayKey={todayKey}
              selectedKey={selectedKey}
              onSelect={setSelectedKey}
              onPrevMonth={() => moveMonth(-1)}
              onNextMonth={() => moveMonth(1)}
              onToday={goToday}
              className="lg:min-w-0"
            />
            <DayRecordPanel
              dateKey={selectedKey}
              records={selectedRecords}
              isToday={selectedKey === todayKey}
              onAdd={() => {
                if (selectedKey > todayKey) showFutureToast()
                else sheet.open('add-record')
              }}
              className="lg:order-first lg:min-w-0"
            />
            {/* TODO: 책짹이 그래픽은 예비 디자인 (피그마 "독서 캘린더(예진ver)") → 최종 디자인 나오면 이미지 교체 */}
            <img
              src={calendarChakjjaki}
              alt=""
              width={193}
              height={350}
              className="hidden h-auto w-full self-end lg:block"
            />
          </div>
        </main>
      </div>

      {isFutureToastVisible && (
        <p
          role="status"
          className="fixed top-4 left-1/2 z-50 -translate-x-1/2 rounded-full bg-gray-900 px-4 py-2 text-m-caption whitespace-nowrap text-text-contrast shadow-tab lg:text-w-caption"
        >
          미래 날짜는 기록할 수 없어요
        </p>
      )}

      {sheet.value === 'add-record' && (
        <RecordAddSheet
          dateKey={selectedKey}
          books={EXCHANGE_BOOKS_MOCK}
          onSave={handleSave}
          onClose={sheet.close}
        />
      )}
    </div>
  )
}

export default CalendarPage
