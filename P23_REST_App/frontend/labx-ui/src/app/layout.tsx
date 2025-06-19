
import "../app/globals.css";
import Header  from "../app/components/Header";
import Sidebar  from "../app/components/Sidebar";
import Footer  from "../app/components/Footer";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen bg-gray-50 text-gray-900">
        <Header />
        <div className="flex flex-1">
          <Sidebar />
          <main className="w-4/5 p-4 overflow-auto">{children}</main>
        </div>
        <Footer />
      </body>
    </html>
  );
}
