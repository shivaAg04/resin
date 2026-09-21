import { cn } from "@/lib/utils/format";

const inputClasses =
  "w-full rounded-xl border border-ink/15 bg-white px-4 py-2.5 text-sm text-ink placeholder:text-ink-soft/60 outline-none transition-colors focus:border-amber focus:ring-2 focus:ring-amber/20";

interface FieldWrapperProps {
  label: string;
  htmlFor: string;
  error?: string;
  optional?: boolean;
  children: React.ReactNode;
}

export function FieldWrapper({ label, htmlFor, error, optional, children }: FieldWrapperProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-medium text-ink">
        {label}
        {optional && <span className="ml-1 font-normal text-ink-soft">(optional)</span>}
      </label>
      {children}
      {error && (
        <p role="alert" className="text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(inputClasses, className)} {...props} />;
}

export function Textarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={cn(inputClasses, "resize-none", className)} {...props} />;
}

export function Select({ className, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={cn(inputClasses, "cursor-pointer", className)} {...props} />;
}
