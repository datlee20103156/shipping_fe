import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { memo, useCallback, useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import api from "../../utils/api";

const ErrorMessage = memo(({ message }: { message: string }) => (
    <div className="p-3 rounded-lg bg-red-50 border border-red-200 my-3">
        <p className="text-sm text-red-600">{message}</p>
    </div>
));
ErrorMessage.displayName = 'ErrorMessage';

export default function RegisterPage() {
    const { saveUserInfo, saveIsLogin } = useContext(AppContext);
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showRePassword, setShowRePassword] = useState(false);
    const [phone, setPhone] = useState("");
    const [error, setError] = useState("");
    const [password, setPassword] = useState("");
    const [repassword, setRepassword] = useState("");
    const isFormValid = password === repassword && password.length > 0 && phone.length === 10;
    const handleChange = (e: any) => {
        let value = e.target.value.replace(/\D/g, ''); // chỉ cho số
        if (value.length > 10) value = value.slice(0, 10); // giới hạn 10 số
        setPhone(value);
    };
    const handleClickShowPassword = useCallback(() => {
        setShowPassword(prev => !prev);
    }, []);
    const handleClickShowRePassword = useCallback(() => {
        setShowRePassword(prev => !prev);
    }, []);
    const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setPassword(value);
        if (repassword && value !== repassword) {
            setError('Mật khẩu không khớp');
        } else {
            setError('');
        }
    };
    const handleChangeRepassword = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setRepassword(value);
        if (password && value !== password) {
            setError('Mật khẩu không khớp!!');
        } else {
            setError('');
        }
    };
    // Form submission handler
    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        const formData = new FormData(e.target as HTMLFormElement);
        const phone = formData.get('phone');
        const password = formData.get('password') as string;
        const fullname = formData.get('fullname') as string;

        try {
            const response = await api.post('users/createUser', { phone, password, role: 'USER', fullname: fullname || 'Người dùng' });
            if (response.status === 200) {
                alert('Đăng ký tài khoản thành công!');
                navigate('/login');
            } else {
                setError('Vui lòng kiểm tra lại số điện thoại hoặc mật khẩu.');
            }
        } catch (error: any) {
            if (error.response?.status === 400) {
                setError('Số điện thoại hoặc mật khẩu không đúng.');
            } else {
                setError('Có lỗi xảy ra, vui lòng thử lại.');
            }
        }
    }, [navigate, saveIsLogin, saveUserInfo]);
    return (
        <div className="flex h-screen">
            {/* Left panel - Login Form */}
            <div className="w-full flex flex-col justify-center items-center bg-white px-8">
                {/* Logo */}
                <div className=" bg-white border border-gray-200 rounded-lg shadow-lg p-8 min-w-[500px]">
                    <div onClick={() => navigate('/')} className="text-4xl font-bold text-gray-800 mb-4 text-center cursor-pointer">DeliveryPro</div>
                    {/* Form */}
                    <form
                        className="w-full max-w-md space-y-4"
                        onSubmit={handleSubmit}
                    >
                        <div>
                            <label className="block text-sm text-gray-700 mb-1">Họ và Tên</label>
                            <input
                                name="fullname"
                                type="text"
                                placeholder="Nhập họ và tên"
                                className="w-full px-4 py-2 border rounded outline-none focus:ring-2 focus:ring-indigo-500"
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-700 mb-1">Số điện thoại</label>
                            <input
                                name="phone"
                                type="tel"
                                placeholder="Nhập số điện thoại"
                                inputMode="numeric"
                                className="w-full px-4 py-2 border rounded outline-none focus:ring-2 focus:ring-indigo-500"
                                value={phone}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-700 mb-1">Mật khẩu</label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="Nhập mật khẩu"
                                    onChange={handleChangePassword}
                                    className="w-full px-4 py-2 border rounded outline-none pr-10 focus:ring-2 focus:ring-indigo-500"
                                    style={{
                                        transition: 'border-color 0.15s ease, box-shadow 0.15s ease'
                                    }}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={handleClickShowPassword}
                                    className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                                    style={{ transition: 'color 0.15s ease' }}
                                    aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                                >
                                    <FontAwesomeIcon
                                        icon={showPassword ? faEye : faEyeSlash}
                                        className="w-5 h-5"
                                    />
                                </button>
                            </div>
                            {/* {error && <ErrorMessage message={error} />} */}
                        </div>
                        <div>
                            <label className="block text-sm text-gray-700 mb-1">Nhập lại mật khẩu</label>
                            <div className="relative">
                                <input
                                    id="repassword"
                                    type={showRePassword ? "text" : "password"}
                                    name="repassword"
                                    placeholder="Nhập lại mật khẩu"
                                    onChange={handleChangeRepassword}
                                    className="w-full px-4 py-2 border rounded outline-none pr-10 focus:ring-2 focus:ring-indigo-500"
                                    style={{
                                        transition: 'border-color 0.15s ease, box-shadow 0.15s ease'
                                    }}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={handleClickShowRePassword}
                                    className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
                                    style={{ transition: 'color 0.15s ease' }}
                                    aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                                >
                                    <FontAwesomeIcon
                                        icon={showPassword ? faEye : faEyeSlash}
                                        className="w-5 h-5"
                                    />
                                </button>
                            </div>
                            {error && <ErrorMessage message={error} />}
                        </div>
                        <button
                            type="submit"
                            disabled={!isFormValid}
                            className={`w-full py-2 rounded my-3 mt-4 ${isFormValid
                                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                        >
                            Đăng ký
                        </button>
                    </form>
                    <div className="p-4 border-t border-gray-200 mt-4">
                        <div className="flex items-center justify-center">
                            <h1 className="text-md text-gray-800">Bạn đã có tài khoản? <span><a href="/login" className="text-blue-600 hover:underline font-bold">Đăng nhập</a></span></h1>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
