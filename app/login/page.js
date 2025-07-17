"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/authStore";
import OTPForm from "@/components/OTPForm";

export default function LoginPage() {
  const { user } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.replace("/");
    }
  }, [user, router]);

  if (user) {
    return null;
  }

  return <OTPForm />;
}
