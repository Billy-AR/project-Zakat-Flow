"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FormNumberProps {
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  defaultValue?: number;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
}

export default function FormNumber({ name, label, placeholder, required = false, defaultValue, min, max, step = 1, className }: FormNumberProps) {
  return (
    <div className={className}>
      <Label htmlFor={name} className="mb-2 block">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <Input type="number" id={name} name={name} placeholder={placeholder} required={required} defaultValue={defaultValue?.toString()} min={min} max={max} step={step} className="w-full" />
    </div>
  );
}
