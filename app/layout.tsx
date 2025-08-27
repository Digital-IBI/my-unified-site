import "./globals.css"

export const metadata = {
  title: "Unified Programmatic Site",
  description: "Next.js on Netlify — CMS-as-data — Programmatic SEO"
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
