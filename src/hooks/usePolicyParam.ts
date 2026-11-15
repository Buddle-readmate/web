import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { isPolicyId } from '@/constants/policies'
import type { PolicyId } from '@/types/policy'

/**
 * 약관·처리방침을 페이지 이동 없이 현재 화면 위에 띄우기 (?doc=terms | privacy)
 * - 페이지가 바뀌지 않아서 열기 전 화면 상태(온보딩 단계, 체크한 약관 등)가 유지됨
 * - 주소에 기록이 남아서 휴대폰·브라우저 뒤로가기로 닫힘
 */
export function usePolicyParam() {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()

  const param = searchParams.get('doc')
  const openedPolicy = isPolicyId(param) ? param : null

  const openPolicy = (policyId: PolicyId) => {
    const next = new URLSearchParams(searchParams)
    next.set('doc', policyId)
    setSearchParams(next)
  }

  const closePolicy = () => {
    // ?doc= 주소로 바로 들어와 이전 기록이 없으면 doc만 지우기
    if (location.key === 'default') {
      const next = new URLSearchParams(searchParams)
      next.delete('doc')
      setSearchParams(next, { replace: true })
      return
    }
    navigate(-1)
  }

  return { openedPolicy, openPolicy, closePolicy }
}
