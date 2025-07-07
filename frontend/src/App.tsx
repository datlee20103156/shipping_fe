import './index.css';
import { BrowserRouter, useLocation } from 'react-router-dom';
import AppRoutes from './routes';
import AdminHeader from './screen/component/admin-header';
import AdminSidebar from './screen/component/admin-sidebar';
import Footer from './screen/component/footer';
import { useState, useEffect } from 'react';
import { AppProvider } from './context/AppContext';

const baseHref = document.querySelector('base')?.getAttribute('href')?.replace(/\/$/, '') || '';

const AppLayout = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  const isRegisterPage = location.pathname === '/register';
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  useEffect(() => {
    const appViewContainer = document.getElementById('app-view-container');
    if (appViewContainer) {
      appViewContainer.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }, [location.pathname]);

  const onToggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  return (
    <div className="app-container">
      <div className="flex h-screen">
        {!isLoginPage && !isRegisterPage && (
          <AdminSidebar
            isOpen={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            sidebarOpen={isSidebarOpen}
            setSidebarOpen={setIsSidebarOpen}
          />
        )}

        {/* Main content area với margin-left động */}
        <div
          className={`flex-1 flex flex-col transition-all duration-300 ${!isLoginPage && !isRegisterPage
              ? (isSidebarOpen ? 'ml-64' : 'ml-16')
              : ''
            }`}
        >
          {!isLoginPage && !isRegisterPage && (
            <AdminHeader onToggleSidebar={onToggleSidebar} />
          )}

          <div id="app-view-container" className="flex-1 overflow-auto">
            <AppRoutes />
            {!isLoginPage && <Footer />}
          </div>
        </div>
      </div>
    </div>
  );
};

export const App = () => {
  return (
    <AppProvider>
      <BrowserRouter basename={baseHref}>
        <AppLayout />
      </BrowserRouter>
    </AppProvider>
  );
};

export default App;