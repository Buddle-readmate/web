import type { ButtonHTMLAttributes } from 'react'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>

function Button({ className = '', type = 'button', ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={`flex h-14 w-full items-center justify-center rounded-2xl bg-action-green text-m-label-l text-text-contrast lg:text-w-label-l ${className}`}
      {...props}
    />
  )
}

export default Button
