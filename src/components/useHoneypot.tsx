"use client";

import { useRef, useState } from "react";

/**
 * Lightweight bot trap for public forms: a hidden field bots tend to fill, plus
 * a time-trap (humans take >1.5s). `human()` returns false for likely bots so the
 * caller can silently skip the submit. No captcha, no friction for real users.
 */
export function useHoneypot() {
  const mountedAt = useRef(Date.now());
  const [value, setValue] = useState("");

  const field = (
    <div aria-hidden="true" style={{ position: "absolute", left: "-9999px", top: "-9999px", height: 0, overflow: "hidden" }}>
      <label>
        Company (leave blank)
        <input
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </label>
    </div>
  );

  const human = () => value === "" && Date.now() - mountedAt.current > 1500;

  return { field, human };
}
