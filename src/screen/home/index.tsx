
import React from 'react';
import {
  Truck,
  Clock,
  DollarSign,
  Users,
  Package,
  Shield,
  Headphones,
  CreditCard,
  Star,
  Play,
  CheckCircle,
  ArrowRight,
  Menu,
  X
} from 'lucide-react';

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const features = [
    {
      icon: <Clock className="w-8 h-8 text-blue-600" />,
      title: "Giao hàng nhanh",
      description: "Giao hàng trong ngày tại nội thành"
    },
    {
      icon: <CreditCard className="w-8 h-8 text-green-600" />,
      title: "Ứng trước COD",
      description: "Hỗ trợ ứng trước tiền thu hộ"
    },
    {
      icon: <DollarSign className="w-8 h-8 text-orange-600" />,
      title: "Đối soát COD hàng ngày",
      description: "Đối soát và chuyển tiền COD mỗi ngày"
    },
    {
      icon: <Headphones className="w-8 h-8 text-purple-600" />,
      title: "Hỗ trợ care đơn 1:1",
      description: "Chăm sóc khách hàng tận tình 24/7"
    }
  ];

  const advantages = [
    "Đồng giá từ 12k/3kg",
    "Miễn phí giao lại lần 3 lần 4",
    "Miễn phí mời khách vào nhóm Zalo Shop",
    "Miễn phí ZNS báo lịch trình giao hàng"
  ];

  const steps = [
    {
      step: "01",
      title: "Tạo đơn hàng",
      description: "Nhập thông tin người gửi và người nhận"
    },
    {
      step: "02",
      title: "Xác nhận đơn",
      description: "Kiểm tra thông tin và xác nhận giao hàng"
    },
    {
      step: "03",
      title: "Theo dõi đơn hàng",
      description: "Theo dõi trạng thái giao hàng real-time"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl lg:text-5xl font-bold text-gray-900 mb-6 leading-loose">
                Giao hàng
                <span className="text-blue-600"> siêu nhanh</span>
                <br />
                Cước phí
                <span className="text-green-600"> siêu rẻ</span>
              </h1>
              <div className="flex flex-wrap gap-6 mb-8">
                <div className="flex items-center">
                  <Users className="w-5 h-5 text-blue-600 mr-2" />
                  <span className="text-gray-700 font-medium">+100.000 Người dùng tin tưởng</span>
                </div>
                <div className="flex items-center">
                  <Package className="w-5 h-5 text-green-600 mr-2" />
                  <span className="text-gray-700 font-medium">+1.000.000 Đơn hàng được giao</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg">
                  Tạo đơn ngay
                </button>
                <button className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors font-medium text-lg">
                  Tìm hiểu thêm
                </button>
              </div>
            </div>

            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                alt="Delivery Service"
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 rounded-xl hover:shadow-lg transition-shadow border border-gray-100">
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Giới thiệu DeliveryPro
              </h2>
              <h3 className="text-2xl text-blue-600 mb-4 font-semibold">
                Tận tâm phụng sự, gắn kết thành công
              </h3>
              <p className="text-lg text-gray-700 mb-8 leading-relaxed">
                Sứ mệnh của chúng tôi là mang đến cho bạn những trải nghiệm giao hàng nhanh chóng và hoàn hảo.
                Tự hào là đơn vị tạo ra giải pháp giao hàng tối ưu và hiệu quả.
              </p>
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium inline-flex items-center">
                Tìm hiểu thêm
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                alt="About DeliveryPro"
                className="rounded-2xl shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Advantages Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              DeliveryPro luôn là lựa chọn hàng đầu vì
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="space-y-6">
                {advantages.map((advantage, index) => (
                  <div key={index} className="flex items-center p-4 bg-green-50 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-green-600 mr-4 flex-shrink-0" />
                    <span className="text-lg font-medium text-gray-900">{advantage}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                alt="Advantages"
                className="rounded-2xl shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-20 bg-gradient-to-r from-purple-900 to-blue-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h2 className="text-5xl font-bold mb-6">
              CÔNG NGHỆ
            </h2>
            <h3 className="text-3xl mb-8 text-blue-300">
              ĐA VẬN CHUYỂN THÔNG MINH
            </h3>
            <p className="text-xl mb-8 opacity-90">
              CÔNG TY CỔ PHẦN DELIVERYPRO VIỆT NAM
            </p>
            <button className="bg-white text-purple-900 px-8 py-4 rounded-full hover:bg-gray-100 transition-colors font-bold text-lg inline-flex items-center">
              <Play className="w-6 h-6 mr-3" />
              Xem video
            </button>
          </div>
        </div>
      </section>

      {/* How it works Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Lên đơn dễ dàng với 3 bước
            </h2>
            <p className="text-lg text-gray-600">
              Xem hướng dẫn cụ thể <a href="#" className="text-blue-600 hover:underline">tại đây</a>
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center relative">
                <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-1/2 w-full h-0.5 bg-gray-300 transform translate-x-8"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Sẵn sàng bắt đầu giao hàng cùng DeliveryPro?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Tham gia cùng hàng nghìn khách hàng đã tin tưởng sử dụng dịch vụ của chúng tôi
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors font-medium text-lg">
              Đăng ký ngay
            </button>
            <button className="border border-white text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg">
              Liên hệ tư vấn
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

