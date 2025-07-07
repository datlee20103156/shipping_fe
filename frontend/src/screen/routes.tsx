import { Route, Routes } from 'react-router-dom';
import Dashboard from './dashboard';
import OrderManagementPage from './dashboard/orders';
import ShippingOrderPage from './dashboard/create-order';
import CustomersPage from './dashboard/customers';
import CatrgoriesPage from './dashboard/categories';
import FeeServicesPage from './dashboard/fee-services';
import OrderDetailsPage from './dashboard/orders/info';
import MyInfoPage from './myinfo';
import OrderLogPage from './orderLog';

export default function EntitesRoutes() {
    return (
        <div>
            <Routes>
                <Route path="my-info" element={<MyInfoPage />} />
                <Route path="dashboard/*" element={<Dashboard />} />
                <Route path="dashboard/orders" element={<OrderManagementPage />} />
                <Route path="dashboard/create-order" element={<ShippingOrderPage />} />
                <Route path="dashboard/customers" element={<CustomersPage />} />
                <Route path="dashboard/categories" element={<CatrgoriesPage />} />
                <Route path="dashboard/fee-services" element={<FeeServicesPage />} />
                <Route path={`orders/info`} element={<OrderDetailsPage />} />
                <Route path={`orders/history/:id`} element={<OrderLogPage />} />
            </Routes>
        </div>
    );
};
