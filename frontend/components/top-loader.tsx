"use client";

import NextTopLoader from "nextjs-toploader";

export default function TopLoader() {
  return (
    <NextTopLoader
      color="var(--color-primary)"
      showSpinner={false}
      height={3}
    />
  );
}
