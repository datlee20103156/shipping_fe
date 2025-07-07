import React, { useEffect, useState } from 'react';
import { Clock, User, Package, MapPin, Phone, Calendar, ChevronDown, ChevronUp, Eye, Truck, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import { useParams } from 'react-router-dom';
import api from '../../utils/api';
import { OrderLog, OrderStatus } from '../../utils/type';

export default function OrderLogPage() {
  const { id } = useParams();
  const [expandedItems, setExpandedItems] = useState({});
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderLog, setOrderLog] = useState<OrderLog[]>([]);

  const fetchOrderLog = async () => {
    try {
      const response = await api.get(`orderLog/getByCondition?page=1&limit=10&query=${id}&type=ORDER`);
      setOrderLog(response.data.orderLog);
    } catch (error) {
      console.error("Error fetching order log:", error);
    }
  }
  useEffect(() => {
    fetchOrderLog();
  })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

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

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-purple-100 text-purple-800';
      case 'SHIPER':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const parseNoteChanges = (note: string) => {
    try {
      const jsonMatch = note.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return {};
    } catch (error) {
      return {};
    }
  };

  const toggleExpanded = (id: string) => {
    setExpandedItems(prev => ({
      ...prev,
      //   [id]: !prev[id]
    }));
  };

  const renderChangeDetails = (changes: any) => {
    if (!changes || Object.keys(changes).length === 0) {
      return <p className="text-gray-500 text-sm">Không có thay đổi chi tiết</p>;
    }

    return (
      <div className="bg-gray-50 p-4 rounded-lg mt-3">
        <h4 className="font-semibold text-gray-700 mb-2">Chi tiết thay đổi:</h4>
        <div className="space-y-2">
          {Object.entries(changes).map(([key, value]) => (
            <div key={key} className="flex flex-wrap gap-2">
              <span className="font-medium text-gray-600 capitalize">{key}:</span>
              <span className="text-gray-800">
                {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Lịch Sử Đơn Hàng</h1>
              <p className="text-gray-600 mt-1">Theo dõi các thay đổi và cập nhật của đơn hàng</p>
            </div>
          </div>
        </div>

        {/* Order Info Card */}
        {orderLog.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Mã đơn hàng: {orderLog[0]?.oid.code}
              </h2>
              {(() => {
                const config = statusConfig[orderLog[0]?.oid.status as OrderStatus];
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <User className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900 mb-2">Người gửi</p>
                    <p className="text-gray-600 mb-1">{orderLog[0].oid.sender.name}</p>
                    <p className="text-sm text-gray-500 flex items-center mb-1">
                      <Phone className="w-4 h-4 mr-1" />
                      {orderLog[0].oid.sender.phone}
                    </p>
                    <p className="text-sm text-gray-500 flex items-start">
                      <MapPin className="w-4 h-4 mr-1 mt-0.5" />
                      {orderLog[0].oid.sender.address}, {orderLog[0].oid.sender.district}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900 mb-2">Người nhận</p>
                    <p className="text-gray-600 mb-1">{orderLog[0].oid.receiver.name}</p>
                    <p className="text-sm text-gray-500 flex items-center mb-1">
                      <Phone className="w-4 h-4 mr-1" />
                      {orderLog[0].oid.receiver.phone}
                    </p>
                    <p className="text-sm text-gray-500 flex items-start">
                      <MapPin className="w-4 h-4 mr-1 mt-0.5" />
                      {orderLog[0].oid.receiver.address}, {orderLog[0].oid.receiver.district}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Package className="w-5 h-5 text-gray-400" />
                    <span className="font-medium text-gray-900">
                      {orderLog[0].oid.items[0].name}
                    </span>
                    <span className="text-sm text-gray-500">
                      ({orderLog[0].oid.items[0].weight} kg)
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-gray-900">
                    {orderLog[0].oid.fee.toLocaleString('vi-VN')} VNĐ
                  </p>
                  <p className="text-sm text-gray-500">COD: {orderLog[0].oid.cod.toLocaleString('vi-VN')} VNĐ</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Timeline */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Lịch sử thay đổi</h3>

          <div className="space-y-6">
            {orderLog.map((logItem, index) => {
              const changes = parseNoteChanges(logItem.note);
              //   const isExpanded = expandedItems[logItem._id];

              return (
                <div key={logItem._id} className="relative">
                  {/* Timeline line */}
                  {index !== orderLog.length - 1 && (
                    <div className="absolute left-5 top-12 w-0.5 h-16 bg-gray-200"></div>
                  )}

                  <div className="flex items-start space-x-4">
                    {/* Timeline dot */}
                    <div className="flex-shrink-0 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <Clock className="w-5 h-5 text-white" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <span className="font-medium text-gray-900">
                              {logItem.actorId.fullname}
                            </span>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getRoleColor(logItem.actorId.role[0])}`}>
                              {logItem.actorId.role[0] === 'SHIPER'
                                ? 'Người giao hàng'
                                : logItem.actorId.role[0] === 'ADMIN'
                                  ? 'Quản trị viên'
                                  : logItem.actorId.role[0] === 'OPERATOR'
                                    ? 'Điều phối viên'
                                    : logItem.actorId.role[0] === 'USER'
                                      ? 'Người dùng'
                                      : 'Không xác định'}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-500">
                              {formatDate(logItem.createdAt)}
                            </span>
                            <button
                              onClick={() => toggleExpanded(logItem._id)}
                              className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                              {/* {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />} */}
                            </button>
                          </div>
                        </div>

                        <div className="text-sm text-gray-600 mb-3">
                          <div className="flex items-center space-x-2">
                            <Phone className="w-4 h-4" />
                            <span>{logItem.actorId.phone}</span>
                          </div>
                        </div>

                        <div className="text-gray-800">
                          <p className="font-medium mb-2">Thay đổi:</p>
                          <div className="bg-white p-3 rounded border-l-4 border-blue-500">
                            {logItem.note.split('\n')[0]}
                          </div>
                        </div>

                        {/* {isExpanded && renderChangeDetails(changes)} */}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
