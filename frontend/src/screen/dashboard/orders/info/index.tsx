
import React, { useContext } from 'react';
import { Package, User, Clock, MapPin, Truck, Phone, Calendar, Weight, DollarSign, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { AppContext } from '../../../../context/AppContext';
import dayjs from 'dayjs';
import { OrderStatus } from '../../../../utils/type';
interface InfoCardProps {
    icon: React.ElementType; // Component như lucide-react icon
    title: string;
    children: React.ReactNode;
}
interface InfoRowProps {
    icon?: React.ElementType;
    label: string;
    value: string;
}
export default function OrderDetailsPage() {
    const { currentOrder } = useContext(AppContext);

    const statusConfig: Record<OrderStatus, {
        label: string;
        bgColor: string;
        textColor: string;
        icon: React.ElementType;
    }> = {
        PENDING: { label: 'Chờ xử lý', bgColor: 'bg-yellow-100', textColor: 'text-yellow-800', icon: Clock },
        ASSIGNED: { label: 'Đã nhận đơn', bgColor: 'bg-blue-100', textColor: 'text-blue-800', icon: Package },
        PICKED_UP: { label: 'Đã lấy hàng', bgColor: 'bg-purple-100', textColor: 'text-purple-800', icon: Truck },
        DELIVERING: { label: 'Đang giao', bgColor: 'bg-cyan-100', textColor: 'text-cyan-800', icon: Truck },
        DELIVERED: { label: 'Đã giao thành công', bgColor: 'bg-green-100', textColor: 'text-green-800', icon: CheckCircle },
        FAILED: { label: 'Giao thất bại', bgColor: 'bg-orange-100', textColor: 'text-orange-800', icon: AlertTriangle },
        CANCELLED: { label: 'Đã hủy', bgColor: 'bg-red-100', textColor: 'text-red-800', icon: XCircle },
    };

    const InfoCard = ({ icon: Icon, title, children }: InfoCardProps) => (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center mb-4">
                <Icon className="h-5 w-5 text-blue-600 mr-2" />
                <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            </div>
            {children}
        </div>
    );

    const InfoRow = ({ label, value, icon: Icon }: any) => (
        <div className="flex items-center py-2">
            {Icon && <Icon className="h-4 w-4 text-gray-500 mr-2" />}
            <span className="text-sm text-gray-600 font-medium w-46 whitespace-nowrap">{label}:</span>
            <span className="text-sm text-gray-900 ml-2">{value}</span>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center">
                            <Package className="h-8 w-8 text-blue-600 mr-3" />
                            <h1 className="text-xl font-bold text-gray-900">Chi Tiết Đơn Hàng</h1>
                        </div>
                        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                            In đơn hàng
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Order Summary */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">#{currentOrder?.code}</h2>
                            <p className="text-sm text-gray-600 mt-1">Ngày tạo: {dayjs(currentOrder?.createdAt).format('HH:mm, DD/MM/YYYY')}</p>
                        </div>
                        {(() => {
                            const config = statusConfig[currentOrder?.status as OrderStatus];
                            if (!config) {
                                return (
                                    <span className="inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                        <span>Không xác định</span>
                                    </span>
                                );
                            }
                            return (
                                <span
                                    className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${config.bgColor} ${config.textColor}`}
                                >
                                    <config.icon className="w-4 h-4" />
                                    <span>{config.label}</span>
                                </span>
                            );
                        })()}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                        <div className="flex items-center p-4 bg-green-50 rounded-lg">
                            <Calendar className="h-8 w-8 text-green-600 mr-3" />
                            <div>
                                <p className="text-sm font-medium text-gray-900">Dự kiến giao</p>
                                <p className="text-lg font-bold text-green-600">{dayjs(currentOrder?.timeReceipt).format('DD/MM/YYYY')}</p>
                            </div>
                        </div>

                        <div className="flex items-center p-4 bg-yellow-50 rounded-lg">
                            <DollarSign className="h-8 w-8 text-yellow-600 mr-3" />
                            <div>
                                <p className="text-sm font-medium text-gray-900">Phí vận chuyển</p>
                                <p className="text-lg font-bold text-yellow-600">{currentOrder?.cod.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Sender Information */}
                    <InfoCard icon={User} title="Thông Tin Người Gửi">
                        <div className="space-y-2">
                            <InfoRow label="Họ tên" value={currentOrder?.sender.name} icon={undefined} />
                            <InfoRow label="Số điện thoại" value={currentOrder?.sender.phone} icon={Phone} />
                            <InfoRow label="Địa chỉ" value={currentOrder?.sender.address + ', ' + currentOrder?.sender.district} icon={MapPin} />
                        </div>
                    </InfoCard>

                    {/* Receiver Information */}
                    <InfoCard icon={User} title="Thông Tin Người Nhận">
                        <div className="space-y-2">
                            <InfoRow label="Họ tên" value={currentOrder?.receiver.name} icon={undefined} />
                            <InfoRow label="Số điện thoại" value={currentOrder?.receiver.phone} icon={Phone} />
                            <InfoRow label="Địa chỉ" value={currentOrder?.receiver.address + ', ' + currentOrder?.receiver.district} icon={MapPin} />
                        </div>
                    </InfoCard>

                    {/* Cargo Information */}
                    <InfoCard icon={Package} title="Thông Tin Hàng Hóa">
                        <div className="space-y-2">
                            <InfoRow label="Tên đơn hàng" value={currentOrder?.items[0].name} icon={undefined} />
                            <InfoRow label="Khối lượng" value={currentOrder?.items[0].weight + ' kg'} icon={Weight} />
                        </div>
                    </InfoCard>

                    {/* Shipping Information */}
                    <InfoCard icon={Truck} title="Thông Tin Vận Chuyển">
                        <div className="space-y-2">
                            <InfoRow label="Phương thức" value={'Giao hàng tiêu chuẩn'} icon={undefined} />
                            <InfoRow label="Phí vận chuyển" value={currentOrder?.fee.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })} icon={undefined} />
                            <InfoRow label="Phí thu hộ (COD)" value={currentOrder?.cod.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })} icon={undefined} />
                            <InfoRow label="Thời gian giao hàng" value={dayjs(currentOrder?.timeReceipt).format('DD/MM/YYYY')} icon={Clock} />
                        </div>
                    </InfoCard>
                </div>

                {/* Driver Information */}
                <div className="mt-6">
                    <InfoCard icon={Truck} title="Thông Tin Tài Xế">
                        {!currentOrder?.shipperId ? (
                            <div className="text-center text-red-500 font-semibold col-span-full">
                                Chưa sắp xếp tài xế vận chuyển
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InfoRow label="Tên tài xế" value={currentOrder?.shipperId.fullname} icon={undefined} />
                                <InfoRow label="Số điện thoại" value={currentOrder?.shipperId.phone} icon={Phone} />
                            </div>
                        )}
                    </InfoCard>
                </div>
            </div>
        </div>
    );
}