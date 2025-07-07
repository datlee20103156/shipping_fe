import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faMagnifyingGlass,
  faUser,
  faUsers,
  faBell,
  faEnvelope,
  faArrowAltCircleLeft,
  faMedal,
  faBars
} from '@fortawesome/free-solid-svg-icons';
import { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../context/AppContext';
import { ArrowBigLeftIcon, Bell, Package, Search, User } from 'lucide-react';
import api from '../../utils/api';

const AdminHeader = ({ onToggleSidebar }: { onToggleSidebar: () => void }) => {
  const { userInfo, saveUserInfo, saveIsLogin, setCurrentOrder } = useContext(AppContext);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const fetchOrders = async () => {
    try {
      const res = await api.get(`order/getByCondition?page=1&limit=1&query=${searchTerm}`);
      const data = res.data?.orders?.[0]; // Lấy đơn hàng đầu tiên
      if (!data) {
        alert("Không tìm thấy đơn hàng với mã này!");
        return;
      }
      setCurrentOrder(data); // Lưu đơn hàng vào context
      navigate("/orders/info"); // Chuyển trang
      setSearchTerm('');
    } catch (error) {
      console.error("Error fetching order info:", error);
      alert("Đã xảy ra lỗi khi tìm đơn hàng!");
    }
  };
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const logout = () => {
    saveUserInfo(null);
    saveIsLogin(false);
    localStorage.removeItem('token');

    // Điều hướng sau khi context đã được cập nhật
    setTimeout(() => {
      navigate("/login");
    }, 0);
  };

  return (
    // <header className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-white shadow">
    <header className="bg-white shadow-sm border-b border-gray-200 p-4">
      <div className="flex items-center justify-between">
        <div className="hidden md:flex items-center space-x-3 text-gray-500 text-xl">
          <FontAwesomeIcon icon={faMagnifyingGlass} />
          <input
            type="text"
            placeholder="Nhập mã đơn hàng của bạn..."
            className="outline-none text-sm w-64 placeholder-gray-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                fetchOrders();
              }
            }}
          />
        </div>
        <div className="md:hidden">
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            className="text-gray-500 text-xl cursor-pointer"
            onClick={() => setIsSearchOpen(true)}
          />
        </div>
        {isSearchOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-16"
            onClick={() => setIsSearchOpen(false)} // Bấm ngoài sẽ đóng
          >
            <div
              className="bg-white p-4 rounded-lg w-11/12 max-w-sm shadow-lg flex items-center space-x-2"
              onClick={(e) => e.stopPropagation()} // Ngừng sự kiện click khi bấm vào vùng popup
            >
              <FontAwesomeIcon icon={faMagnifyingGlass} className="text-gray-500" />
              <input
                type="text"
                placeholder="Search..."
                className="flex-1 outline-none text-sm placeholder-gray-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    fetchOrders();
                  }
                }}
              />
              <button
                onClick={() => setIsSearchOpen(false)}
                className="text-gray-500 text-sm"
              >
                Đóng
              </button>
            </div>
          </div>
        )}

        <div className="flex items-center space-x-4">
          <button className="relative p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg">
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">3</span>
          </button>
          <div className="flex items-center px-2">
            <div className="flex items-center space-x-6 text-lg cursor-pointer">
              {/* User actions */}
              {userInfo ? (
                <div className="relative" ref={dropdownRef}>
                  <button
                    className="flex items-center space-x-2 focus:outline-none"
                    onClick={() => setOpen(!open)}
                  >
                    <img
                      src="https://media.istockphoto.com/id/1393750072/vector/flat-white-icon-man-for-web-design-silhouette-flat-illustration-vector-illustration-stock.jpg?s=612x612&w=0&k=20&c=s9hO4SpyvrDIfELozPpiB_WtzQV9KhoMUP9R9gVohoU="
                      alt="Avatar"
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="font-semibold text-gray-700 hidden md:block">{userInfo?.fullname}</span>
                  </button>

                  {open && (
                    <div className="absolute right-0 mt-2 w-72 bg-white rounded-md shadow-lg z-50 overflow-hidden">
                      <div className="px-4 py-3 border-b">
                        <p className="text-sm font-medium">{userInfo?.fullname}</p>
                        <p className="text-sm text-gray-500">SĐT: {userInfo?.phone}</p>
                      </div>
                      <ul className="py-2 text-sm text-gray-700">
                        <li className="px-4 py-2 flex items-center hover:bg-gray-100 cursor-pointer" onClick={() => { navigate("/my-info"); setOpen(false) }}>
                          <span className="text-blue-600 mr-3"><User /></span> Thông tin cá nhân
                        </li>
                        <li className="px-4 py-2 flex items-center hover:bg-gray-100 cursor-pointer" onClick={() => { navigate("/dashboard/orders"); setOpen(false) }}>
                          <span className="text-blue-500 mr-3"><Package /></span> Quản lý đơn hàng
                        </li>
                      </ul>
                      <div className="border-t">
                        <li
                          className="px-4 py-2 flex items-center text-red-600 hover:bg-red-50 cursor-pointer text-sm"
                          onClick={() => {
                            setOpen(false);
                            logout();
                          }}
                        >
                          <span className="mr-3"> <ArrowBigLeftIcon /></span> Đăng Xuất
                        </li>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <button className="text-black-500" onClick={() => navigate("/login")}>
                  Đăng nhập
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
