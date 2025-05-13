"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface Item {
  valueItem: string;
  labelItem: string;
}

interface FormSelectProps {
  name: string;
  label: string;
  placeholder?: string;
  selectLabel: string;
  items: Item[];
  required?: boolean;
  defaultValue?: string;
  className?: string;
}

export default function FormSelect({ name, label, placeholder, selectLabel, items, required = false, defaultValue, className }: FormSelectProps) {
  return (
    <div className={className}>
      <Label htmlFor={name} className="mb-2 block">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <Select name={name} defaultValue={defaultValue}>
        <SelectTrigger id={name} className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {items.map((item) => (
            <SelectItem key={item.valueItem} value={item.valueItem}>
              {item.labelItem}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
