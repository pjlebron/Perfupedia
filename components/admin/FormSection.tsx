import { cn } from "@/lib/utils";

interface FormSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export default function FormSection({ title, description, children, className }: FormSectionProps) {
  return (
    <div className={cn("border border-gray-200 rounded-xl bg-white", className)}>
      <div className="px-5 py-4 border-b border-gray-100">
        <h3 className="font-medium text-gray-900">{title}</h3>
        {description && <p className="text-sm text-gray-500 mt-0.5">{description}</p>}
      </div>
      <div className="p-5 flex flex-col gap-4">{children}</div>
    </div>
  );
}
