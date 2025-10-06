import './globals.css'

export const metadata = {
  title: 'Umami Analytics Dashboard',
  description: 'Web analytics dashboard',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-black">{children}</body>
    </html>
  )
}