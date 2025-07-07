import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../../utils/api";


const CourseCard = ({ course }: { course: any }) => (
  <div className="rounded-xl shadow-sm overflow-hidden border bg-white">
    <img
      src={course.bannerUrl}
      alt={course.title}
      className="w-full h-[160px] object-cover"
    />
    <div className="p-3 flex flex-col justify-between h-[150px]"> {/* cố định chiều cao */}
      <div>
        <h3 className="font-medium text-base mb-1 leading-snug line-clamp-2 min-h-[48px]">
          {course.name}
        </h3>
        <p className="text-sm text-gray-600 min-h-[20px]">
          {course.InfoResp?.fullname || '' /* ký tự space để giữ chỗ nếu trống */}
        </p>
      </div>
      <Link to={`/chi-tiet-lop-hoc/${course._id}`}>
        <p className="text-indigo-600 font-semibold mt-1 cursor-pointer text-right">
          Tham gia
        </p>
      </Link>
    </div>
  </div>
);


const ListCourses = () => {
  const [courses , setCourses] = useState([]);
  const fetchCourses = async () => {
    try {
        const response = await api.get(`course/getAllCourses?page=${1}&limit=${99999999}`);
        setCourses(response.data.data);
    } catch (error) {
        console.error("Error fetching user info:", error);
    }
};
useEffect(() => {
  fetchCourses();
}, []);
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Danh sách khóa học</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {courses.map((course, index) => (
          <CourseCard key={index} course={course} />
        ))}
      </div>
    </div>
  )
}


export default ListCourses;
