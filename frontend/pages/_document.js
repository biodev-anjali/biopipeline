import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="alternate icon" type="image/png" href="/favicon.png" />
        <meta name="theme-color" content="#0f172a" />
      </Head>
      <body className="bg-slate-950 text-slate-100">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

