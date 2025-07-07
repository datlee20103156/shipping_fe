import React, { useContext, useEffect, useState } from 'react';
import { Edit, RefreshCw, Trash2, Plus, Package, Clock, CheckCircle, XCircle, X, Truck, AlertTriangle, Search, Eye, FileText, MapPin, User, Calendar } from 'lucide-react';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { Customer, District, Order, OrderStatus, ProvinceData, Ward } from '../../../utils/type';
import api from '../../../utils/api';
import { AppContext } from '../../../context/AppContext';


export default function OrdersPage() {
  const { userInfo } = useContext(AppContext);
  const [orders, setOrders] = useState<Order[]>([
    {
      _id: '',
      code: '',
      receiver: { name: '', phone: '', address: '', district: '' },
      sender: { name: '', phone: '', address: '', district: '' },
      item: [
        { name: '', weight: 0, isFragile: true }
      ],
      fee: 0,
      cod: 0,
      status: '',
      shipperId: null,
      note: '',
      timeReceipt: '',
    }]);
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDetailForm, setShowDetailForm] = useState(false);
  const [showOperatorForm, setShowOperatorForm] = useState(false);
  const [showStatusForm, setShowStatusForm] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [orderDetail, setOrderDetail] = useState({
    _id: '',
    code: '',
    receiver: { name: '', phone: '', address: '', district: '' },
    sender: { name: '', phone: '', address: '', district: '' },
    items: [
      { name: '', weight: 0, isFragile: true }
    ],
    fee: 0,
    cod: 0,
    status: '',
    shipperId: null,
    note: '',
    timeReceipt: '',
  });
  const [editForm, setEditForm] = useState<Order>({
    _id: '',
    code: '',
    receiver: { name: '', phone: '', address: '', district: '' },
    sender: { name: '', phone: '', address: '', district: '' },
    item: [
      { name: '', weight: 0, isFragile: true }
    ],
    fee: 0,
    cod: 0,
    status: '',
    shipperId: null,
    note: '',
    timeReceipt: '',
  });

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

  const [districts, setDistricts] = useState<District[]>([]);
  const [wardsFrom, setWardsFrom] = useState<Ward[]>([]);
  const [wardsTo, setWardsTo] = useState<Ward[]>([]);
  const [selectedFromDistrict, setSelectedFromDistrict] = useState("");
  const [selectedToDistrict, setSelectedToDistrict] = useState("");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedShipperId, setSelectedShipperId] = useState('');
  const fetchCustomers = async () => {
    try {
      const response = await api.get(`users/getUserByQuery?page=1&limit=99999&role=SHIPER`);
      setCustomers(response.data.data);

    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };
  useEffect(() => {
    fetchCustomers();
  }, []);
  const fetchOders = async () => {
    try {
      const response = await api.get(`order/getByCondition?page=1&limit=99999&query=${searchTerm}`);
      setOrders(response.data.orders);

    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };
  useEffect(() => {
    fetchOders();
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

  const openModal = (order: Order | null = null) => {
    if (order) {
      setEditingOrder(order);
      setEditForm({
        ...order,
        _id: order._id,
        code: order.code,
        receiver: order.receiver,
        sender: order.sender,
        item: order.item,
        fee: order.fee,
        cod: order.cod,
        status: order.status,
        shipperId: order.shipperId,
        note: order.note,
        timeReceipt: order.timeReceipt
      });
      if (order.sender.district) {
        const parts = order.sender.district.split(",").map((p) => p.trim());
        const wardName = parts[0] || "";
        const districtName = parts[1] || "";

        const district = districts.find((d) => d.name === districtName);
        if (district) {
          setSelectedFromDistrict(String(district.code)); // set dropdown huyện

          // load wardsFrom trước khi tìm ward
          setWardsFrom(district.wards || []);

          const ward = district.wards?.find((w) => w.name === wardName);
          if (ward) {
            setEditForm((prev) => ({
              ...prev,
              senderWard: String(ward.code),
            }));
          }
        }
      }

      if (order.receiver.district) {
        const parts = order.receiver.district.split(",").map((p) => p.trim());
        const wardName = parts[0] || "";
        const districtName = parts[1] || "";

        const district = districts.find((d) => d.name === districtName);
        if (district) {
          setSelectedToDistrict(String(district.code)); // set dropdown huyện

          setWardsTo(district.wards || []);

          const ward = district.wards?.find((w) => w.name === wardName);
          if (ward) {
            setEditForm((prev) => ({
              ...prev,
              receiverWard: String(ward.code),
            }));
          }
        }
      }
    } else {
      setEditingOrder(null);
      setEditForm({
        _id: '',
        code: '',
        receiver: {
          name: '',
          phone: '',
          address: '',
          district: ''
        },
        sender: {
          name: '',
          phone: '',
          address: '',
          district: ''
        },
        item: [
          {
            name: '',
            weight: 0,
            isFragile: true
          }
        ],
        fee: 0,
        cod: 0,
        status: '',
        shipperId: {
          _id: '',
          fullname: '',
          phone: '',
        },
        note: '',
        timeReceipt: ''
      });
    }
    setShowEditForm(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value: rawValue, type } = e.target;
    const keys = name.split('.');
    let value: any = rawValue;

    if (name.toLowerCase().includes("phone")) {
      value = rawValue.replace(/\D/g, '');
      if (value.length > 10) value = value.slice(0, 10);
    } else if (type === "number") {
      value = Number(rawValue);
    }

    if (name === "timeReceipt") {
      return setEditForm((prev) => ({ ...prev, timeReceipt: value }));
    }

    setEditForm(prev => {
      const updated: any = { ...prev };
      let current = updated;
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (i === keys.length - 1) current[key] = value;
        else {
          current[key] = current[key] || {};
          current = current[key];
        }
      }
      return updated;
    });
  };
  const handleDetailOrder = (order: any) => {
    setOrderDetail(order);
    setShowDetailForm(true);
  }
  const handleUpdateStatus = (order: any) => {
    setCurrentOrder(order);
    setShowStatusForm(true);
  };
  const handleUpdateOperator = (order: any) => {
    setCurrentOrder(order);
    fetchCustomers();
    setShowOperatorForm(true);
  };
  function getChangedFields<T>(oldData: T, newData: T): Partial<T> {
    const changed: Partial<T> = {};

    for (const key in newData) {
      // Nếu giá trị mới khác giá trị cũ => ghi nhận
      if (JSON.stringify(newData[key]) !== JSON.stringify(oldData[key])) {
        changed[key] = newData[key];
      }
    }

    return changed;
  }
  function removeNestedIdFields(obj: any) {
    if (obj && typeof obj === 'object') {
      Object.keys(obj).forEach((key) => {
        if (key === '_id') {
          delete obj[key];
        } else if (typeof obj[key] === 'object') {
          removeNestedIdFields(obj[key]); // đệ quy vào các object con
        }
      });
    }
  }
  const handleSaveEdit = async (order: Order) => {
    // Tạo bản sao sâu để tránh chỉnh sửa editForm gốc
    const payload: any = JSON.parse(JSON.stringify(editForm));

    // Xóa các trường root-level không cho gửi
    const disallowedFields = [
      '_id', 'code', 'senderId', 'items', 'appliedFees', 'dispatcherId', 'fee', 'cod', 'shipperId',
      'createdAt', 'updatedAt', '__v', 'senderWard', 'receiverWard'
    ];
    disallowedFields.forEach(field => delete payload[field]);

    // Xóa toàn bộ _id lồng bên trong (sender._id, receiver._id, hoặc bất kỳ chỗ nào khác)
    removeNestedIdFields(payload);

    try {
      await api.put(`order/update?id=${order._id}`, payload);
      alert("Cập nhật thông tin đơn hàng thành công!");
      setShowEditForm(false);
      setCurrentOrder(null);
      fetchOders();
    } catch (error: any) {
      if (error.code === "ADDRESS_NOT_FOUND") {
        alert("Chưa có dịch vụ hỗ trợ 2 địa điểm này!");
      }
      console.error("Error update order:", error);
    }
  };
  const handleSaveOperator = async (shipperId: any,) => {
    try {
      await api.put(`order/update?id=${currentOrder?._id}`, { shipperId: shipperId });
      alert("Cập nhật thành công!");
      fetchOders();
      setShowOperatorForm(false);
      setCurrentOrder(null);
    } catch (error) {
      console.error("Error updating order status:", error);
    }

  };
  const handleSaveStatus = async (newStatus: any) => {
    try {
      await api.put(`order/update?id=${currentOrder?._id}`, { status: newStatus });
      alert("Cập nhật trạng thái thành công!");
      fetchOders();
      setShowStatusForm(false);
      setCurrentOrder(null);
    } catch (error) {
      console.error("Error updating order status:", error);
    }

  };

  const InfoRow = ({ icon, label, value, isAddress = false }: any) => (
    <div className="flex items-start space-x-3 py-3">
      <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-600 mb-1">{label}</p>
        <p className={`text-gray-900 ${isAddress ? 'text-sm' : 'text-base'}`}>
          {value || 'Chưa có thông tin'}
        </p>
      </div>
    </div>
  );

  const SectionTitle = ({ title, icon }: any) => (
    <div className="flex items-center space-x-2 mb-4 pb-2 border-b border-gray-200">
      <div className="w-6 h-6 text-blue-600">
        {icon}
      </div>
      <h4 className="text-lg font-semibold text-gray-800">{title}</h4>
    </div>
  );
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className=" mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Package className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Quản lý đơn hàng</h1>
                <p className="text-gray-600">Hệ thống vận chuyển nội thành</p>
              </div>
            </div>
            <button onClick={() => navigate('/dashboard/create-order')} className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              <Plus className="w-4 h-4" />
              <span>Thêm đơn hàng</span>
            </button>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Tìm kiếm theo mã đơn hàng..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    fetchOders();
                  }
                }}
              />
            </div>
          </div>
        </div>
        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Mã đơn hàng
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Người gửi
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Người nhận
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Người giao hàng
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Phí vận chuyển
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    TG giao
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap" >
                    Trạng thái
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-center">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {order.code}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{order.sender.name}</div>
                        <div className="text-sm text-gray-500">{order.sender.phone}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{order.receiver.name}</div>
                        <div className="text-sm text-gray-500">{order.receiver.phone}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{order.shipperId?.fullname}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="text-sm text-gray-900">{order.fee.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="text-sm text-gray-900">{dayjs(order.timeReceipt).format('DD/MM/YYYY')}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      {(() => {
                        const config = statusConfig[order.status as OrderStatus];
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
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2 text-center mx-auto justify-center">
                        {/* Tất cả các vai trò đều được xem chi tiết */}
                        <button
                          onClick={() => handleDetailOrder(order)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-50 transition-colors"
                          title="Xem chi tiết"
                        >
                          <Eye size={18} />
                        </button>

                        {userInfo?.role.includes("ADMIN") && (
                          <>
                            <button
                              onClick={() => openModal(order)}
                              className="p-2 text-orange-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Sửa thông tin"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleUpdateOperator(order)}
                              className="p-2 text-red-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Phân phối đơn hàng"
                            >
                              <Truck className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(order)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Cập nhật trạng thái"
                            >
                              <RefreshCw className="w-4 h-4" />
                            </button>
                          </>
                        )}

                        {userInfo?.role.includes("OPERATOR") && !userInfo.role.includes("ADMIN") && (
                          <>
                            <button
                              onClick={() => handleUpdateOperator(order)}
                              className="p-2 text-red-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Phân phối đơn hàng"
                            >
                              <Truck className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(order)}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Cập nhật trạng thái"
                            >
                              <RefreshCw className="w-4 h-4" />
                            </button>
                          </>
                        )}

                        {userInfo?.role.includes("SHIPER") && !userInfo.role.includes("ADMIN") && !userInfo.role.includes("OPERATOR") && (
                          <button
                            onClick={() => handleUpdateStatus(order)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Cập nhật trạng thái"
                          >
                            <RefreshCw className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {/* Details Modal */}
        {showDetailForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl transform transition-all duration-300 animate-slideUp max-h-[calc(100vh-60px)] overflow-y-auto m-4">

              {/* Header */}
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-t-2xl p-6 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <Package className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">Chi tiết đơn hàng #{orderDetail?.code}</h3>
                      <p className="text-blue-100 text-sm">Thông tin chi tiết đơn hàng</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowDetailForm(false)}
                    className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors duration-200"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Thông tin đơn hàng */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                  <div className="bg-gray-50 rounded-xl p-6">
                    <SectionTitle title="Thông tin đơn hàng" icon={<FileText className="w-6 h-6" />} />
                    <div className="space-y-1">
                      <InfoRow
                        icon={<span className="text-blue-600 font-semibold">#</span>}
                        label="Mã đơn hàng"
                        value={orderDetail?.code}
                      />
                      <InfoRow
                        icon={<Calendar className="w-4 h-4 text-blue-600" />}
                        label="Tên đơn hàng"
                        value={orderDetail?.items[0].name}
                      />
                      <InfoRow
                        icon={<span className="text-blue-600 font-semibold">⚖️</span>}
                        label="Khối lượng"
                        value={orderDetail?.items[0].weight + 'Kg'}
                      />
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-6">
                    <SectionTitle title="Trạng thái & Giao hàng" icon={<Truck className="w-6 h-6" />} />
                    <div className="space-y-1">
                      <div className="flex items-start space-x-3 py-3">
                        <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                          {(() => {
                            const config = statusConfig[orderDetail.status as OrderStatus];
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
                              </span>
                            );
                          })()}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-600 mb-1">Trạng thái</p>
                          {(() => {
                            const config = statusConfig[orderDetail.status as OrderStatus];
                            return (
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.bgColor} ${config.textColor}`}>
                                <span>{config.label}</span>
                              </span>
                            )
                          })()}
                        </div>
                      </div>
                      <InfoRow
                        icon={<Calendar className="w-4 h-4 text-blue-600" />}
                        label="Thời gian giao hàng"
                        value={orderDetail.timeReceipt ? new Date(orderDetail.timeReceipt).toLocaleDateString('vi-VN') : 'Chưa xác định'}
                      />
                      <InfoRow
                        icon={<FileText className="w-4 h-4 text-blue-600" />}
                        label="Ghi chú"
                        value={orderDetail.note}
                      />
                    </div>
                  </div>
                </div>

                {/* Thông tin người gửi và nhận */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Người gửi */}
                  <div className="bg-green-50 rounded-xl p-6">
                    <SectionTitle title="Thông tin người gửi" icon={<User className="w-6 h-6" />} />
                    <div className="space-y-1">
                      <InfoRow
                        icon={<User className="w-4 h-4 text-green-600" />}
                        label="Họ tên"
                        value={orderDetail.sender.name}
                      />
                      <InfoRow
                        icon={<span className="text-green-600 font-semibold">📞</span>}
                        label="Số điện thoại"
                        value={orderDetail.sender.phone}
                      />
                      <InfoRow
                        icon={<MapPin className="w-4 h-4 text-green-600" />}
                        label="Địa chỉ"
                        value={`${orderDetail.sender.address}, ${orderDetail.sender.district}`}
                        isAddress={true}
                      />
                    </div>
                  </div>

                  {/* Người nhận */}
                  <div className="bg-orange-50 rounded-xl p-6">
                    <SectionTitle title="Thông tin người nhận" icon={<User className="w-6 h-6" />} />
                    <div className="space-y-1">
                      <InfoRow
                        icon={<User className="w-4 h-4 text-orange-600" />}
                        label="Họ tên"
                        value={orderDetail.receiver.name}
                      />
                      <InfoRow
                        icon={<span className="text-orange-600 font-semibold">📞</span>}
                        label="Số điện thoại"
                        value={orderDetail.receiver.phone}
                      />
                      <InfoRow
                        icon={<MapPin className="w-4 h-4 text-orange-600" />}
                        label="Địa chỉ"
                        value={`${orderDetail.receiver.address}, ${orderDetail.receiver.district}`}
                        isAddress={true}
                      />
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => navigate('/orders/history/' + orderDetail._id)}
                    className="px-6 py-3 text-gray-100 bg-blue-400 rounded-lg hover:bg-blue-600 transition-colors duration-200 font-medium"
                  >
                    Lịch sử đơn hàng
                  </button>
                  <button
                    onClick={() => setShowDetailForm(false)}
                    className="px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-medium"
                  >
                    Đóng
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Edit Form Modal */}
        {showEditForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl transform transition-all duration-300 animate-slideUp max-h-[calc(100vh-60px)] overflow-y-auto m-4">
              <div>
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
                        <h3 className="text-xl font-bold">{editingOrder ? 'Chỉnh sửa đơn hàng' : 'Thêm đơn hàng mới'}</h3>
                        <p className="text-blue-100 text-sm">{editingOrder ? 'Cập nhật thông tin ' : ' Tạo đơn hàng mới'}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowEditForm(false)}
                      className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors duration-200"
                    >
                      <X size={18} />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tên người gửi
                    </label>
                    <input
                      type="text"
                      name='sender.name'
                      value={editForm.sender.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      SĐT người gửi
                    </label>
                    <input
                      type="text"
                      name='sender.phone'
                      value={editForm.sender.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Địa chỉ người gửi
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <select
                        value={selectedFromDistrict}
                        onChange={(e) => {
                          const districtCode = e.target.value;
                          setSelectedFromDistrict(districtCode);

                          const districtName = districts.find((d) => d.code === Number(districtCode))?.name || "";
                          const wardName = wardsFrom.find((w) => w.code === Number(editForm.senderWard))?.name || "";

                          const newAddress = [wardName, districtName].filter(Boolean).join(", ");

                          setEditForm({
                            ...editForm,
                            sender: {
                              ...editForm.sender,
                              district: newAddress,
                            },
                            senderWard: "",
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
                        value={editForm.senderWard || ""}
                        onChange={(e) => {
                          const wardCode = e.target.value;
                          const wardName = wardsFrom.find((w) => w.code === Number(wardCode))?.name || "";
                          const districtName = districts.find((d) => d.code === Number(selectedFromDistrict))?.name || "";

                          const newAddress = [wardName, districtName].filter(Boolean).join(", ");
                          setEditForm((prev) => ({
                            ...prev,
                            sender: {
                              ...prev.sender,
                              district: newAddress,
                            },
                            senderWard: wardCode,
                          }));
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
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 my-3">
                        Đường, số nhà gửi hàng *
                      </label>
                      <input
                        type="text"
                        name="sender.address"
                        value={editForm.sender.address}
                        placeholder='Nhập đường, số nhà gửi hàng'
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tên người nhận
                    </label>
                    <input
                      type="text"
                      name='receiver.name'
                      value={editForm.receiver.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      SĐT người nhận
                    </label>
                    <input
                      type="text"
                      name='receiver.phone'
                      value={editForm.receiver.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div className='md:col-span-2'>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Địa chỉ người nhận
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <select
                        value={selectedToDistrict}
                        onChange={(e) => {
                          const districtCode = e.target.value;
                          setSelectedToDistrict(districtCode);

                          const districtName = districts.find((d) => d.code === Number(districtCode))?.name || "";
                          const wardName = wardsTo.find((w) => w.code === Number(editForm.receiverWard))?.name || "";

                          const newAddress = [wardName, districtName].filter(Boolean).join(", ");

                          setEditForm({
                            ...editForm,
                            receiver: {
                              ...editForm.receiver,
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
                        value={editForm.receiverWard || ""}
                        onChange={(e) => {
                          const wardCode = e.target.value;
                          const wardName = wardsTo.find((w) => w.code === Number(wardCode))?.name || "";
                          const districtName = districts.find((d) => d.code === Number(selectedToDistrict))?.name || "";

                          const newAddress = [wardName, districtName].filter(Boolean).join(", ");
                          setEditForm({
                            ...editForm,
                            receiver: {
                              ...editForm.receiver,
                              district: newAddress,
                            },
                            receiverWard: wardCode,
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
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 my-3">
                        Đường, số nhà nhận hàng *
                      </label>
                      <input
                        type="text"
                        name="receiver.address"
                        placeholder='Nhập đường, số nhà nhận hàng'
                        value={editForm.receiver.address}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Thời gian giao hàng
                    </label>
                    <input
                      type="date"
                      name="timeReceipt"
                      value={editForm.timeReceipt ? new Date(editForm.timeReceipt).toISOString().split('T')[0] : ''}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditForm({ ...editForm, timeReceipt: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Trạng thái
                    </label>
                    <select
                      value={editForm.status}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setEditForm({ ...editForm, status: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    >
                      {Object.entries(statusConfig).map(([value, config]) => (
                        <option key={value} value={value}>{config.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ghi chú
                    </label>
                    <input
                      type="text"
                      value={editForm.note}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pb-3 px-6">
                  <button
                    onClick={() => setShowEditForm(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={() => handleSaveEdit(editForm)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Lưu thay đổi
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Status Update Modal */}
        {showStatusForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 ">
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
                        Cập nhật trạng thái
                      </h2>
                      <p className="text-blue-100 text-sm mt-2">
                        Đơn hàng: {currentOrder?.code}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowStatusForm(false)}
                    className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors duration-200"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {Object.entries(statusConfig).map(([status, config]) => (
                    <button
                      key={status}
                      onClick={() => handleSaveStatus(status)}
                      className={`w-full flex items-center space-x-3 p-3 rounded-lg border-2 transition-colors ${currentOrder?.status === status
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                        }`}
                    >
                      <config.icon className="w-5 h-5" />
                      <span className="font-medium">{config.label}</span>
                      {currentOrder?.status === status && (
                        <span className="ml-auto text-blue-600 text-sm">(Hiện tại)</span>
                      )}
                    </button>
                  ))}
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => setShowStatusForm(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Hủy
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Operator Update Modal */}
        {showOperatorForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 ">
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
                        Phân phối đơn hàng
                      </h2>
                      <p className="text-blue-100 text-sm mt-2">
                        Đơn hàng: {currentOrder?.code}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowOperatorForm(false)}
                    className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors duration-200"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Người giao hàng *
                  </label>
                  <select
                    name="shipperId"
                    // value={selectedShipperId}
                    onChange={(e) => setSelectedShipperId(e.target.value)}
                    className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">-- Chọn người giao hàng --</option>
                    {customers.map((shipper) => (
                      <option key={shipper._id} value={shipper._id}>
                        {shipper.fullname}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => setShowOperatorForm(false)}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={() => handleSaveOperator(selectedShipperId)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Lưu thay đổi
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
