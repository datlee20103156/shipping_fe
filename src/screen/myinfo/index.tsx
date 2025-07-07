
import React, { useContext, useState } from 'react';
import { User, Phone, Shield, CheckCircle, XCircle, Edit2, Save, X } from 'lucide-react';
import { AppContext } from '../../context/AppContext';
import api from '../../utils/api';

export default function MyInfoPage() {
    const [isEditing, setIsEditing] = useState(false);
    const { userInfo, saveUserInfo } = useContext(AppContext);

    const [editForm, setEditForm] = useState(userInfo);

    const handleEdit = () => {
        setIsEditing(true);
        setEditForm(userInfo);
    };

    const handleSave = async () => {
        try {
            const payload = {
                fullname: editForm.fullname,
            };

            // Gọi API và lưu kết quả trả về
            const response = await api.put(`users/updateMyInfo`, payload);

            // Nếu API trả về user mới sau khi cập nhật
            if (response.data?.data) {
                saveUserInfo(response.data.data); // Cập nhật lại context
            } else {
                // Nếu không trả về user, tự merge local để đảm bảo UI hiển thị đúng
                const updatedUser = { ...userInfo, ...payload };
                saveUserInfo(updatedUser);
            }

            alert("Cập nhật thông tin thành công!");
        } catch (error) {
            console.error("Lỗi cập nhật thông tin:", error);
        }
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditForm(userInfo);
        setIsEditing(false);
    };

    const handleInputChange = (field: string, value: string) => {
        setEditForm((prev: any) => ({
            ...prev,
            [field]: value
        }));
    };

    const getStatusColor = (status: boolean) => {
        switch (status) {
            case true: return 'bg-green-100 text-green-800';
            case false: return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status: boolean) => {
        switch (status) {
            case true: return 'Hoạt động';
            case false: return 'Tạm ngưng';
            default: return 'Không xác định';
        }
    };

    const getRoleText = (role: string) => {
        switch (role) {
            case 'ADMIN': return 'Quản trị viên';
            case 'OPERATOR': return 'Điều phối viên';
            case 'SHIPER': return 'Người giao hàng';
            case 'USER': return 'Người dùng';
            default: return 'Không xác định';
        }
    };

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'ADMIN': return 'bg-red-100 text-purple-800';
            case 'OPERATOR': return 'bg-purple-100 text-blue-800';
            case 'SHIPER': return 'bg-yellow-100 text-gray-800';
            case 'USER': return 'bg-blue-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };
    if (!userInfo) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-600">
                Đang tải thông tin người dùng...
            </div>
        );
    }
    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
                                <User className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Thông Tin Cá Nhân</h1>
                                <p className="text-gray-600">Quản lý thông tin tài khoản của bạn</p>
                            </div>
                        </div>
                        <div className="flex space-x-2">
                            {!isEditing ? (
                                <button
                                    onClick={handleEdit}
                                    className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                >
                                    <Edit2 className="w-4 h-4" />
                                    <span>Chỉnh sửa</span>
                                </button>
                            ) : (
                                <div className="flex space-x-2">
                                    <button
                                        onClick={handleSave}
                                        className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                                    >
                                        <Save className="w-4 h-4" />
                                        <span>Lưu</span>
                                    </button>
                                    <button
                                        onClick={handleCancel}
                                        className="flex items-center space-x-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                        <span>Hủy</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Personal Information */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Thông Tin Cơ Bản</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Họ và tên
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={editForm?.fullname}
                                            onChange={(e) => handleInputChange('fullname', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    ) : (
                                        <p className="text-gray-900 py-2">{userInfo.fullname}</p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Số điện thoại
                                    </label>
                                    <div className="flex items-center space-x-2 py-2">
                                        <Phone className="w-4 h-4 text-gray-500" />
                                        <span className="text-gray-900">{userInfo.phone}</span>
                                    </div>

                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Trạng thái
                                    </label>
                                    <div className="py-2">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(userInfo.isActive)}`}>
                                            {userInfo.isActive === true ? (
                                                <CheckCircle className="w-3 h-3 mr-1" />
                                            ) : (
                                                <XCircle className="w-3 h-3 mr-1" />
                                            )}
                                            {getStatusText(userInfo.isActive)}
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Phân quyền
                                    </label>
                                    <div className="py-2">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(userInfo.role[0])}`}>
                                            <Shield className="w-3 h-3 mr-1" />
                                            {getRoleText(userInfo.role[0])}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Statistics */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-lg shadow-sm p-6 h-full">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Thống Kê</h2>

                            <div className="space-y-4">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-blue-600">{userInfo.totalDeliveries}</div>
                                    <div className="text-sm text-gray-600">Chuyến hàng hoàn thành</div>
                                </div>

                                <div className="text-center">
                                    <div className="text-3xl font-bold text-green-600">{userInfo.rating}</div>
                                    <div className="text-sm text-gray-600">Đánh giá trung bình</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
