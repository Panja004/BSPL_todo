import './globals.css';
import Navbar from './components/Navbar';

export const metadata = {
  title: 'Todo App',
  description: 'A simple todo application',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          {children}
        </div>
      </body>
    </html>
  );
} 