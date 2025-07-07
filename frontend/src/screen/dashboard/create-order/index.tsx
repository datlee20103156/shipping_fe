
import React, { useEffect, useState } from 'react';
import { Package, User, Clock, MapPin, Truck } from 'lucide-react';
import { District, Order, ProvinceData, Ward } from '../../../utils/type';
import api from '../../../utils/api';
import { useNavigate } from 'react-router-dom';

export default function ShippingOrderPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState<Order>({
        _id: "",
        code: "",
        receiver: { name: "", phone: "", address: "", district: "" },
        sender: { name: "", phone: "", address: "", district: "" },
        item: [
            { name: "", weight: 0, isFragile: true }
        ],
        fee: 0,
        cod: 0,
        status: "",
        shipperId: null,
        note: "",
        timeReceipt: "",
    });
    const [districts, setDistricts] = useState<District[]>([]);
    const [wardsFrom, setWardsFrom] = useState<Ward[]>([]);
    const [wardsTo, setWardsTo] = useState<Ward[]>([]);
    const [selectedFromDistrict, setSelectedFromDistrict] = useState("");
    const [selectedToDistrict, setSelectedToDistrict] = useState("");


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
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value: rawValue } = e.target;
        const keys = name.split('.'); // e.g. "receiver.phone" → ["receiver", "phone"]

        // Nếu field là số điện thoại thì xử lý riêng
        let value = rawValue;
        if (name.toLowerCase().includes("phone")) {
            value = rawValue.replace(/\D/g, '');           // chỉ cho nhập số
            if (value.length > 10) value = value.slice(0, 10); // giới hạn 10 số
        }

        setFormData(prev => {
            let updated: any = { ...prev };
            let current = updated;

            for (let i = 0; i < keys.length; i++) {
                const key = keys[i];
                if (i === keys.length - 1) {
                    current[key] = value; // gán giá trị ở cấp cuối
                } else {
                    // nếu chưa có object lồng bên trong thì khởi tạo nó
                    current[key] = current[key] || {};
                    current = current[key];
                }
            }

            return updated;
        });
    };

    const handleSubmit = async (e: any) => {
        const { senderWard, receiverWard, _id, code, ...orderDataWithoutWards } = {
            ...formData,
            status: "PENDING",
        };
        if (
            orderDataWithoutWards.item &&
            Array.isArray(orderDataWithoutWards.item) &&
            orderDataWithoutWards.item[0]
        ) {
            orderDataWithoutWards.item[0].weight = Number(orderDataWithoutWards.item[0].weight);
        }
        try {
            await api.post("order/create", orderDataWithoutWards);
            alert("Tạo đơn hàng thành công!");
            setFormData({
                _id: "",
                code: '',
                receiver: { name: "", phone: "", address: "", district: "" },
                sender: { name: "", phone: "", address: "", district: "" },
                item: [
                    { name: "", weight: 0, isFragile: true }
                ],
                fee: 0,
                cod: 0,
                status: "",
                shipperId: null,
                note: "",
                timeReceipt: "",
            })
            setSelectedFromDistrict("");
            setSelectedToDistrict("");
            navigate("/dashboard/orders");
        } catch (error: any) {
            if (error.code === "ADDRESS_NOT_FOUND") {
                alert("Chưa có dịch vụ hỗ trợ 2 địa điểm này!");
            }
            console.error("Error create order:", error);
        }
    };
    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    {/* Header */}
                    <div className="bg-blue-600 text-white px-6 py-4">
                        <h1 className="text-2xl font-bold flex items-center gap-2">
                            <Truck className="h-6 w-6" />
                            Tạo Đơn Hàng Vận Chuyển
                        </h1>
                        <p className="text-blue-100 mt-1">Điền thông tin chi tiết để tạo đơn hàng mới</p>
                    </div>

                    <div className="p-6 space-y-8">
                        {/* Thông tin người gửi */}
                        <div className="bg-gray-50 rounded-lg p-6">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <User className="h-5 w-5 text-blue-600" />
                                Thông tin người gửi
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Họ tên người gửi *
                                    </label>
                                    <input
                                        type="text"
                                        name="sender.name"
                                        placeholder='Nhập họ tên người gửi'
                                        value={formData.sender.name}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Số điện thoại *
                                    </label>
                                    <input
                                        type="tel"
                                        name="sender.phone"
                                        placeholder='Nhập số điện thoại người gửi'
                                        value={formData.sender.phone}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Huyện/ Thành phố *
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
                                                    sender: {
                                                        ...formData.sender,
                                                        district: newAddress,         // ✅ gán đúng cho sender
                                                    },
                                                    senderWard: "",                 // ✅ reset senderWard
                                                });
                                            }}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="">-- Chọn huyện --</option>
                                            {districts.map((d) => (
                                                <option key={d.code} value={d.code}>{d.name}</option>
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
                                                    sender: {
                                                        ...formData.sender,
                                                        district: newAddress,        // ✅ gán đúng cho sender
                                                    },
                                                    senderWard: wardCode,          // ✅ lưu senderWard
                                                });
                                            }}
                                            disabled={!wardsFrom.length}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="">-- Chọn xã/phường --</option>
                                            {wardsFrom.map((w) => (
                                                <option key={w.code} value={w.code}>{w.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Đường, số nhà gửi hàng *
                                    </label>
                                    <input
                                        type="text"
                                        name="sender.address"
                                        value={formData.sender.address}
                                        placeholder='Nhập đường, số nhà gửi hàng'
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>

                            </div>
                        </div>

                        {/* Thông tin người nhận */}
                        <div className="bg-gray-50 rounded-lg p-6">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <MapPin className="h-5 w-5 text-green-600" />
                                Thông tin người nhận
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Họ tên người nhận *
                                    </label>
                                    <input
                                        type="text"
                                        name="receiver.name"
                                        placeholder='Nhập họ tên người nhận'
                                        value={formData.receiver.name}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Số điện thoại *
                                    </label>
                                    <input
                                        type="tel"
                                        name="receiver.phone"
                                        placeholder='Nhập số điện thoại người nhận'
                                        value={formData.receiver.phone}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Huyện/ Thành phố *
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
                                                    receiver: {
                                                        ...formData.receiver,
                                                        district: newAddress,   
                                                    },
                                                    receiverWard: "",
                                                });
                                            }}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="">-- Chọn huyện --</option>
                                            {districts.map((d) => (
                                                <option key={d.code} value={d.code}>{d.name}</option>
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
                                                    receiver: {
                                                        ...formData.receiver,
                                                        district: newAddress,       // ✅ gán đúng cho receiver
                                                    },
                                                    receiverWard: wardCode,       // ✅ lưu receiverWard
                                                });
                                            }}
                                            disabled={!wardsTo.length}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                        >
                                            <option value="">-- Chọn xã/phường --</option>
                                            {wardsTo.map((w) => (
                                                <option key={w.code} value={w.code}>{w.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Đường, số nhà nhận hàng *
                                    </label>
                                    <input
                                        type="text"
                                        name="receiver.address"
                                        placeholder='Nhập đường, số nhà nhận hàng'
                                        value={formData.receiver.address}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>

                            </div>
                        </div>

                        {/* Thông tin hàng hóa */}
                        <div className="bg-gray-50 rounded-lg p-6">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                <Package className="h-5 w-5 text-orange-600" />
                                Thông tin hàng hóa
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Tên hàng hóa *
                                    </label>
                                    <input
                                        type="text"
                                        name="item.0.name"
                                        placeholder='Nhập tên hàng hóa'
                                        value={formData.item[0].name}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Khối lượng (kg) *
                                    </label>
                                    <input
                                        type="number"
                                        name="item.0.weight"
                                        value={formData.item[0].weight}
                                        onChange={handleInputChange}
                                        step="0.1"
                                        min="0"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                {/* <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Loại hàng hóa *
                                    </label>
                                    <select
                                        name="productType"
                                        // value={formData.productType}
                                        // onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    >
                                        <option value="">Chọn loại hàng hóa</option>
                                        {productTypes.map(type => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </select>
                                </div> */}

                                <div className="lg:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Thời gian nhận *
                                    </label>
                                    <input
                                        type="date"
                                        name="timeReceipt"
                                        value={formData.timeReceipt || ""}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div className="lg:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Ghi chú đơn hàng
                                    </label>
                                    <input
                                        type="text"
                                        name="note"
                                        placeholder='Nhập ghi chú đơn hàng'
                                        value={formData.note}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Phương thức thanh toán *
                                    </label>
                                    <div className="flex gap-4">
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                name="paymentMethod"
                                                value="cod"
                                                checked={true}
                                                onChange={handleInputChange}
                                                className="mr-2"
                                            />
                                            Thu hộ (COD)
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Nút submit */}
                        <div className="flex justify-end gap-4 pt-6 border-t">
                            <button
                                type="button"
                                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
                            >
                                Hủy
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    handleSubmit(formData);
                                }}
                                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                Tạo đơn hàng
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
