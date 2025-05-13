"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FormInputProps {
  type: string;
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  defaultValue?: string;
  className?: string;
}

export default function FormInput({ type, name, label, placeholder, required = false, defaultValue, className }: FormInputProps) {
  return (
    <div className={className}>
      <Label htmlFor={name} className="mb-2 block">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <Input type={type} id={name} name={name} placeholder={placeholder} required={required} defaultValue={defaultValue} className="w-full" />
    </div>
  );
}
