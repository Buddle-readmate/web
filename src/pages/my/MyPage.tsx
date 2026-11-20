import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import HomeHeader from '@/components/home/HomeHeader'
import CharacterAvatar from '@/components/my/CharacterAvatar'
import MobileStats from '@/components/my/MobileStats'
import { getMyStats } from '@/components/my/myStats'
import ProfileEditSheet from '@/components/my/ProfileEditSheet'
import SettingsList from '@/components/my/SettingsList'
import WebStatsCard from '@/components/my/WebStatsCard'
import YearSelectButton from '@/components/my/YearSelectButton'
import YearSelectSheet from '@/components/my/YearSelectSheet'
import { useOverlayParam } from '@/hooks/useOverlayParam'
import { MY_PAGE_MOCK, MY_PAGE_MOCK_EMPTY } from '@/mocks/my'

function MyPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  // TODO: 마이페이지 API 연동 전까지 더미 데이터 (개발 중 /my?mock=empty 로 빈 상태 확인)
  const [data, setData] = useState(() =>
    import.meta.env.DEV && searchParams.get('mock') === 'empty' ? MY_PAGE_MOCK_EMPTY : MY_PAGE_MOCK,
  )
  // TODO: 연도별 통계 API 연동 (지금은 연도별 더미 데이터)
  const [year, setYear] = useState(data.years[0].year)
  // 프로필 편집·연도 선택은 ?sheet= 로 띄움 (뒤로가기로 닫힘)
  const sheet = useOverlayParam('sheet')
  const yearData = data.byYear[year]
  const stats = getMyStats(yearData)
  const thisYearData = data.byYear[data.years[0].year]

  const openProfile = () => sheet.open('profile')
  const openYear = () => sheet.open('year')
  // TODO: 첫 기록 시작 동선 확정되면 맞추기 (지금은 교환독서 만들기로)
  const startReading = () => navigate('/rooms/new')

  return (
    <div>
      <div className="mx-auto max-w-[1440px]">
        {/* TODO: 알림 여부는 알림 API 연동 시 공통 상태로 */}
        <HomeHeader
          hasUnreadNotification={false}
          onOpenNotifications={() => navigate('/?panel=notifications')}
        />

        {/* 모바일 */}
        <main className="flex flex-col gap-[18px] px-6 pt-3 pb-6 lg:hidden">
          <section className="flex flex-col items-center gap-1.5 pt-2">
            <CharacterAvatar className="size-24 bg-gray-200" />
            <h2 className="text-m-head-m text-text-default">{data.nickname}</h2>
            <button
              type="button"
              onClick={openProfile}
              className="rounded-full border-[1.5px] border-border-strong bg-surface-white px-3.5 py-2 text-m-label-s text-text-default"
            >
              프로필 편집
            </button>
          </section>

          <div className="flex items-center justify-between">
            <h3 className="text-m-head-m text-text-default">{year}년 독서 통계</h3>
            <YearSelectButton year={year} onClick={openYear} />
          </div>

          <MobileStats data={yearData} stats={stats} onStart={startReading} />

          <SettingsList
            yearlyGoal={data.yearlyGoal}
            onGoalClick={openProfile}
            className="rounded-3xl bg-surface-gray-light px-5 py-1"
          />
        </main>

        {/* 웹 */}
        <main className="hidden flex-col gap-8 px-10 pt-9 pb-9 lg:flex desktop:px-[100px]">
          <div className="flex flex-col gap-1">
            <h2 className="text-w-head-l text-text-default">마이페이지</h2>
            <p className="text-[16px] leading-[22px] tracking-[-0.3px] text-text-secondary">
              프로필 · 독서 통계 · 설정
            </p>
          </div>

          <div className="flex items-stretch gap-6">
            <aside className="flex w-[264px] shrink-0 flex-col gap-6 rounded-2xl bg-surface-gray-light px-5 py-8">
              <div className="flex flex-1 flex-col items-center justify-center gap-5">
                <CharacterAvatar className="size-[140px] bg-gray-200" />
                <p className="text-w-label-m text-text-default">{data.nickname}</p>
                <button
                  type="button"
                  onClick={openProfile}
                  className="rounded-2xl border-[1.5px] border-border-strong bg-surface-white px-5 py-3 text-w-label-s text-text-default"
                >
                  프로필 편집
                </button>
              </div>
              <SettingsList yearlyGoal={data.yearlyGoal} onGoalClick={openProfile} />
            </aside>

            <WebStatsCard
              data={yearData}
              stats={stats}
              year={year}
              onYearClick={openYear}
              onStart={startReading}
              className="flex-1"
            />
          </div>
        </main>
      </div>

      {sheet.value === 'profile' && (
        <ProfileEditSheet
          nickname={data.nickname}
          yearlyGoal={data.yearlyGoal}
          finishedThisYear={thisYearData.stats.finished}
          onSave={(profile) => {
            // TODO: 프로필 저장 API 연동
            setData((prev) => ({ ...prev, ...profile }))
            sheet.close()
          }}
          onClose={sheet.close}
        />
      )}
      {sheet.value === 'year' && (
        <YearSelectSheet
          years={data.years}
          selected={year}
          onSelect={(next) => {
            setYear(next)
            sheet.close()
          }}
          onClose={sheet.close}
        />
      )}
    </div>
  )
}

export default MyPage
