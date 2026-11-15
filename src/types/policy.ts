export type PolicySection = {
  heading: string
  /** 목록 위에 오는 문단 */
  paragraph?: string
  /** 번호 목록 (1. 2. 3.) */
  items?: string[]
}

export type PolicyDocument = {
  title: string
  sections: PolicySection[]
  /** 맨 아래 시행일 등 */
  footer?: string
}

export type PolicyId = 'terms' | 'privacy'
