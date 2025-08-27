import "./globals.css"
import Header from "../components/layout/Header"
import Footer from "../components/layout/Footer"

export const metadata = {
  title: "seashell-owl-443814.hostingersite.com",
  description: "Custom Bike Builder - Make Your Bike Truly Yours"
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Header locale="en" />
        <main>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
