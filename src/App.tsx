import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import MainLayout from '@/components/layout/MainLayout'
import CalendarPage from '@/pages/calendar/CalendarPage'
import HomePage from '@/pages/home/HomePage'
import MyPage from '@/pages/my/MyPage'
import OnboardingPage from '@/pages/onboarding/OnboardingPage'
import PolicyPage from '@/pages/policy/PolicyPage'
import RoomCreatePage from '@/pages/rooms/RoomCreatePage'
import RoomDetailPage from '@/pages/rooms/RoomDetailPage'
import RoomJoinPage from '@/pages/rooms/RoomJoinPage'
import RoomListPage from '@/pages/rooms/RoomListPage'
import StoryDetailPage from '@/pages/rooms/StoryDetailPage'
import SearchPage from '@/pages/search/SearchPage'
import ShelfPage from '@/pages/shelf/ShelfPage'
import SignupPage from '@/pages/signup/SignupPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/terms" element={<PolicyPage policyId="terms" />} />
        <Route path="/privacy" element={<PolicyPage policyId="privacy" />} />
        <Route path="/search" element={<SearchPage />} />
        {/* 하단 탭바가 있는 메인 탭 화면 */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/shelf" element={<ShelfPage />} />
          <Route path="/rooms" element={<RoomListPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/my" element={<MyPage />} />
        </Route>
        <Route path="/rooms/new" element={<RoomCreatePage />} />
        <Route path="/rooms/join" element={<RoomJoinPage />} />
        <Route path="/rooms/:roomId" element={<RoomDetailPage />} />
        <Route path="/rooms/:roomId/stories/:storyId" element={<StoryDetailPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
