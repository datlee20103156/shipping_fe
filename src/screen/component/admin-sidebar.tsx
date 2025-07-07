import { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Package,
  Users,
  Truck,
  Archive,
  DollarSign,
  Plus,
  Menu,
  X,
  BarChart3,
} from 'lucide-react';
import { AppContext } from '../../context/AppContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const AdminSidebar = ({ isOpen, onClose, sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const { userInfo } = useContext(AppContext);
  const navigate = useNavigate();
  const sidebarRef = useRef<HTMLDivElement>(null);

  // Đóng khi click bên ngoài
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Hàm điều hướng kèm đóng sidebar
  const handleNavigate = (path: string) => {
    navigate(path);
    onClose();
  };

  const [activeMenu, setActiveMenu] = useState('dashboard');

  const menuItems = [
    { id: 'dashboard', label: 'Tổng quan', icon: BarChart3, link: '/dashboard' },
    { id: 'orders', label: 'Quản lý đơn hàng', icon: Package, link: 'dashboard/orders' },
    { id: 'customers', label: 'Quản lý khách hàng', icon: Users, link: 'dashboard/customers' },
    { id: 'goods', label: 'Quản lý loại hàng hóa', icon: Archive, link: 'dashboard/categories' },
    { id: 'fees', label: 'Quản lý phí dịch vụ', icon: DollarSign, link: 'dashboard/fee-services' },
    { id: 'create-order', label: 'Tạo đơn hàng', icon: Plus, link: 'dashboard/create-order' }
  ];

  // Xác định danh sách menu dựa theo role
  const getVisibleMenuItems = () => {
    if (!userInfo) {
      // Chưa đăng nhập: chỉ hiển thị "Tạo đơn hàng"
      return menuItems.filter(item => item.id === 'create-order');
    }

    const roles = userInfo.role || [];

    if (roles.includes('ADMIN')) {
      return menuItems; // Hiện tất cả
    }
    if (roles.includes('SHIPER') || roles.includes('OPERATOR')) {
      return menuItems.filter(item => item.id === 'orders' || item.id === 'create-order'); // Chỉ quản lý đơn hàng
    }
    if (roles.includes('USER')) {
      return menuItems.filter(item => item.id === 'create-order'); // Chỉ tạo đơn hàng
    }
    return []; // Không có quyền hợp lệ
  };

  const visibleMenuItems = getVisibleMenuItems();

  return (
    <div
      ref={sidebarRef}
      className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-white shadow-lg transition-all duration-300 fixed h-full z-10`}
    >
      <div className="p-4 border-b border-gray-200 h-[69px]">
        <div className="flex items-center justify-between">
          {sidebarOpen && (
            <h1 className="text-xl font-bold text-gray-800 cursor-pointer" onClick={() => handleNavigate('/')}>DeliveryPro</h1>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <nav className="mt-6">
        {visibleMenuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => {
                if (item.link) {
                  if (item.id === 'create-order' && !userInfo) {
                    handleNavigate('/login'); // Chưa đăng nhập → chuyển về login
                  } else {
                    handleNavigate(item.link); // Đăng nhập rồi → chuyển bình thường
                  }
                }
                setActiveMenu(item.id);
              }}
              className={`w-full flex items-center px-4 py-3 text-left hover:bg-blue-50 transition-colors ${activeMenu === item.id
                ? 'bg-blue-50 border-r-2 border-blue-500 text-blue-600'
                : 'text-gray-600'
                }`}
            >
              <Icon size={20} className="flex-shrink-0" />
              {sidebarOpen && <span className="ml-3 font-medium">{item.label}</span>}
            </button>
          );
        })}
      </nav>
    </div>
  );
};


export default AdminSidebar;