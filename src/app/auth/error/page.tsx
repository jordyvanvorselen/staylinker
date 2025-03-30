"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function AuthError() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  let errorMessage = "An unknown error occurred during authentication.";
  
  if (error === "AccessDenied") {
    errorMessage = "You do not have permission to sign in.";
  } else if (error === "Configuration") {
    errorMessage = "There is a problem with the server configuration.";
  } else if (error === "Verification") {
    errorMessage = "The verification link has expired or has already been used.";
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h1 className="mb-6 text-2xl font-bold text-center text-red-600">Authentication Error</h1>
        <div className="p-4 mb-6 text-sm text-red-700 bg-red-100 rounded-lg">
          {errorMessage}
        </div>
        <div className="flex justify-center">
          <Link 
            href="/auth/signin"
            className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
