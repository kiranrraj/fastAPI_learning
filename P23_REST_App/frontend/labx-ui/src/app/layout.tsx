// src/app/layout.tsx

'use client'

import "../app/globals.css"
import { useState } from "react"
import Header from "./components/Header"
import Sidebar from "./components/Sidebar"
import Footer from "./components/Footer"
import MainContent from "./components/MainContent"
import { Tab } from "./types/tabTypes"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [openTabs, setOpenTabs] = useState<Tab[]>([])

  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen bg-gray-50 text-gray-900">
        <Header />
        <div className="flex flex-1">
          <Sidebar openTabs={openTabs} setOpenTabs={setOpenTabs} />
          <main className="w-4/5 p-4 overflow-auto">
            <MainContent openTabs={openTabs} setOpenTabs={setOpenTabs} />
          </main>
        </div>
        <Footer />
      </body>
    </html>
  )
}
