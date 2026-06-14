import React from "react"
import { cn } from "@/lib/utils"

interface CheckboxProps {
  checked?: boolean
  onChange?: (checked: boolean) => void
  disabled?: boolean
  indeterminate?: boolean
  children?: React.ReactNode
}

const getBoxClasses = (checked: boolean, disabled: boolean, indeterminate: boolean) => {
  let cls =
    "relative border w-4 h-4 duration-200 rounded inline-flex items-center justify-center shrink-0"

  if (disabled) {
    cls += indeterminate
      ? " bg-zinc-800 border-zinc-700 stroke-zinc-600"
      : checked
      ? " bg-zinc-600 border-zinc-600 fill-zinc-600 stroke-zinc-300"
      : " bg-zinc-900 border-zinc-700 fill-zinc-900 stroke-zinc-900"
  } else {
    if (indeterminate) {
      cls += " bg-zinc-900 border-zinc-600 stroke-zinc-400 hover:border-zinc-400"
    } else if (checked) {
      cls += " bg-violet-600 border-violet-600 fill-violet-600 stroke-white"
    } else {
      cls +=
        " bg-zinc-900 border-zinc-700 fill-zinc-900 stroke-zinc-900 group-hover:border-zinc-500 group-hover:bg-zinc-800"
    }
  }

  return cls
}

export const Checkbox = ({
  checked = false,
  onChange,
  disabled = false,
  indeterminate = false,
  children,
}: CheckboxProps) => {
  return (
    <div
      className={cn(
        "flex items-center cursor-pointer text-[13px] font-sans group select-none",
        disabled ? "text-zinc-600 cursor-not-allowed" : "text-zinc-200"
      )}
      onClick={() => onChange && !disabled && !indeterminate && onChange(!checked)}
    >
      <input
        disabled={disabled}
        type="checkbox"
        checked={checked}
        readOnly
        className="absolute w-[1px] h-[1px] p-0 overflow-hidden whitespace-nowrap border-none opacity-0"
      />
      <span className={getBoxClasses(checked, disabled, indeterminate)}>
        <svg className="shrink-0" height="16" viewBox="0 0 20 20" width="16">
          {indeterminate ? (
            <line
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              x1="5"
              x2="15"
              y1="10"
              y2="10"
            />
          ) : (
            <path
              d="M14 7L8.5 12.5L6 10"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
            />
          )}
        </svg>
      </span>
      {children && <span className="ml-2 leading-snug">{children}</span>}
    </div>
  )
}
