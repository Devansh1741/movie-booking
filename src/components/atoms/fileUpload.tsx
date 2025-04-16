import * as React from 'react'
import { cn } from '@/lib/utils'
import { Trash2 } from 'lucide-react'

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  imageFile?: File | null
  setImageFile?: (file: File | null) => void
}

const FileUpload = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, setImageFile, ...props }, ref) => {
    return (
      <>
        <input
          ref={ref}
          id="image"
          type="file"
          className={cn(
            'block w-full border-slate-400 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
            className,
          )}
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) setImageFile?.(file)
          }}
          {...props}
        />
      </>
    )
  },
)
FileUpload.displayName = 'fileUpload'

export { FileUpload }
