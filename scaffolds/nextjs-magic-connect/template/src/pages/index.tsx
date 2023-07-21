import React, { useState, useEffect } from "react"
import Login from "../components/login"
import Home from "../components/home"

export default function App() {
  const [account, setAccount] = useState<string | null>(null)

  useEffect(() => {
    const user = localStorage.getItem("user")
    setAccount(user)
  }, [])

  return !account ? (
    <Login setAccount={setAccount} />
  ) : (
    <Home setAccount={setAccount} />
  )
}
