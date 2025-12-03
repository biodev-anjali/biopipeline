const profile = {
  name: process.env.NEXT_PUBLIC_PROFILE_NAME || "Dr. Nova Stellar",
  title: process.env.NEXT_PUBLIC_PROFILE_TITLE || "Lead Bioinformatics Engineer",
  bio:
    process.env.NEXT_PUBLIC_PROFILE_BIO ||
    "Explorer of genomic constellations, decoding signals that bridge biology and algorithms.",
  location: process.env.NEXT_PUBLIC_PROFILE_LOCATION || "Earth Orbit · Remote Lab",
  contact: process.env.NEXT_PUBLIC_PROFILE_CONTACT || "quantum.bio@example.com",
  links: [
    {
      label: "LinkedIn",
      href: process.env.NEXT_PUBLIC_PROFILE_LINKEDIN || "https://linkedin.com/in/example",
    },
    {
      label: "GitHub",
      href: process.env.NEXT_PUBLIC_PROFILE_GITHUB || "https://github.com/example",
    },
  ],
};

export default profile;

