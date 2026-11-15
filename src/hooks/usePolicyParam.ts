import { isPolicyId } from '@/constants/policies'
import { useOverlayParam } from '@/hooks/useOverlayParam'
import type { PolicyId } from '@/types/policy'

/** 약관·처리방침을 현재 화면 위에 띄우기 (?doc=terms | privacy) */
export function usePolicyParam() {
  const { value, open, close } = useOverlayParam('doc')

  return {
    openedPolicy: isPolicyId(value) ? value : null,
    openPolicy: (policyId: PolicyId) => open(policyId),
    closePolicy: close,
  }
}
