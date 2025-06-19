import Header from './Header'
import Sidebar from './Sidebar'
import Footer from './Footer'

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="w-4/5 bg-gray-50 dark:bg-gray-800 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  )
}

export default MainLayout