import { PRIVACY_POLICY } from '@/constants/privacy'
import { TERMS_OF_SERVICE } from '@/constants/terms'
import type { PolicyDocument, PolicyId } from '@/types/policy'

export const POLICIES: Record<PolicyId, PolicyDocument> = {
  terms: TERMS_OF_SERVICE,
  privacy: PRIVACY_POLICY,
}

export const isPolicyId = (value: string | null): value is PolicyId =>
  value !== null && value in POLICIES
