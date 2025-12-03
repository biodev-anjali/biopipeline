import Head from "next/head";
import "@/styles/globals.css";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Anjali Yadav</title>   
        <meta name="description" content="Sequence Analysis Platform" />
      </Head>

      <Component {...pageProps} />
    </>
  );
}
