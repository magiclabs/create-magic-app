import Layout from "../components/layout";
import { ThemeProvider } from "@magiclabs/ui";
import "@magiclabs/ui/dist/cjs/index.css";

function MyApp({ Component, pageProps }) {
  return (
    <ThemeProvider root>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ThemeProvider>
  );
}

export default MyApp;
