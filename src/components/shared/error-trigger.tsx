"use client";

import { useState } from "react";

import { Bug } from "lucide-react";

export const ErrorTrigger = ({
  message = "An error occurred",
}: {
  message?: string;
}) => {
  const [error, setError] = useState(false);

  if (error) throw new Error(message);

  return (
    <button
      title="Trigger an error"
      className="max-w-fit rounded bg-red-950 p-1 text-sm font-semibold leading-none text-red-500 transition hover:bg-red-900"
      onClick={() => setError(true)}
    >
      <Bug size={16} />
    </button>
  );
};
