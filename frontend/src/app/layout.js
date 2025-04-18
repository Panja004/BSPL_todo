import './globals.css'
import { Inter } from 'next/font/google'
import Navbar from './components/Navbar'
import AppFooter from './components/AppFooter'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Todo App',
  description: 'A simple todo application',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <AppFooter />
        </div>
      </body>
    </html>
  )
}
