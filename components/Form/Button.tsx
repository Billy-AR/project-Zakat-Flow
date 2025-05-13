"use client";

import { Button as ShadcnButton } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

type ButtonProps = React.ComponentProps<typeof ShadcnButton> & {
  isPending?: boolean;
};

export function Button({ children, isPending, disabled, ...props }: ButtonProps) {
  return (
    <ShadcnButton disabled={isPending || disabled} {...props}>
      {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </ShadcnButton>
  );
}

export function SubmitButton({ isPending, className, children = "Simpan" }: { isPending?: boolean; className?: string; children?: React.ReactNode }) {
  return (
    <Button type="submit" disabled={isPending} isPending={isPending} className={className}>
      {children}
    </Button>
  );
}
