import { Route, Routes, useNavigate } from 'react-router-dom';
import HomePage from './screen/home';
import LoginPage from './screen/login';
import EntitesRoutes from './screen/routes';
import { useState } from 'react';
import RegisterPage from './screen/register';

const loading = <div>loading ...</div>;

const AppRoutes = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const navigate = useNavigate();

    // useEffect(() => {
    //     const token = sessionStorage.getItem('jhi-authenticationToken');
    //     if (!token) {
    //         navigate('/login');
    //     }
    // }, [navigate]);

    return (
        <div className="view-routes">
            <Routes>
                <Route index element={<HomePage />} />
                <Route path="login" element={<LoginPage />} />
                <Route path="register" element={<RegisterPage />} />
                <Route path="*" element={<EntitesRoutes />} />
            </Routes>

            {/* <Route path="logout" element={<Logout />} /> */}
            {/* <Route path="admin/*" element={<Admin />} /> */}
        </div>
    );
};

export default AppRoutes;