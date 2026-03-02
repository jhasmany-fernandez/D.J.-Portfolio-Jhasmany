import { FC, InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  id?: string
}

const Input: FC<InputProps> = ({ type = 'text', id, label, ...props }) => {
  return (
    <div className="mb-4 flex w-full flex-col gap-2">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-secondary-content mb-1">
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        {...props}
        className="block w-full px-3 py-2 bg-primary border border-border rounded-md text-primary-content placeholder-neutral focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
      />
    </div>
  )
}

export default Input
