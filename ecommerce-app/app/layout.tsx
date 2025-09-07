import Header from '@/components/Header'
import type { Metadata } from 'next'
import { Frank_Ruhl_Libre } from 'next/font/google'
import './globals.css'
const frank_Ruhl_Libre = Frank_Ruhl_Libre({ subsets: ['latin'],weight:["300","400","500","600","700","800","900"] })

export const metadata: Metadata = {
  title: 'Dashing Fashion Store',
  description: 'A fashion store app built with next.js',
  openGraph:{
    images:'https://i.ibb.co/KykV7Kj/Untitled-design.png'
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
      <link
  rel="stylesheet"
  type="text/css"
  charSet="UTF-8"
  href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
/>
<link
  rel="stylesheet"
  type="text/css"
  href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"
/>
      </head>
      <body  className={frank_Ruhl_Libre.className}>
         
          <Header/>
        {children}
      </body>
    </html>
  )
}
