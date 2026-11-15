import { useLocation, useNavigate } from 'react-router-dom'
import PolicyView from '@/components/policy/PolicyView'
import { POLICIES } from '@/constants/policies'
import type { PolicyId } from '@/types/policy'

type PolicyPageProps = {
  policyId: PolicyId
}

/** /terms, /privacy 단독 페이지 (로그인 화면 링크·마이페이지·주소 직접 입력) */
function PolicyPage({ policyId }: PolicyPageProps) {
  const navigate = useNavigate()
  const location = useLocation()

  const close = () => {
    // 주소를 직접 입력해서 이전 기록이 없으면 홈으로
    if (location.key === 'default') navigate('/', { replace: true })
    else navigate(-1)
  }

  return (
    <div className="min-h-dvh bg-surface-page">
      <PolicyView document={POLICIES[policyId]} onClose={close} />
    </div>
  )
}

export default PolicyPage
