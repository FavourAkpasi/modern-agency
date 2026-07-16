"use client"

import { useEffect, useState } from "react"

// Fakes a brief fetch so the app's loading skeletons stay exercised while the UI
// runs on static data. Restarts whenever `key` changes — e.g. the drawer opening
// or switching to a different project. Drop this once a real API is wired.
export const useSimulatedLoading = (
  key: string | number | boolean = true,
  delay = 1000
): boolean => {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional: restart the fake load whenever `key` changes
    setLoading(true)
    const timer = setTimeout(() => setLoading(false), delay)
    return () => clearTimeout(timer)
  }, [key, delay])

  return loading
}
