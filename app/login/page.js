"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useAuthStore from "@/store/authStore";
import OTPForm from "@/components/OTPForm";

const SITE_PASSWORD = process.env.NEXT_PUBLIC_SITE_PASSWORD;

export default function LoginPage() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [siteAccess, setSiteAccess] = useState(false);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      router.replace("/dashboard");
    }
  }, [user, router]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (sessionStorage.getItem("siteAccess") === "true") {
        setSiteAccess(true);
      }
    }
  }, []);

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (input === SITE_PASSWORD) {
      setSiteAccess(true);
      setError("");
      if (typeof window !== "undefined") {
        sessionStorage.setItem("siteAccess", "true");
      }
    } else {
      setError("Incorrect password");
    }
  };

  if (user) {
    return null;
  }

  if (!siteAccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <form
          onSubmit={handlePasswordSubmit}
          className="bg-white p-8 rounded-2xl shadow-xl flex flex-col gap-4 min-w-[320px]"
        >
          <h2 className="text-2xl font-bold text-black mb-2 text-center">
            Site Access
          </h2>
          <input
            type="password"
            placeholder="Enter site password"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="border text-black border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            autoFocus
          />
          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-all"
          >
            Enter
          </button>
        </form>
      </div>
    );
  }

  return <OTPForm />;
}
