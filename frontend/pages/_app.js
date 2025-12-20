import Head from "next/head";
import "@/styles/globals.css";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Genomic Sequence Analysis & Blockchain Ledger</title>
        <meta name="description" content="Full-stack web application for FASTA sequence analysis, quality control, and immutable blockchain ledger tracking. Upload or fetch genomic sequences, analyze with Biopython, and track provenance with SHA-256 hashing." />
        <meta name="keywords" content="bioinformatics, genomics, FASTA, sequence analysis, blockchain, DNA, Biopython, quality control" />
        <meta name="author" content="Sci-Fi Genomics Lab" />
        <meta property="og:title" content="Genomic Sequence Analysis & Blockchain Ledger" />
        <meta property="og:description" content="Analyze, visualize, and immortalize FASTA sequences with a web sci-fi genomics lab and blockchain ledger." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Genomic Sequence Analysis" />
        <meta name="twitter:description" content="Full-stack application for FASTA sequence analysis, QC metrics, and blockchain provenance tracking." />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
      </Head>

      <Component {...pageProps} />
    </>
  );
}
