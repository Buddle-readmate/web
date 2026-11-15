import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'

/**
 * 모달·오버레이를 페이지 이동 없이 현재 화면 위에 띄우기 (?{key}=값)
 * - 페이지가 바뀌지 않아서 열기 전 화면 상태(입력값, 단계 등)가 유지됨
 * - 주소에 기록이 남아서 휴대폰·브라우저 뒤로가기로 닫힘
 */
export function useOverlayParam(key: string) {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()

  const value = searchParams.get(key)

  const open = (nextValue: string) => {
    const next = new URLSearchParams(searchParams)
    next.set(key, nextValue)
    setSearchParams(next)
  }

  const close = () => {
    // ?key= 주소로 바로 들어와 이전 기록이 없으면 그 값만 지우기
    if (location.key === 'default') {
      const next = new URLSearchParams(searchParams)
      next.delete(key)
      setSearchParams(next, { replace: true })
      return
    }
    navigate(-1)
  }

  return { value, open, close }
}
