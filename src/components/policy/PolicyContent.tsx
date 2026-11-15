import type { PolicyDocument } from '@/types/policy'

type PolicyContentProps = {
  document: PolicyDocument
}

/** 약관·처리방침 본문 (조항 제목 + 문단 + 번호 목록) */
function PolicyContent({ document }: PolicyContentProps) {
  return (
    <div className="flex flex-col gap-5">
      {document.sections.map((section) => (
        <section key={section.heading} className="flex flex-col gap-2">
          <h2 className="text-m-label-m text-text-default lg:text-w-label-m">{section.heading}</h2>
          <div className="text-m-body-m text-text-secondary lg:text-w-body-m">
            {section.paragraph && <p>{section.paragraph}</p>}
            {section.items && (
              // 번호 들여쓰기: 글자 크기의 1.5배 (모바일 21px / 웹 22.5px)
              <ol className="list-decimal pl-[1.5em]">
                {section.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ol>
            )}
          </div>
        </section>
      ))}
      {document.footer && (
        <p className="text-m-body-m text-text-secondary lg:text-w-body-m">{document.footer}</p>
      )}
    </div>
  )
}

export default PolicyContent
