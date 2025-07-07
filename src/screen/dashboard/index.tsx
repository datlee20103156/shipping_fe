import React, { useState } from 'react';
import { 
  Package, 
  Users, 
  Truck, 
  Archive, 
  DollarSign, 
  Plus, 
  Bell,
  Search,
  Menu,
  X,
  BarChart3,
  Calendar,
  MapPin,
  Clock
} from 'lucide-react';
import AdminSidebar from '../component/admin-sidebar';


interface DashboardProps {
  sidebarOpen?: boolean;
  setSidebarOpen?: (open: boolean) => void;
}

export default function Dashboard({ sidebarOpen = true, setSidebarOpen }: DashboardProps) {
  const [activeMenu, setActiveMenu] = useState('dashboard');

  const stats = [
    { label: 'Tổng ĐH hôm nay', value: '245', change: '+12%', color: 'bg-blue-500' },
    { label: 'Đơn hàng đang giao', value: '89', change: '+5%', color: 'bg-yellow-500' },
    { label: 'Đơn hàng hoàn thành', value: '156', change: '+8%', color: 'bg-green-500' },
    { label: 'Doanh thu hôm nay', value: '15.2M VND', change: '+15%', color: 'bg-purple-500' }
  ];

  const recentOrders = [
    { id: '#DH001', customer: 'Nguyễn Văn A', status: 'Đang giao', time: '10:30', location: 'Quận 1' },
    { id: '#DH002', customer: 'Trần Thị B', status: 'Hoàn thành', time: '09:45', location: 'Quận 3' },
    { id: '#DH003', customer: 'Lê Văn C', status: 'Chờ lấy hàng', time: '11:15', location: 'Quận 7' },
    { id: '#DH004', customer: 'Phạm Thị D', status: 'Đang giao', time: '08:20', location: 'Quận 2' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Đang giao': return 'bg-yellow-100 text-yellow-800';
      case 'Hoàn thành': return 'bg-green-100 text-green-800';
      case 'Chờ lấy hàng': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">  
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden" >
        {/* Dashboard Content */}
        <main className="p-6">
          {activeMenu === 'dashboard' && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                        <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                        <p className="text-sm text-green-600 font-medium">{stat.change}</p>
                      </div>
                      <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                        <Package className="text-white" size={24} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Recent Orders & Quick Actions */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Orders */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm">
                  <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800">Đơn hàng gần đây</h3>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      {recentOrders.map((order, index) => (
                        <div key={index} className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors">
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                              <Package className="text-blue-600" size={20} />
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">{order.id}</p>
                              <p className="text-sm text-gray-600">{order.customer}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                              {order.status}
                            </span>
                            <div className="flex items-center mt-1 text-xs text-gray-500">
                              <Clock size={12} className="mr-1" />
                              {order.time}
                              <MapPin size={12} className="ml-2 mr-1" />
                              {order.location}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-xl shadow-sm">
                  <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800">Thao tác nhanh</h3>
                  </div>
                  <div className="p-6 space-y-4">
                    <button 
                      onClick={() => setActiveMenu('create-order')}
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                    >
                      <Plus size={20} />
                      <span>Tạo đơn hàng mới</span>
                    </button>
                    
                    <button className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2">
                      <Users size={20} />
                      <span>Thêm khách hàng</span>
                    </button>
                    
                    <button className="w-full bg-purple-500 hover:bg-purple-600 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2">
                      <Truck size={20} />
                      <span>Thêm shipper</span>
                    </button>
                    
                    <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2">
                      <BarChart3 size={20} />
                      <span>Xem báo cáo</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}      
        </main>
      </div>
    </div>
  );
}