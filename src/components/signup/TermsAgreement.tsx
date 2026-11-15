import icCheckCircleOff from '@/assets/icons/ic-check-circle-off.svg'
import icCheckCircleOn from '@/assets/icons/ic-check-circle-on.svg'
import icCheckOff from '@/assets/icons/ic-check-off.svg'
import icCheckOn from '@/assets/icons/ic-check-on.svg'
import icRight from '@/assets/icons/ic-right.svg'
import { TERMS, type TermId } from '@/components/signup/signupOptions'
import type { PolicyId } from '@/types/policy'

type TermsAgreementProps = {
  checked: TermId[]
  onChange: (checked: TermId[]) => void
  /** 약관 상세 열기 (페이지 이동 없이 회원가입 화면 위에 띄움) */
  onOpenPolicy: (policyId: PolicyId) => void
}

function TermsAgreement({ checked, onChange, onOpenPolicy }: TermsAgreementProps) {
  const isAllChecked = checked.length === TERMS.length

  const toggleAll = () => onChange(isAllChecked ? [] : TERMS.map((term) => term.id))
  const toggle = (id: TermId) =>
    onChange(checked.includes(id) ? checked.filter((item) => item !== id) : [...checked, id])

  return (
    <div className="flex flex-col gap-4">
      <button
        type="button"
        aria-pressed={isAllChecked}
        onClick={toggleAll}
        className={`flex h-14 items-center gap-2 rounded-2xl px-4 text-m-body-l font-medium text-text-secondary lg:text-w-body-l ${isAllChecked ? 'bg-green-100' : 'bg-surface-gray-light'}`}
      >
        <img src={isAllChecked ? icCheckCircleOn : icCheckCircleOff} alt="" className="size-4" />
        모두 동의합니다
      </button>

      <ul className="flex flex-col gap-1">
        {TERMS.map((term) => {
          const isChecked = checked.includes(term.id)
          return (
            <li key={term.id} className="flex items-center justify-between py-1 pl-4">
              <button
                type="button"
                aria-pressed={isChecked}
                onClick={() => toggle(term.id)}
                className="flex items-center gap-2 text-m-body-m text-text-secondary lg:text-w-body-m"
              >
                <img src={isChecked ? icCheckOn : icCheckOff} alt="" className="size-4" />
                {term.label}
              </button>
              {'policyId' in term ? (
                <button
                  type="button"
                  aria-label={`${term.label} 자세히 보기`}
                  onClick={() => onOpenPolicy(term.policyId)}
                >
                  <img src={icRight} alt="" className="size-4" />
                </button>
              ) : (
                <span className="size-4" aria-hidden />
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default TermsAgreement
