"use client";

import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface TextAreaInputProps {
  name: string;
  labelText: string;
  placeholder?: string;
  required?: boolean;
  defaultValue?: string;
  className?: string;
}

export default function TextAreaInput({ name, labelText, placeholder, required = false, defaultValue, className }: TextAreaInputProps) {
  return (
    <div className={`my-4 ${className}`}>
      <Label htmlFor={name} className="mb-2 block">
        {labelText} {required && <span className="text-red-500">*</span>}
      </Label>
      <Textarea id={name} name={name} placeholder={placeholder} required={required} defaultValue={defaultValue} className="w-full min-h-32" />
    </div>
  );
}
