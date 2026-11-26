import { Navigate } from 'react-router-dom'

/** 코드로 참가하기는 교환독서 목록 위 창으로 띄움 */
function RoomJoinPage() {
  return <Navigate to="/rooms?modal=join" replace />
}

export default RoomJoinPage
