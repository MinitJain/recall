export default function sitemap() {
  return [
    {
      url: "https://ritro.vercel.app",
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 1,
    },
    {
      url: "https://ritro.vercel.app/auth",
      lastModified: new Date(),
      changeFrequency: "yearly" as const,
      priority: 0.5,
    },
  ];
}
