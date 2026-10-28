"use client";

import { useActionState } from "react";
import { subscribe } from "@/app/(shop)/actions";

export function Newsletter() {
  const [state, action, pending] = useActionState(subscribe, null);
  return (
    <form action={action} className="mt-7">
      <div className="flex gap-4 sm:gap-7">
        <input
          type="email"
          name="email"
          required
          placeholder="Email"
          aria-label="Email"
          className="h-[42px] w-full min-w-0 rounded-full bg-white px-7 text-[15px] text-ink outline-none focus:ring-1 focus:ring-ink sm:max-w-[200px] lg:max-w-[205px]"
        />
        <button
          type="submit"
          disabled={pending}
          className="h-[42px] shrink-0 rounded-full border border-line bg-white px-7 text-[15px] text-ink transition-colors hover:border-ink disabled:opacity-60"
        >
          Register
        </button>
      </div>
      {state && (
        <p role="status" className={`mt-3 text-sm ${state.ok ? "text-sale" : "text-red-700"}`}>
          {state.message}
        </p>
      )}
    </form>
  );
}
