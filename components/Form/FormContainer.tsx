"use client";

import { useEffect, ReactElement, cloneElement } from "react";
import { useActionState } from "react";
import { toast } from "react-toastify";
import { SubmitButton } from "./Button";
import type { actionFunction } from "@/lib/types";
import type { ButtonHTMLAttributes } from "react";

interface FormState {
  message: string;
  statusMessage: "success" | "error" | string;
}

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

type FormContainerProps = {
  action: actionFunction;
  submitBtn?: boolean;
  children?: React.ReactNode;
  iconBtn?: ReactElement<IconButtonProps>;
};

export default function FormContainer({ action, submitBtn = false, children, iconBtn }: FormContainerProps) {
  const [state, formAction, isPending] = useActionState<FormState, FormData>(action, { message: "", statusMessage: "" });

  // tampilkan toast dan refresh kalau perlu
  useEffect(() => {
    if (!state.message) return;
    if (state.statusMessage === "success") {
      toast.success(state.message);
    } else if (state.statusMessage === "info") {
      toast.info(state.message);
    } else {
      toast.error(state.message);
    }
  }, [state.message, state.statusMessage]);

  // ambil disabled asli dari iconBtn (misal: slot sudah booked)
  const originalDisabled = Boolean(iconBtn?.props.disabled);
  // gabungkan dengan loading state
  const finalDisabled = originalDisabled || isPending;

  return (
    <form action={formAction} className="inline">
      {children}

      {submitBtn && <SubmitButton isPending={isPending} className="mt-5" />}

      {iconBtn &&
        cloneElement(iconBtn, {
          disabled: finalDisabled,
          "aria-busy": isPending,
          type: "submit",
        })}
    </form>
  );
}
