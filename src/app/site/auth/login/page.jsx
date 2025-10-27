"use client";

import React, { Suspense } from "react";
import LoginForm from "@/components/site/auth/LoginForm";

function LoginContent() {
  return <LoginForm />;
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Đang tải...</div>}>
      <LoginContent />
    </Suspense>
  );
}