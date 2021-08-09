import React, {useState, useEffect} from "react"
import { Link } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"

import Layout from "../components/layout"
import Seo from "../components/seo"

import { magic } from "../lib/magic";

const IndexPage = () => { 
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // On mount, we check if a user is logged in.
    // If so, we'll retrieve the authenticated user's profile.
    magic.user.isLoggedIn().then(setIsLoggedIn);
  }, []);

  return (
    <Layout>
      <Seo title="Home" />
      <h1>Hi people</h1>
      <p>Welcome to your new Gatsby site with passwordless authentication powered by <a href="https://magic.link" target="_blank" rel="noopener noreferrer">Magic</a>.</p>

      <p>
        {isLoggedIn ? <Link to="/app/profile">Profile</Link> : <Link to="/app/login">Login</Link>}
      </p>

      <StaticImage
        src="../images/gatsby-magic.png"
        width={500}
        quality={95}
        formats={["AUTO", "WEBP", "AVIF"]}
        alt="Gatsby site with passwordless authentication powered by Magic."
        style={{ marginBottom: `1.45rem` }}
      />
      
    </Layout>
  )
}

export default IndexPage
