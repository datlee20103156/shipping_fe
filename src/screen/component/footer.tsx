import { Facebook, Truck, Twitter, Youtube } from "lucide-react";
import React from "react";

const Footer = () => {
  return (
    < footer className="bg-gray-900 text-white py-10" >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">
          <div>
            <div className="flex items-center mb-6">
              <Truck className="w-8 h-8 text-blue-400 mr-2" />
              <span className="text-2xl font-bold">DeliveryPro</span>
            </div>
            <p className="text-gray-400 mb-6">
              Đơn vị vận chuyển hàng đầu Việt Nam, mang đến giải pháp giao hàng tối ưu cho doanh nghiệp.
            </p>
            <div className="flex space-x-4">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors cursor-pointer">
                <span className="text-sm font-bold"><Facebook /></span>
              </div>
              <div className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors cursor-pointer">
                <span className="text-sm font-bold"><Twitter /></span>
              </div>
              <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors cursor-pointer">
                <span className="text-sm font-bold"><Youtube /></span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6">Dịch vụ</h3>
            <ul className="space-y-3 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Giao hàng nội thành</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Giao hàng liên tỉnh</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Thu hộ COD</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Gói cước doanh nghiệp</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6">Hỗ trợ</h3>
            <ul className="space-y-3 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Hướng dẫn sử dụng</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Câu hỏi thường gặp</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Chính sách bảo mật</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Điều khoản dịch vụ</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6">Liên hệ</h3>
            <div className="space-y-3 text-gray-400">
              <p>🏠 Mai Hắc Đế, TP BMT, Đắk Lắk</p>
              <p>📞 1900 1234</p>
              <p>✉️ support@DeliveryPro.vn</p>
              <p>🕒 8:00 - 18:00 (T2 - T7)</p>
            </div>
          </div>
        </div>

        <div className="mt-10 text-center text-sm text-gray-400 border-t pt-4">
          <p>
            Bản quyền © <span className="font-semibold text-blue-300">DeliveryPro</span> | Bảo lưu mọi quyền
          </p>
          <p>
            Nền tảng đào tạo, học tập và phát triển nội dung phân tán{" "}
            <span className="text-blue-300 font-medium">DeliveryPro</span>
          </p>
        </div>
      </div>
    </footer >
  );
};

export default Footer;
