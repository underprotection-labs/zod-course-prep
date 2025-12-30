"use client";

import { env } from "./env";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function EnvPage() {
  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold">Client-Side Env Usage</h1>

      <Card>
        <CardHeader>
          <CardTitle>Example Usage</CardTitle>
        </CardHeader>
        <CardContent>
          <SomeProvider publishableKey={env.NEXT_PUBLIC_APP_URL}>
            <p className="text-sm">
              Provider configured with NEXT_PUBLIC_APP_URL
            </p>
          </SomeProvider>
        </CardContent>
      </Card>
    </div>
  );
}

const SomeProvider = ({
  publishableKey,
  children,
}: {
  publishableKey: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
      <Badge variant="outline" className="mb-2">
        Provider Configured
      </Badge>
      <p className="text-sm text-gray-600 mb-2">
        Publishable Key:{" "}
        <code className="bg-gray-100 px-1 rounded">{publishableKey}</code>
      </p>
      {children}
    </div>
  );
};
