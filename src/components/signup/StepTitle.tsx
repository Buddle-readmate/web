type StepTitleProps = {
  title: string
  description?: string[]
}

function StepTitle({ title, description }: StepTitleProps) {
  return (
    <div className="flex flex-col gap-3">
      <h1 className="text-m-head-l text-text-default lg:text-w-head-m">{title}</h1>
      {description && (
        <p className="text-m-body-l text-text-secondary lg:text-w-body-l">
          {description.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </p>
      )}
    </div>
  )
}

export default StepTitle
