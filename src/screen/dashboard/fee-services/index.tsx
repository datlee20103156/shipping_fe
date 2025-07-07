import React, { useEffect, useState } from 'react';
import { Edit2, Trash2, Plus, X, Save, Search, Filter, DollarSign, Edit } from 'lucide-react';
import { District, Fee, ProvinceData, Ward } from '../../../utils/type';
import api from '../../../utils/api';

export default function FeeServicesPage() {
    const [fees, setFees] = useState<Fee[]>([]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingFee, setEditingFee] = useState<Fee | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const [formData, setFormData] = useState<Fee>({
        _id: '',
        fromDistrict: '',
        toDistrict: '',
        baseFee: 0,
        extraPerKg: 0,
        isActive: true,
        createdAt: '',
        updatedAt: ''
    });
    const [districts, setDistricts] = useState<District[]>([]);
    const [wardsFrom, setWardsFrom] = useState<Ward[]>([]);
    const [wardsTo, setWardsTo] = useState<Ward[]>([]);
    const [selectedFromDistrict, setSelectedFromDistrict] = useState("");
    const [selectedToDistrict, setSelectedToDistrict] = useState("");
    const fetchFees = async () => {
        try {
            const response = await api.get(`fee/getFeeByCondition?page=1&limit=99999&isActive=true&query=${searchTerm}`);
            setFees(response.data.fees);

        } catch (error) {
            console.error("Error fetching user info:", error);
        }
    };
    useEffect(() => {
        fetchFees();
    }, []);

    useEffect(() => {
        // Cách 1: Nếu file JSON ở public folder
        fetch('/districts.json')
            .then((res) => res.json())
            .then((json: ProvinceData) => setDistricts(json.districts))
            .catch((err) => console.error('Lỗi tải JSON:', err));

    }, []);

    useEffect(() => {
        const district = districts.find((d) => d.code === Number(selectedFromDistrict));
        if (district) {
            setWardsFrom(district.wards || []);
        } else {
            setWardsFrom([]);
        }
    }, [selectedFromDistrict, districts]);

    useEffect(() => {
        const district = districts.find((d) => d.code === Number(selectedToDistrict));
        if (district) {
            setWardsTo(district.wards || []);
        } else {
            setWardsTo([]);
        }
    }, [selectedToDistrict, districts]);

    const resetForm = () => {
        setFormData({
            _id: '',
            fromDistrict: '',
            toDistrict: '',
            senderWard: '',
            receiverWard: '',
            baseFee: 0,
            extraPerKg: 0,
            isActive: true,
            createdAt: '',
            updatedAt: ''
        });
        setSelectedFromDistrict('');
        setSelectedToDistrict('');
    };

    const openModal = (fee: Fee | null = null) => {
        if (fee) {
            setEditingFee(fee);
            setFormData({
                _id: fee._id,
                fromDistrict: fee.fromDistrict,
                toDistrict: fee.toDistrict,
                baseFee: fee.baseFee,
                extraPerKg: fee.extraPerKg,
                isActive: fee.isActive,
                createdAt: fee.createdAt,
                updatedAt: fee.updatedAt
            });
            if (fee.fromDistrict) {
                const parts = fee.fromDistrict.split(",").map((p) => p.trim());
                const wardName = parts[0] || "";
                const districtName = parts[1] || "";

                const district = districts.find((d) => d.name === districtName);
                if (district) {
                    setSelectedFromDistrict(String(district.code)); // set dropdown huyện

                    // load wardsFrom trước khi tìm ward
                    setWardsFrom(district.wards || []);

                    const ward = district.wards?.find((w) => w.name === wardName);
                    if (ward) {
                        setFormData((prev) => ({
                            ...prev,
                            senderWard: String(ward.code),
                        }));
                    }
                }
            }

            if (fee.toDistrict) {
                const parts = fee.toDistrict.split(",").map((p) => p.trim());
                const wardName = parts[0] || "";
                const districtName = parts[1] || "";

                const district = districts.find((d) => d.name === districtName);
                if (district) {
                    setSelectedToDistrict(String(district.code)); // set dropdown huyện

                    setWardsTo(district.wards || []);

                    const ward = district.wards?.find((w) => w.name === wardName);
                    if (ward) {
                        setFormData((prev) => ({
                            ...prev,
                            receiverWard: String(ward.code),
                        }));
                    }
                }
            }
        } else {
            setEditingFee(null);
            resetForm();
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingFee(null);
        resetForm();
    };

    const handleInputChange = async (e: any) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();

        const feesData: Partial<Fee> = {
            fromDistrict: formData.fromDistrict,
            toDistrict: formData.toDistrict,
            baseFee: Number(formData.baseFee),
            extraPerKg: Number(formData.extraPerKg)
        };

        try {
            if (editingFee) {
                // Cập nhật khách hàng
                await api.put(`fee/updateFree?id=${editingFee._id}`, feesData);
                alert("Cập nhật phí dịch vụ thành công!");
            } else {
                // Tạo khách hàng mới
                await api.post("fee/createFree", feesData);
                alert("Tạo phí dịch vụ mới thành công!");
            }
            fetchFees();
            closeModal();
        } catch (error: any) {
            if (error.response?.status === 400 && error.response.data?.code === 11000) {
                alert("Số điện thoại đã được đăng ký. Vui lòng nhập số điện thoại khác!");
            }
            console.error("Error saving customer:", error);
        }

    };

    // const handleDelete = (id: number) => {
    //     if (window.confirm('Bạn có chắc chắn muốn xóa phí dịch vụ này?')) {
    //         setFees(prev => prev.filter(fee => fee.id !== id));
    //     }
    // };

    // const filteredFees = fees.filter(fee => {
    //     const matchesSearch = fee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //         fee.description.toLowerCase().includes(searchTerm.toLowerCase());
    //     const matchesStatus = statusFilter === 'all' || fee.status === statusFilter;
    //     return matchesSearch && matchesStatus;
    // });

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center space-x-3">
                            <DollarSign className="w-8 h-8 text-blue-600" />
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Quản lý phí dịch vụ</h1>
                                <p className="text-gray-600">Hệ thống vận chuyển nội thành</p>
                            </div>
                        </div>
                        <button onClick={() => openModal()} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                            <Plus size={20} />
                            Thêm phí dịch vụ
                        </button>
                    </div>
                </div>

                {/* Controls */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                        <div className="flex flex-1 gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm phí dịch vụ theo tên huyện ..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && fetchFees()}
                                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 w-full focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div className="relative w-48 flex-shrink-0">
                                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white w-full"
                                >
                                    <option value="all">Tất cả trạng thái</option>
                                    <option value="active">Đang hoạt động</option>
                                    <option value="inactive">Tạm dừng</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                                        Phí dịch vụ từ A {'<->'} B
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                                        Phí cơ bản
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                                        Cước phí/ 1 (Kg)
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                                        Trạng thái
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                                        Thao tác
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {fees.map((fee) => (
                                    <tr key={fee._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">{fee.fromDistrict} {'<->'} {fee.toDistrict}</div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                                            {(fee.baseFee).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                                            {fee.extraPerKg.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${fee.isActive === true
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                                }`}>
                                                {fee.isActive === true ? 'Hoạt động' : 'Tạm dừng'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex items-center gap-2 mx-auto justify-center">
                                                <button
                                                    onClick={() => openModal(fee)}
                                                    className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-50 transition-colors"
                                                    title="Chỉnh sửa"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    // onClick={() => handleDelete(fee.id)}
                                                    className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-50 transition-colors"
                                                    title="Xóa"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* {filteredFees.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-gray-500">Không tìm thấy phí dịch vụ nào</p>
                        </div>
                    )} */}
                </div>

                {/* Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl transform transition-all duration-300 animate-slideUp max-h-[calc(100vh-60px)] overflow-y-auto m-4">
                            <div>
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
                                                    {editingFee ? 'Chỉnh sửa phí dịch vụ' : 'Thêm phí dịch vụ mới'}
                                                </h2>
                                                <p className="text-blue-100 text-sm mt-2">
                                                    {editingFee ? 'Cập nhật thông tin' : 'Thêm mới phí dịch vụ'}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={closeModal}
                                            className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors duration-200"
                                        >
                                            <X size={18} />
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-4 p-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Từ huyện *
                                        </label>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <select
                                                value={selectedFromDistrict}
                                                onChange={(e) => {
                                                    const districtCode = e.target.value;
                                                    setSelectedFromDistrict(districtCode);

                                                    const districtName = districts.find((d) => d.code === Number(districtCode))?.name || "";
                                                    const wardName = wardsFrom.find((w) => w.code === Number(formData.senderWard))?.name || "";

                                                    const newAddress = [wardName, districtName].filter(Boolean).join(", ");

                                                    setFormData({
                                                        ...formData,
                                                        fromDistrict: newAddress, // CHỈ dùng fromDistrict duy nhất
                                                        senderWard: "", // vẫn lưu wardCode để tra cứu
                                                    });
                                                }}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                            >
                                                <option value="">-- Chọn huyện --</option>
                                                {districts.map((d) => (
                                                    <option key={d.code} value={d.code}>
                                                        {d.name}
                                                    </option>
                                                ))}
                                            </select>
                                            <select
                                                value={formData.senderWard || ""}
                                                onChange={(e) => {
                                                    const wardCode = e.target.value;
                                                    const wardName = wardsFrom.find((w) => w.code === Number(wardCode))?.name || "";
                                                    const districtName = districts.find((d) => d.code === Number(selectedFromDistrict))?.name || "";

                                                    const newAddress = [wardName, districtName].filter(Boolean).join(", ");
                                                    setFormData({
                                                        ...formData,
                                                        fromDistrict: newAddress, // Cũng gán lại fromDistrict ở đây
                                                        senderWard: wardCode,   // vẫn lưu wardCode để sau load danh sách
                                                    });
                                                }}
                                                disabled={!wardsFrom.length}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                            >
                                                <option value="">-- Chọn xã/phường --</option>
                                                {wardsFrom.map((w) => (
                                                    <option key={w.code} value={w.code}>
                                                        {w.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Đến huyện *
                                        </label>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <select
                                                value={selectedToDistrict}
                                                onChange={(e) => {
                                                    const districtCode = e.target.value;
                                                    setSelectedToDistrict(districtCode);

                                                    const districtName = districts.find((d) => d.code === Number(districtCode))?.name || "";
                                                    const wardName = wardsTo.find((w) => w.code === Number(formData.receiverWard))?.name || "";

                                                    const newAddress = [wardName, districtName].filter(Boolean).join(", ");

                                                    setFormData({
                                                        ...formData,
                                                        toDistrict: newAddress, // CHỈ dùng fromDistrict duy nhất
                                                        receiverWard: "",  // vẫn lưu wardCode để tra cứu
                                                    });
                                                }}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                            >
                                                <option value="">-- Chọn huyện --</option>
                                                {districts.map((d) => (
                                                    <option key={d.code} value={d.code}>
                                                        {d.name}
                                                    </option>
                                                ))}
                                            </select>
                                            <select
                                                value={formData.receiverWard || ""}
                                                onChange={(e) => {
                                                    const wardCode = e.target.value;
                                                    const wardName = wardsTo.find((w) => w.code === Number(wardCode))?.name || "";
                                                    const districtName = districts.find((d) => d.code === Number(selectedToDistrict))?.name || "";

                                                    const newAddress = [wardName, districtName].filter(Boolean).join(", ");
                                                    setFormData({
                                                        ...formData,
                                                        toDistrict: newAddress, // Cũng gán lại fromDistrict ở đây
                                                        receiverWard: wardCode,   // vẫn lưu wardCode để sau load danh sách
                                                    });
                                                }}
                                                disabled={!wardsTo.length}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                            >
                                                <option value="">-- Chọn xã/phường --</option>
                                                {wardsTo.map((w) => (
                                                    <option key={w.code} value={w.code}>
                                                        {w.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Phí cơ bản (VND) *
                                            </label>
                                            <input
                                                type="number"
                                                name="baseFee"
                                                value={formData.baseFee}
                                                onChange={handleInputChange}
                                                required
                                                min="0"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="0"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Cước phí/ 1 (Kg)
                                            </label>
                                            <input
                                                type="number"
                                                name="extraPerKg"
                                                value={formData.extraPerKg}
                                                onChange={handleInputChange}
                                                min="0"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="0"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex gap-3 pt-4">
                                        <button
                                            type="button"
                                            onClick={handleSubmit}
                                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                                        >
                                            <Save className="w-4 h-4" />
                                            {editingFee ? 'Cập nhật' : 'Thêm mới'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={closeModal}
                                            className="flex-1 bg-gray-400 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors"
                                        >
                                            Hủy
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div >
    );
};
