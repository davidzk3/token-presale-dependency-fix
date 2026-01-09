import React, { Suspense } from "react";

const ENABLE_MORALIS = import.meta.env.VITE_ENABLE_MORALIS === "true";
const NetworksMoralis = React.lazy(() => import("./Networks.moralis.jsx"));

export default function Networks(props) {
  // Default: offline safe mode (no Moralis import, no hook calls)
  if (!ENABLE_MORALIS) return null;

  // Only when enabled do we load the Moralis-based component
  return (
    <Suspense fallback={null}>
      <NetworksMoralis {...props} />
    </Suspense>
  );
}
