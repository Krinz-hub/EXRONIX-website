"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import LoadingAnimation from "./LoadingAnimation";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <LoadingAnimation
        fullScreen
        text="AUTHENTICATING SESSION"
        subtext="EXRONIX STORE"
      />
    );
  }

  if (!user) return null;

  return <>{children}</>;
}