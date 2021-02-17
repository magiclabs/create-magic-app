import '../style.css';
import Head from 'next/head';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Magic Hasura</title>
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
