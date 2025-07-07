import React, { useCallback, useEffect, useState } from 'react';
import { Eye, Edit2, Trash2, Plus, Search, X, Users, Edit } from 'lucide-react';
import dayjs from 'dayjs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import api from '../../../utils/api';
import { Customer } from '../../../utils/type';

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Record<number, Customer>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [editForm, setEditForm] = useState<Customer>({
    _id: '',
    fullname: '',
    phone: '',
    password: '',
    createdAt: '',
    updatedAt: '',
    role: ''
  });

  const handleClickShowPassword = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);
  const fetchCustomers = async () => {
    try {
      const response = await api.get(`users/getUserByQuery?page=1&limit=99999&query=${searchTerm}`);
      setCustomers(response.data.data);

    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };
  useEffect(() => {
    fetchCustomers();
  }, []);

  // Xem chi tiết khách hàng
  const handleViewDetails = (customer: any) => {
    setSelectedCustomer(customer);
    setShowDetailModal(true);
  };

  // Lưu thông tin chỉnh sửa
  const handleSaveEdit = async () => {
    let roleValue: string;

    if (!editingCustomer) {
      // Nếu là tạo mới: mặc định role = "USER"
      roleValue = "USER";
    } else {
      // Nếu đang cập nhật: lấy role từ form nhập vào
      roleValue = Array.isArray(editForm.role)
        ? editForm.role[0]
        : editForm.role;
    }

    const customerData: Partial<Customer> = {
      fullname: editForm.fullname,
      phone: editForm.phone,
      password: editForm.password,
      role: roleValue,
    };

    // Nếu là tạo mới, hoặc nếu số điện thoại đã thay đổi thì thêm phone vào payload
    if (!editingCustomer || editForm.phone !== editingCustomer.phone) {
      customerData.phone = editForm.phone;
    }

    try {
      if (editingCustomer) {
        // Cập nhật khách hàng
        await api.put(`users/updateRoleUser`, customerData);
        alert("Cập nhật khách hàng thành công!");
      } else {
        // Tạo khách hàng mới
        await api.post("users/createUser", customerData);
        alert("Tạo khách hàng mới thành công!");
      }
      fetchCustomers();
      setShowEditModal(false);
      setEditingCustomer(null);
    } catch (error: any) {
      if (error.response?.status === 400 && error.response.data?.code === 11000) {
        alert("Số điện thoại đã được đăng ký. Vui lòng nhập số điện thoại khác!");
      }
      console.error("Error saving customer:", error);
    }
  };

  // Xóa khách hàng
  // const handleDeleteCustomer = (customerId: any) => {
  //   if (window.confirm('Bạn có chắc chắn muốn xóa khách hàng này?')) {
  //     setCustomers(customers.filter(customer => customer.id !== customerId));
  //   }
  // };
  const openModal = (customer: Customer | null = null) => {
    if (customer) {
      setEditingCustomer(customer);
      setEditForm({
        _id: customer._id,
        fullname: customer.fullname,
        phone: customer.phone,
        password: customer.password,
        createdAt: customer.createdAt,
        updatedAt: customer.updatedAt,
        role: customer.role
      });
    } else {
      setEditingCustomer(null);
      setEditForm({
        _id: '',
        fullname: '',
        phone: '',
        password: '',
        createdAt: '',
        updatedAt: '',
        isActive: true
      });
    }
    setShowEditModal(true);
  };
  // Đóng modal
  const closeModals = () => {
    setShowDetailModal(false);
    setShowEditModal(false);
    setSelectedCustomer(null);
  };
  const roleMap: Record<string, string> = {
    USER: "Người dùng",
    ADMIN: "Quản trị viên",
    SHIPER: "Người giao hàng",
    OPERATOR: "Điều phối viên",
  };
  const roleBgClassMap: Record<string, string> = {
    USER: "bg-blue-100 text-blue-800",
    ADMIN: "bg-purple-200 text-purple-800",
    SHIPER: "bg-yellow-200 text-yellow-800",
    OPERATOR: "bg-pink-200 text-pink-800",
  };
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center space-x-3">
              <Users className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Quản lý khách hàng</h1>
                <p className="text-gray-600">Hệ thống vận chuyển nội thành</p>
              </div>
            </div>
            <button onClick={() => openModal()} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              <Plus size={20} />
              Thêm khách hàng
            </button>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên hoặc số điện thoại..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    fetchCustomers();
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* Customer Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tên khách hàng
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Liên hệ
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày tạo
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ngày cập nhật
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Phân quyền
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Object.values(customers).map((customer) => (
                  <tr key={customer._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-semibold text-sm">
                            {customer.fullname.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{customer.fullname}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      <div className="text-sm text-gray-900">{customer.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                      {dayjs(customer.createdAt).format('HH:mm DD/MM/YYYY')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                      {dayjs(customer.updatedAt).format('HH:mm DD/MM/YYYY')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${roleBgClassMap[customer.role ?? ""] || 'bg-gray-100 text-gray-800'}`}>
                        {roleMap[customer.role ?? ""] || customer.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${customer.isActive === true
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                        }`}>
                        {customer.isActive === true ? 'Hoạt động' : 'Không hoạt động'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => handleViewDetails(customer)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-50 transition-colors"
                          title="Xem chi tiết"
                        >
                          <Eye size={18} />
                        </button>
                        <button
                          onClick={() => openModal(customer)}
                          className="text-green-600 hover:text-green-900 p-1 rounded-full hover:bg-green-50 transition-colors"
                          title="Chỉnh sửa"
                        >
                          <Edit size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* {filteredCustomers.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg mb-2">Không tìm thấy khách hàng</div>
              <div className="text-gray-500">Thử tìm kiếm với từ khóa khác</div>
            </div>
          )} */}
        </div>

        {/* Detail Modal */}
        {showDetailModal && selectedCustomer && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
            <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl transform transition-all duration-300 animate-slideUp">
              {/* Header với gradient */}
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-t-2xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Chi tiết khách hàng</h3>
                      <p className="text-blue-100 text-sm">Thông tin chi tiết</p>
                    </div>
                  </div>
                  <button
                    onClick={closeModals}
                    className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors duration-200"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Tên khách hàng */}
                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-500 mb-1">Họ và tên</label>
                    <p className="text-lg font-semibold text-gray-900">{selectedCustomer.fullname}</p>
                  </div>
                </div>

                {/* Số điện thoại */}
                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-500 mb-1">Số điện thoại</label>
                    <p className="text-lg font-semibold text-gray-900">{selectedCustomer.phone}</p>
                  </div>
                </div>

                {/* Trạng thái */}
                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${selectedCustomer.isActive === true
                    ? 'bg-gradient-to-br from-green-400 to-green-600'
                    : 'bg-gradient-to-br from-red-400 to-red-600'
                    }`}>
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {selectedCustomer.isActive === true ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      )}
                    </svg>
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-500 mb-1">Phân quyền</label>
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${roleBgClassMap[selectedCustomer.role ?? ""] || 'bg-gray-100 text-gray-800'}`}>
                        {roleMap[selectedCustomer.role ?? ""] || selectedCustomer.role}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 bg-gray-50 rounded-b-2xl border-t border-gray-100">
                <div className="flex justify-end">
                  <button
                    onClick={closeModals}
                    className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Đóng
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {showEditModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
            <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl transform transition-all duration-300 animate-slideUp max-h-[calc(100vh-60px)] overflow-y-auto m-4">
              {/* Header với gradient */}
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-t-2xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">
                        {editingCustomer ? 'Chỉnh sửa khách hàng' : 'Thêm khách hàng mới'}
                      </h2>
                      <p className="text-blue-100 text-sm">
                        {editingCustomer ? 'Cập nhật thông tin' : 'Tạo tài khoản mới'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={closeModals}
                    className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors duration-200"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Form Content */}
              <div className="p-6">
                <form className="space-y-6">
                  {/* Tên khách hàng */}
                  <div className="group">
                    <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-3">
                      <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <span>Họ và tên *</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Nhập họ và tên"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                      value={editForm.fullname}
                      onChange={(e) => setEditForm({ ...editForm, fullname: e.target.value })}
                      disabled={!!editingCustomer}
                    />
                  </div>

                  {/* Số điện thoại */}
                  <div className="group">
                    <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-3">
                      <div className="w-6 h-6 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <span>Số điện thoại *</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Nhập số điện thoại"
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                      value={editForm.phone}
                      onChange={(e) => {
                        let value = e.target.value.replace(/\D/g, ''); // chỉ cho nhập số
                        if (value.length > 10) value = value.slice(0, 10); // giới hạn 10 số
                        setEditForm({ ...editForm, phone: value });
                      }}
                      disabled={!!editingCustomer}
                    />
                  </div>

                  {/* Mật khẩu */}
                  {!editingCustomer && (
                    <div className="group">
                      <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-3">
                        <div className="w-6 h-6 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                          </svg>
                        </div>
                        <span>Mật khẩu *</span>
                      </label>
                      <div className="relative">
                        <input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          name="password"
                          placeholder="Nhập mật khẩu"
                          className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                          required
                          value={editForm.password}
                          onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
                        />
                        <button
                          type="button"
                          onClick={handleClickShowPassword}
                          className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
                          aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                        >
                          <FontAwesomeIcon
                            icon={showPassword ? faEye : faEyeSlash}
                            className="w-5 h-5"
                          />
                        </button>
                      </div>
                    </div>
                  )}
                  {editingCustomer && (
                    <div className="group">
                      <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-3">
                        <div className="w-6 h-6 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {editForm.isActive ? (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            ) : (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            )}
                          </svg>
                        </div>
                        <span>Phân quyền</span>
                      </label>
                      <select
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
                        value={editForm.role}
                        onChange={(e) =>
                          setEditForm({ ...editForm, role: e.target.value })
                        }
                      >
                        <option value="USER">Người dùng</option>
                        <option value="ADMIN">Quản trị viên</option>
                        <option value="SHIPER">Người giao hàng</option>
                        <option value="OPERATOR">Điều phối viên</option>
                      </select>
                    </div>
                  )}
                </form>
              </div>

              {/* Footer với buttons */}
              <div className="px-6 py-4 bg-gray-50 rounded-b-2xl border-t border-gray-100">
                <div className="flex gap-3">
                  <button
                    onClick={closeModals}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition-all duration-200 font-medium"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-medium"
                  >
                    {editingCustomer ? 'Cập nhật' : 'Tạo mới'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

