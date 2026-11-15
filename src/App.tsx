import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import CalendarPage from '@/pages/calendar/CalendarPage'
import HomePage from '@/pages/home/HomePage'
import MyPage from '@/pages/my/MyPage'
import OnboardingPage from '@/pages/onboarding/OnboardingPage'
import RoomCreatePage from '@/pages/rooms/RoomCreatePage'
import RoomDetailPage from '@/pages/rooms/RoomDetailPage'
import RoomJoinPage from '@/pages/rooms/RoomJoinPage'
import RoomListPage from '@/pages/rooms/RoomListPage'
import StoryDetailPage from '@/pages/rooms/StoryDetailPage'
import ShelfPage from '@/pages/shelf/ShelfPage'
import SignupPage from '@/pages/signup/SignupPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/shelf" element={<ShelfPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/rooms" element={<RoomListPage />} />
        <Route path="/rooms/new" element={<RoomCreatePage />} />
        <Route path="/rooms/join" element={<RoomJoinPage />} />
        <Route path="/rooms/:roomId" element={<RoomDetailPage />} />
        <Route path="/rooms/:roomId/stories/:storyId" element={<StoryDetailPage />} />
        <Route path="/my" element={<MyPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
