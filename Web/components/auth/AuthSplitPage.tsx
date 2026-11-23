"use client";

/**
 * AuthSplitPage.tsx – Client wrapper để quản lý mode login ↔ register
 * trong layout split-card. Dùng cho /login và /register.
 *
 * URL-based routing vẫn được duy trì khi toggle mode,
 * hỗ trợ browser back/forward, và render animation trượt đôi đổi chỗ mượt mà.
 */

import React, { useState, useEffect } from "react";
import { AuthCard } from "@/components/auth/AuthCard";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { DevHint } from "@/components/auth/DevHint";
import type { AuthMode } from "@/types/auth";

interface AuthSplitPageProps {
  initialMode: AuthMode;
}

export function AuthSplitPage({ initialMode }: AuthSplitPageProps) {
  const [mode, setMode] = useState<AuthMode>(initialMode);

  // Đồng bộ với nút Back / Forward trên trình duyệt
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path.includes("/register")) {
        setMode("register");
      } else if (path.includes("/login")) {
        setMode("login");
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const handleModeChange = (next: AuthMode) => {
    if (next === mode) return;
    setMode(next);
    // Cập nhật URL không reload trang (shallow pushState để Back/Forward hoạt động)
    if (typeof window !== "undefined") {
      window.history.pushState(
        null,
        "",
        next === "login" ? "/login" : "/register"
      );
    }
  };

  return (
    <div className="w-full flex flex-col items-center gap-4">
      <AuthCard
        mode={mode}
        onModeChange={handleModeChange}
        loginForm={<LoginForm onSwitchMode={handleModeChange} />}
        registerForm={<RegisterForm onSwitchMode={handleModeChange} />}
      />
      <DevHint />
    </div>
  );
}
