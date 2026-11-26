import { Navigate } from 'react-router-dom'

/** 방 만들기는 교환독서 목록 위 창으로 띄움 (모바일 전체 화면 / 웹 모달) */
function RoomCreatePage() {
  return <Navigate to="/rooms?modal=create" replace />
}

export default RoomCreatePage
