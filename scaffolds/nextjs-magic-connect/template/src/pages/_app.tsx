import "@/styles/globals.css"
import type { AppProps } from "next/app"
import MagicProvider from "@/context/magic-context"

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MagicProvider>
      <Component {...pageProps} />
    </MagicProvider>
  )
}
