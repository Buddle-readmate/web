import PolicyContent from '@/components/policy/PolicyContent'
import ResponsiveModal from '@/components/shared/ResponsiveModal'
import type { PolicyDocument } from '@/types/policy'

type PolicyViewProps = {
  document: PolicyDocument
  onClose: () => void
}

/** 약관·처리방침 화면 (모바일 전체 화면 / 웹 모달) */
function PolicyView({ document: policy, onClose }: PolicyViewProps) {
  return (
    <ResponsiveModal title={policy.title} onClose={onClose}>
      <PolicyContent document={policy} />
    </ResponsiveModal>
  )
}

export default PolicyView
