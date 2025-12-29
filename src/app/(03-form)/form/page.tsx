"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, type Resolver } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";

// ============================================
// ZOD SCHEMA WITH MULTIPLE VALIDATION TYPES
// ============================================

const userFormSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters"),
  email: z.email("Please enter a valid email address"),
  age: z
    .number("Age must be a valid number")
    .int("Age must be a whole number")
    .positive("Age must be positive")
    .min(13, "You must be at least 13 years old")
    .max(120, "Age must be realistic"),
  ageCoerce: z.coerce
    .number("Age must be a valid number")
    .int("Age must be a whole number")
    .positive("Age must be positive")
    .min(13, "You must be at least 13 years old")
    .max(120, "Age must be realistic"),
  bio: z
    .string()
    .max(200, "Bio must be at most 200 characters")
    .optional()
    .or(z.literal("")),
});

type UserFormData = z.infer<typeof userFormSchema>;

export default function FormPage() {
  const resolver = zodResolver(userFormSchema) as Resolver<UserFormData>;

  const form = useForm<UserFormData>({
    resolver,
    defaultValues: {
      name: "",
      email: "",
      age: 0,
      ageCoerce: 0,
      bio: "",
    },
    mode: "onBlur",
  });

  function onSubmit(data: UserFormData) {
    // Basit log; backend yoksa en azından konsolda görelim
    console.log("Form submit:", data);

    toast("Form submitted successfully!", {
      description: (
        <pre className="bg-code text-code-foreground mt-2 w-full max-w-[340px] overflow-x-auto rounded-md p-4">
          <code>{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
      position: "bottom-right",
      classNames: {
        content: "flex flex-col gap-2",
      },
      style: {
        "--border-radius": "calc(var(--radius) + 4px)",
      } as React.CSSProperties,
    });
  }

  return (
    <div className="min-h-screen bg-muted/10">
      <div className="container mx-auto max-w-2xl space-y-6 py-12 px-4">
        {/* Form Card */}
        <Card className="w-full border-2 border-primary/30 shadow-2xl shadow-primary/20 bg-white/95 dark:bg-slate-950/80 backdrop-blur rounded-xl">
          <CardHeader>
            <CardTitle>Zod + React Hook Form</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              id="user-registration-form"
              onSubmit={form.handleSubmit(onSubmit)}>
              <FieldGroup>
                {/* Name Field */}
                <Controller
                  name="name"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="user-form-name">
                        Name <span className="text-red-500">*</span>
                      </FieldLabel>
                      <Input
                        {...field}
                        id="user-form-name"
                        aria-invalid={fieldState.invalid}
                        placeholder="John Doe"
                        autoComplete="name"
                      />
                      <FieldDescription>
                        Your full name (2-50 characters)
                      </FieldDescription>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                {/* Email Field */}
                <Controller
                  name="email"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="user-form-email">
                        Email <span className="text-red-500">*</span>
                      </FieldLabel>
                      <Input
                        {...field}
                        id="user-form-email"
                        type="email"
                        aria-invalid={fieldState.invalid}
                        placeholder="john@example.com"
                        autoComplete="email"
                      />
                      <FieldDescription>
                        We&apos;ll never share your email
                      </FieldDescription>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                {/* Age Field */}
                <Controller
                  name="age"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="user-form-age">
                        Age <span className="text-red-500">*</span>
                      </FieldLabel>
                      <Input
                        {...field}
                        id="user-form-age"
                        type="number"
                        aria-invalid={fieldState.invalid}
                        placeholder="25"
                        onChange={e => {
                          const value = e.target.value;
                          field.onChange(
                            value === "" ? undefined : Number(value)
                          );
                        }}
                        value={field.value ?? ""}
                      />
                      <FieldDescription>
                        Must be between 13 and 120
                      </FieldDescription>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                {/* Age Field (Coerce) */}
                <Controller
                  name="ageCoerce"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="user-form-age-coerce">
                        Age (coerce) <span className="text-red-500">*</span>
                      </FieldLabel>
                      <Input
                        {...field}
                        id="user-form-age-coerce"
                        type="text"
                        aria-invalid={fieldState.invalid}
                        placeholder="25"
                        onChange={e => field.onChange(e.target.value)}
                        value={field.value ?? ""}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />

                {/* Bio Field (Optional) */}
                <Controller
                  name="bio"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="user-form-bio">
                        Bio{" "}
                        <span className="text-muted-foreground text-xs">
                          (optional)
                        </span>
                      </FieldLabel>
                      <InputGroup>
                        <InputGroupTextarea
                          {...field}
                          id="user-form-bio"
                          placeholder="Tell us a bit about yourself..."
                          rows={4}
                          className="min-h-24 resize-none"
                          aria-invalid={fieldState.invalid}
                        />
                        <InputGroupAddon align="block-end">
                          <InputGroupText className="tabular-nums">
                            {field.value?.length || 0}/200 characters
                          </InputGroupText>
                        </InputGroupAddon>
                      </InputGroup>
                      <FieldDescription>
                        A short description about yourself
                      </FieldDescription>
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </FieldGroup>
            </form>
          </CardContent>
          <CardFooter>
            <Field orientation="horizontal">
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}>
                Reset
              </Button>
              <Button type="submit" form="user-registration-form">
                Submit
              </Button>
            </Field>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
