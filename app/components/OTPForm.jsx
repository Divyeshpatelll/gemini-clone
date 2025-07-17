"use client";

import React, { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import useAuthStore from "@/store/authStore";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
// Add icons from react-icons
import { FaPhoneAlt, FaLock, FaGlobe } from "react-icons/fa";

// Zod schema for phone input
const phoneSchema = z.object({
  phone: z
    .string()
    .min(4, "Phone number is too short")
    .max(15, "Phone number is too long")
    .regex(/^\d+$/, "Phone number must be digits only"),
});

const OTPForm = () => {
  const [step, setStep] = useState("phone");
  const [loading, setLoading] = useState(false);
  const [selectedCode, setSelectedCode] = useState("");
  const [countries, setCountries] = useState([]);
  const [loadingCountries, setLoadingCountries] = useState(true);
  const [sentOtp, setSentOtp] = useState("");
  const [isSelectFocused, setIsSelectFocused] = useState(false); // <-- add this
  const { login } = useAuthStore();
  const router = useRouter();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const otpRefs = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];

  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all?fields=name,idd,cca2")
      .then((res) => res.json())
      .then((data) => {
        const countryList = data
          .filter((c) => c.idd && c.idd.root)
          .map((c) => {
            const code =
              c.idd.suffixes && c.idd.suffixes.length
                ? c.idd.suffixes.map((suf) => c.idd.root + suf)
                : [c.idd.root];
            return code.map((cd) => ({
              name: c.name.common,
              code: cd,
              cca2: c.cca2,
            }));
          })
          .flat()
          .filter((c) => c.code && c.code.length <= 5);
        countryList.sort((a, b) => a.name.localeCompare(b.name));
        setCountries(countryList);
        setLoadingCountries(false);
        // Set default code (India if present, else first)
        const india = countryList.find((c) => c.name === "India");
        setSelectedCode(india ? india.code : countryList[0]?.code || "");
      })
      .catch(() => setLoadingCountries(false));
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    resolver: zodResolver(phoneSchema),
  });

  const onSubmitPhone = (data) => {
    setLoading(true);
    setTimeout(() => {
      const fakeOtp = "123456";
      setSentOtp(fakeOtp);
      setStep("otp");
      toast.success("OTP sent to your phone");
      setLoading(false);
    }, 2000);
  };

  const onSubmitOtp = (data) => {
    const enteredOtp = otp.join("");
    if (enteredOtp === sentOtp) {
      toast.success("Login successful");
      login(selectedCode + watch("phone"));
      router.push("/dashboard");
    } else {
      toast.error("Invalid OTP");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div
        className="otp-form max-w-md w-full p-8 rounded-3xl shadow-2xl backdrop-blur-md backdrop-saturate-150 transition-all duration-300"
        style={{ boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.18)" }}
      >
        <h2 className="text-3xl font-bold mb-6 text-center tracking-tight drop-shadow-sm">
          {step === "phone" ? "Sign In" : "Enter OTP"}
        </h2>

        {step === "phone" && (
          <form onSubmit={handleSubmit(onSubmitPhone)} className="space-y-6">
            <div>
              <label className="form-label block mb-2 font-medium text-gray-800">
                Phone Number
              </label>
              <div className="flex items-start gap-0">
                <div className="relative w-28 min-w-[64px]">
                  <div
                    className="h-12 flex items-center justify-center border border-gray-300 bg-white/80 text-gray-900 font-semibold rounded-l-xl cursor-pointer select-none"
                    onClick={() =>
                      document.getElementById("country-select").focus()
                    }
                    tabIndex={0}
                  >
                    {selectedCode}
                  </div>
                  <select
                    id="country-select"
                    className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                    value={selectedCode}
                    onChange={(e) => setSelectedCode(e.target.value)}
                    style={{
                      WebkitAppearance: "none",
                      MozAppearance: "none",
                      appearance: "none",
                    }}
                    disabled={loadingCountries}
                  >
                    {loadingCountries ? (
                      <option>Loading...</option>
                    ) : (
                      countries.map((c, i) => (
                        <option
                          key={c.cca2 + c.code}
                          value={c.code}
                          className="text-left text-gray-900"
                        >
                          {c.name} ({c.code})
                        </option>
                      ))
                    )}
                  </select>
                  <div
                    className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"
                    style={{ zIndex: 3 }}
                  >
                    ▼
                  </div>
                </div>
                <input
                  type="text"
                  className="h-12 w-full border-t border-b border-r border-gray-300 text-gray-900 rounded-r-xl focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all px-4 placeholder-gray-400 outline-none backdrop-blur-sm"
                  placeholder="Enter phone number"
                  {...register("phone")}
                  style={{ borderLeft: "none" }}
                />
              </div>
              <div className="min-h-[18px] mt-2 ms-1">
                {errors.phone && (
                  <p className="text-red-500 text-sm w-full">
                    {errors.phone.message || "Invalid phone number"}
                  </p>
                )}
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-blue-500/90 to-blue-700/90 hover:from-blue-600 hover:to-blue-800 text-white px-6 py-3 rounded-xl w-full font-semibold shadow-lg transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed backdrop-blur-sm"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    ></path>
                  </svg>
                  Sending OTP...
                </>
              ) : (
                <>Send OTP</>
              )}
            </button>
          </form>
        )}

        {step === "otp" && (
          <form onSubmit={handleSubmit(onSubmitOtp)} className="space-y-6">
            <div>
              <label className="block mb-2 font-medium text-gray-800 flex items-center gap-2">
                <FaLock className="text-yellow-500" /> Enter OTP{" "}
              </label>
              <div className="flex gap-3 justify-center">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={otpRefs[idx]}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    className="w-full h-15 text-center text-2xl border border-gray-300 rounded-xl bg-white/80 text-gray-900 focus:ring-2 focus:ring-green-400 focus:border-green-400 outline-none transition-all"
                    value={digit}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/, "");
                      if (!val) return;
                      const newOtp = [...otp];
                      newOtp[idx] = val;
                      setOtp(newOtp);
                      if (idx < otp.length - 1) {
                        otpRefs[idx + 1].current.focus();
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Backspace") {
                        if (otp[idx]) {
                          const newOtp = [...otp];
                          newOtp[idx] = "";
                          setOtp(newOtp);
                        } else if (idx > 0) {
                          otpRefs[idx - 1].current.focus();
                        }
                      }
                    }}
                  />
                ))}
              </div>
            </div>
            <button
              type="submit"
              className="bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white px-6 py-3 rounded-xl w-full font-semibold shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
            >
              Verify OTP
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default OTPForm;
