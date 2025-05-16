"use client"

import type React from "react"
import { useState } from "react"

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const validateForm = () => {
    let valid = true
    const newErrors = {
      email: "",
      password: "",
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
      valid = false
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
      valid = false
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
      valid = false
    }

    setErrors(newErrors)
    return valid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      try {
        // Placeholder for API call
        console.log("Form submitted", formData)
        // Redirect to dashboard
      } catch (error) {
        console.error("Error submitting form:", error)
      }
    }
  }

  return (
    <div className="container mx-auto flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <a href="/" className="flex items-center gap-2 transition-transform hover:scale-105">
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              EventEase
            </span>
          </a>
          <nav className="hidden md:flex gap-6">
            <a
              href="/"
              className="text-sm font-medium text-gray-500 transition-all hover:text-purple-600 hover:underline underline-offset-4"
            >
              Home
            </a>
            <a
              href="/#events"
              className="text-sm font-medium text-gray-500 transition-all hover:text-purple-600 hover:underline underline-offset-4"
            >
              Events
            </a>
            <a
              href="/login"
              className="text-sm font-medium text-purple-600 transition-all hover:underline underline-offset-4"
              aria-current="page"
            >
              Login
            </a>
            <a
              href="/signup"
              className="text-sm font-medium text-gray-500 transition-all hover:text-purple-600 hover:underline underline-offset-4"
            >
              Sign Up
            </a>
          </nav>
          <div className="flex md:hidden">
            <button
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-500 hover:bg-purple-100 hover:text-purple-600 transition-colors"
              aria-label="Toggle menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6"
              >
                <line x1="4" x2="20" y1="12" y2="12" />
                <line x1="4" x2="20" y1="6" y2="6" />
                <line x1="4" x2="20" y1="18" y2="18" />
              </svg>
              <span className="sr-only">Toggle menu</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
            <p className="mt-2 text-sm text-gray-500">Sign in to your EventEase account</p>
          </div>
          <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                  className={`w-full px-4 py-2 border rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.email && (
                  <p className="text-xs text-red-500">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Password
                  </label>
                  <a
                    href="#"
                    className="text-xs text-purple-600 hover:text-purple-500 transition-colors"
                  >
                    Forgot password?
                  </a>
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={`w-full px-4 py-2 border rounded-md text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all ${
                    errors.password ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.password && (
                  <p className="text-xs text-red-500">{errors.password}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full px-4 py-2 text-white font-medium rounded-md bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 transition-all"
              >
                Login
              </button>
            </form>

            <div className="mt-6 text-center text-sm">
              <p>
                Don't have an account?{" "}
                <a
                  href="/signup"
                  className="font-medium text-purple-600 hover:text-purple-500 transition-colors"
                >
                  Sign Up
                </a>
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-gray-500 md:text-left">
            © 2025 EventEase. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a
              href="#"
              className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
            >
              Terms
            </a>
            <a
              href="#"
              className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
            >
              Privacy
            </a>
            <a
              href="#"
              className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
            >
              Contact
            </a>
          </div>
        </div>
      </footer>

      <style>{`
        input {
          font-size: 1rem;
        }
        input::placeholder {
          color: #a0aec0;
        }
        button:focus,
        a:focus {
          outline: 2px solid #9333ea;
          outline-offset: 2px;
        }
      `}</style>
    </div>
  )
}