
import React, { useState } from 'react';
import { Edit2, Trash2, Plus, Search, X, Save, Archive, Edit } from 'lucide-react';

interface Category {
    id: number;
    code: string;
    name: string;
    description: string;
    basePrice: string;
    maxWeight: string;
    characteristic: string;
    status: string;
}
export default function CatrgoriesPage() {
    const [categories, setCategories] = useState<Category[]>([
        {
            id: 1,
            code: 'LH001',
            name: 'Thực phẩm tươi sống',
            description: 'Thịt, cá, rau củ quả tươi',
            basePrice: '25000',
            maxWeight: '50',
            characteristic: 'Cần bảo quản lạnh',
            status: 'active'
        },
        {
            id: 2,
            code: 'LH002',
            name: 'Đồ điện tử',
            description: 'Điện thoại, laptop, thiết bị điện tử',
            basePrice: '35000',
            maxWeight: '20',
            characteristic: 'Dễ vỡ',
            status: 'active'
        },
        {
            id: 3,
            code: 'LH003',
            name: 'Quần áo',
            description: 'Thời trang, phụ kiện',
            basePrice: '20000',
            maxWeight: '10',
            characteristic: '',
            status: 'active'
        },
        {
            id: 4,
            code: 'LH004',
            name: 'Đồ gia dụng',
            description: 'Chén bát, đồ dùng nhà bếp',
            basePrice: '30000',
            maxWeight: '30',
            characteristic: 'Dễ vỡ',
            status: 'inactive'
        }
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState<Category>({
        id: 0,
        code: '',
        name: '',
        description: '',
        basePrice: '',
        maxWeight: '',
        characteristic: '',
        status: ''
    });

    const filteredCategories = categories.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const openModal = (category: Category | null = null) => {
        if (category) {
            setEditingCategory(category);
            setFormData({
                id: category.id,
                code: category.code,
                name: category.name,
                description: category.description,
                basePrice: category.basePrice,
                maxWeight: category.maxWeight,
                characteristic: category.characteristic,
                status: category.status
            });
        } else {
            setEditingCategory(null);
            setFormData({
                id: 0,
                code: '',
                name: '',
                description: '',
                basePrice: '',
                maxWeight: '',
                characteristic: '',
                status: ''
            });
        }
        setIsModalOpen(true);
    };

    const handleDelete = (id: number) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa loại hàng hóa này?')) {
            setCategories(categories.filter(category => category.id !== id));
        }
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();

        if (editingCategory) {
            // Update existing category
            //   setCategories(categories.map(category =>
            //     category.id === editingCategory.id
            //       ? {
            //           ...category,
            //           code: formData.code,
            //           name: formData.name,
            //           description: formData.description,
            //           basePrice: parseInt(formData.basePrice),
            //           maxWeight: parseInt(formData.maxWeight),
            //           isFragile: formData.isFragile,
            //           requiresColdStorage: formData.requiresColdStorage,
            //           status: formData.status
            //         }
            //       : category
            //   ));
        } else {
            // Add new category
            //   const newCategory = {
            //     id: Math.max(...categories.map(c => c.id)) + 1,
            //     code: formData.code,
            //     name: formData.name,
            //     description: formData.description,
            //     basePrice: parseInt(formData.basePrice),
            //     maxWeight: parseInt(formData.maxWeight),
            //     isFragile: formData.isFragile,
            //     requiresColdStorage: formData.requiresColdStorage,
            //     status: formData.status
            //   };
            //   setCategories([...categories, newCategory]);
        }

        setIsModalOpen(false);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex items-center space-x-3">
                            <Archive className="w-8 h-8 text-blue-600" />
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Quản lý loại hàng hóa</h1>
                                <p className="text-gray-600">Hệ thống vận chuyển nội thành</p>
                            </div>
                        </div>
                        <button onClick={() => openModal()} className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                            <Plus size={20} />
                            Thêm loại hàng hóa
                        </button>
                    </div>
                </div>
                {/* Table */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-center whitespace-nowrap text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Mã loại
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Tên loại hàng
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Mô tả
                                    </th>
                                    <th className="px-6 py-3 text-center whitespace-nowrap text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Giá cơ sở
                                    </th>
                                    <th className="px-6 py-3 text-center whitespace-nowrap text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        TL tối đa (kg)
                                    </th>
                                    <th className="px-6 py-3 text-center whitespace-nowrap text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Đặc tính
                                    </th>
                                    <th className="px-6 py-3 text-center whitespace-nowrap text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Trạng thái
                                    </th>
                                    <th className="px-6 py-3 text-center whitespace-nowrap text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Thao tác
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredCategories.map((category) => (
                                    <tr key={category.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-center">
                                            {category.code}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {category.name}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">
                                            {category.description}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                                            {Number(category.basePrice).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                                            {category.maxWeight}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center align-middle">
                                            <div className="flex flex-col items-center justify-center gap-1 mx-auto">
                                                {category.characteristic && (
                                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-black">
                                                        {category.characteristic}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${category.status === 'active'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                                }`}>
                                                {category.status === 'active' ? 'Hoạt động' : 'Tạm dừng'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex items-center gap-2 justify-center">
                                                <button
                                                    onClick={() => openModal(category)}
                                                    className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                                                    title="Chỉnh sửa"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(category.id)}
                                                    className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors"
                                                    title="Xóa"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold text-gray-900">
                                    {editingCategory ? 'Chỉnh sửa loại hàng hóa' : 'Thêm loại hàng hóa mới'}
                                </h2>
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <form>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className='col-span-1'>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Mã loại hàng *
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                value={formData.code}
                                                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                                                placeholder="VD: LH001"
                                            />
                                        </div>
                                        <div className='col-span-2'>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Tên loại hàng *
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                placeholder="VD: Thực phẩm tươi sống"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Mô tả
                                        </label>
                                        <textarea
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            rows={1}
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            placeholder="Mô tả chi tiết về loại hàng hóa"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Giá cơ sở (VND) *
                                            </label>
                                            <input
                                                type="number"
                                                required
                                                min="0"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                value={formData.basePrice}
                                                onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                                                placeholder="25000"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Trọng lượng tối đa (kg) *
                                            </label>
                                            <input
                                                type="number"
                                                required
                                                min="0"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                value={formData.maxWeight}
                                                onChange={(e) => setFormData({ ...formData, maxWeight: e.target.value })}
                                                placeholder="50"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Đặc tính
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            min="0"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            value={formData.characteristic}
                                            onChange={(e) => setFormData({ ...formData, characteristic: e.target.value })}
                                            placeholder=""
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Trạng thái *
                                        </label>
                                        <select
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            value={formData.status}
                                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                        >
                                            <option value="active">Hoạt động</option>
                                            <option value="inactive">Tạm dừng</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-3 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleSubmit}
                                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md flex items-center gap-2 transition-colors"
                                    >
                                        <Save size={16} />
                                        {editingCategory ? 'Cập nhật' : 'Thêm mới'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div >
    );
};
