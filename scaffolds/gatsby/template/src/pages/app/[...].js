import React from "react"
import { Router } from "@reach/router"
import Profile from "../../components/profile"
import Login from "../../components/login"
import PrivateRoute from "../../components/privateroute"

const App = () => {
  return (
    <Router basepath="/app">
      <PrivateRoute path="/profile" component={Profile} />
      <Login path="/login" />
    </Router>
  )
}

export default App