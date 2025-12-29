"use client";

import { useState } from "react";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const UserSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.email({ message: "Invalid email address" }),
  age: z.number().positive({ message: "Age must be positive" }),
});

type User = z.infer<typeof UserSchema>;

export default function ParseVsSafeParsePage() {
  const [selectedScenario, setSelectedScenario] = useState<
    "valid" | "invalid_email" | "missing_name"
  >("valid");

  const scenarios = {
    valid: {
      name: "John",
      email: "john@example.com",
      age: 25,
    },
    invalid_email: {
      name: "Jane",
      email: "invalid-email",
      age: 30,
    },
    missing_name: {
      // name eksik (min 2 karakter)
      name: "a",
      email: "bob@test.com",
      age: 40,
    },
  };

  const currentData = scenarios[selectedScenario];

  let parseResult:
    | { success: true; data: User }
    | {
        success: false;
        error: string;
        isZodError?: boolean;
      };

  try {
    const data = UserSchema.parse(currentData);
    parseResult = { success: true, data };
  } catch (error) {
    if (error instanceof z.ZodError) {
      parseResult = {
        success: false,
        error: JSON.stringify(error.flatten().fieldErrors, null, 2),
        isZodError: true,
      };
    } else if (error instanceof Error) {
      parseResult = { success: false, error: error.message };
    } else {
      parseResult = { success: false, error: "Unknown error" };
    }
  }

  const safeParseResult = UserSchema.safeParse(currentData);

  return (
    <div className="container mx-auto py-10 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">parse() vs safeParse()</h1>
        <p className="text-muted-foreground">
          Select a scenario below to see how each method handles the data.
        </p>
      </div>

      {/* Scenario Selection */}
      <div className="flex justify-center gap-4">
        <Button
          variant={selectedScenario === "valid" ? "default" : "outline"}
          onClick={() => setSelectedScenario("valid")}>
          Valid Data
        </Button>
        <Button
          variant={
            selectedScenario === "invalid_email" ? "destructive" : "outline"
          }
          onClick={() => setSelectedScenario("invalid_email")}>
          Invalid Email
        </Button>
        <Button
          variant={
            selectedScenario === "missing_name" ? "destructive" : "outline"
          }
          onClick={() => setSelectedScenario("missing_name")}>
          Short Name
        </Button>
      </div>

      {/* Test Data Display */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Current Input Data (passed to validation)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-slate-950 text-slate-50 p-4 rounded-lg text-sm font-mono">
            {JSON.stringify(currentData, null, 2)}
          </pre>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* parse() Column */}
        <Card
          className={
            parseResult.success ? "border-green-200" : "border-red-200"
          }>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>parse()</span>
              {!parseResult.success && (
                <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded font-normal">
                  Throws Error
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-xs text-muted-foreground">
              <p>
                Directly returns data or <strong>throws</strong> an exception.
              </p>
              <pre className="mt-2 bg-muted p-2 rounded">
                {`try {
  UserSchema.parse(data);
} catch (e) {
  // crashes if not caught
}`}
              </pre>
            </div>

            {parseResult.success ? (
              <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 p-3 rounded">
                <p className="text-green-700 dark:text-green-300 font-semibold mb-2">
                  ✓ Success
                </p>
                <pre className="text-xs overflow-auto">
                  {JSON.stringify(parseResult.data, null, 2)}
                </pre>
              </div>
            ) : (
              <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 p-3 rounded">
                <p className="text-red-700 dark:text-red-300 font-semibold mb-2">
                  ✕ Exception Caught
                </p>
                <pre className="text-xs font-mono text-red-600 dark:text-red-400 whitespace-pre-wrap">
                  {parseResult.error}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>

        {/* safeParse() Column */}
        <Card
          className={
            safeParseResult.success ? "border-green-200" : "border-red-200"
          }>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>safeParse()</span>
              {!safeParseResult.success && (
                <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded font-normal">
                  Returns Object
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-xs text-muted-foreground">
              <p>
                Returns a result object with <code>success</code> boolean.
              </p>
              <pre className="mt-2 bg-muted p-2 rounded">
                {`const res = UserSchema.safeParse(data);
if (!res.success) {
  // res.error.issues
}`}
              </pre>
            </div>

            {safeParseResult.success ? (
              <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 p-3 rounded">
                <p className="text-green-700 dark:text-green-300 font-semibold mb-2">
                  ✓ Success
                </p>
                <pre className="text-xs overflow-auto">
                  {JSON.stringify(safeParseResult.data, null, 2)}
                </pre>
              </div>
            ) : (
              <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 p-3 rounded">
                <p className="text-red-700 dark:text-red-300 font-semibold mb-2">
                  ✕ Validation Failed
                </p>
                <div className="space-y-2">
                  {safeParseResult.error.issues.map((issue, idx) => (
                    <div
                      key={idx}
                      className="text-xs border-l-2 border-red-400 pl-2">
                      <p className="font-semibold text-foreground">
                        {issue.path.join(".") || "root"}:
                      </p>
                      <p className="text-red-600 dark:text-red-400">
                        {issue.message}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
