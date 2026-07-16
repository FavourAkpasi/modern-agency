"use client"

import * as Sentry from "@sentry/nextjs"
import NextError from "next/error"
import { useEffect } from "react"

type GlobalErrorProps = {
  error: Error & { digest?: string }
}

const GlobalError = ({ error }: GlobalErrorProps) => {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <html>
      <body>
        <NextError statusCode={0} />
      </body>
    </html>
  )
}

export default GlobalError
