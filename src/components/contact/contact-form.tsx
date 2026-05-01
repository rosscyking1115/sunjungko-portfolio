"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Turnstile } from "@marsidev/react-turnstile";
import { toast } from "sonner";
import { Send } from "lucide-react";
import { contactSchema, type ContactInput } from "@/lib/contact-schema";
import { submitContact } from "@/app/contact/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const TURNSTILE_DEV_KEY = "1x00000000000000000000AA";

export function ContactForm({ turnstileSiteKey }: { turnstileSiteKey: string }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setError,
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    mode: "onBlur",
  });

  const [turnstileToken, setTurnstileToken] = React.useState<string | null>(null);

  // Use Cloudflare's public dev key when no real key is configured. Avoids a
  // confusing red-X widget in dev.
  const siteKey = turnstileSiteKey || TURNSTILE_DEV_KEY;

  async function onSubmit(values: ContactInput) {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("email", values.email);
    formData.append("message", values.message);
    if (turnstileToken) formData.append("cf-turnstile-response", turnstileToken);

    const result = await submitContact(formData);

    if (result.ok) {
      toast.success("Message sent. SunJung will reply soon.");
      reset();
      return;
    }

    if (result.fieldErrors) {
      for (const [field, message] of Object.entries(result.fieldErrors)) {
        setError(field as keyof ContactInput, { message });
      }
    }
    toast.error(result.error);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      {/* Honeypot — keep visually hidden but reachable to bots */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          width: 1,
          height: 1,
          padding: 0,
          margin: -1,
          overflow: "hidden",
          clip: "rect(0,0,0,0)",
          whiteSpace: "nowrap",
          border: 0,
        }}
      >
        <label>
          Website
          <input type="text" tabIndex={-1} autoComplete="off" name="website" />
        </label>
      </div>

      <Field label="Name" htmlFor="name" error={errors.name?.message} required>
        <Input
          id="name"
          autoComplete="name"
          aria-invalid={!!errors.name}
          {...register("name")}
        />
      </Field>

      <Field label="Email" htmlFor="email" error={errors.email?.message} required>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          aria-invalid={!!errors.email}
          {...register("email")}
        />
      </Field>

      <Field label="Message" htmlFor="message" error={errors.message?.message} required>
        <Textarea
          id="message"
          rows={6}
          aria-invalid={!!errors.message}
          {...register("message")}
        />
      </Field>

      <div className="pt-2">
        <Turnstile
          siteKey={siteKey}
          onSuccess={(token) => setTurnstileToken(token)}
          onExpire={() => setTurnstileToken(null)}
          onError={() => setTurnstileToken(null)}
          options={{ theme: "light", size: "flexible" }}
        />
      </div>

      <Button type="submit" disabled={isSubmitting} size="lg">
        {isSubmitting ? "Sending…" : "Send message"}
        {!isSubmitting && <Send className="h-4 w-4" aria-hidden />}
      </Button>
    </form>
  );
}

interface FieldProps {
  label: string;
  htmlFor: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}

function Field({ label, htmlFor, error, required, children }: FieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={htmlFor}>
        {label}
        {required && (
          <span className="text-muted-foreground ml-1" aria-hidden>
            *
          </span>
        )}
      </Label>
      {children}
      {error && (
        <p
          className={cn("text-destructive mt-1.5 text-xs")}
          role="alert"
          aria-live="polite"
          style={{ color: "oklch(0.5 0.18 25)" }}
        >
          {error}
        </p>
      )}
    </div>
  );
}
