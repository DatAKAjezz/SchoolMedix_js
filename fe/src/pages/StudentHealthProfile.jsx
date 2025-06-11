import React, { useState } from 'react';
import { User, ChevronRight } from 'lucide-react';
import childImg from '../../student_imgs/student_1.jpg';
export const StudentHealthProfile = () => {
  const [activeTab, setActiveTab] = useState(0);
  
  const services = [
    "Thông tin cá nhân",
    "Thông tin tiêm chủng",
    "Thông tin bệnh",
    "Kết quả khám sức khỏe",
    "Đơn thuốc gửi",
  ];
  const child = {
    name: "Nguyễn Minh An",
    class: "Lớp 3A",
    image: childImg,
  };
  return (
    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4'>
      <div className="mb-6">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <span>Trang chủ</span>
          <ChevronRight className="w-4 h-4" />
          <span>Quản lý</span>
          <ChevronRight className="w-4 h-4" />
          <span>Y tế học đường</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium">Hồ sơ sức khỏe</span>
        </div>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Chi tiết hồ sơ sức khỏe</h1>
        <ul className="pl-10 flex gap-1.5 gap-y-2 border-b border-gray-300 mb-6">
          {services.map((service, index) => (
            <li key={index} className="p-4 mb-4 bg-white">
              <button
                onClick={() => setActiveTab(index)}
                className={activeTab === index ? "text-blue-600 font-semibold border-b-2 border-blue-600 pb-2" : "text-gray-800 hover:text-blue-600"}
              >
                {service}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="w-50 p-6 rounded-lg shadow-md flex flex-col items-center hover:shadow-lg cursor-pointer transition-shadow duration-300
        border-2 border-blue-500 bg-blue-50 mb-8">
        <img src={child.image} alt="student_1" className="w-24 h-24 rounded-full mb-4"/>
        <h3 className="text-lg font-semibold">{child.name}</h3>
        <p className="text-gray-600">{child.class}</p>
      </div>

      <div className="space-y-8">
        <div>
          <h2 className='text-lg font-semibold mb-4'>Thông tin chung</h2>
          <div className='flex gap-16 mt-4'>
            <div className='flex flex-col gap-3 text-gray-700'>
              <span>Ngày sinh: 20/2/2013</span>
              <span>Giới tính: Nữ</span>
              <span>Nơi sinh: </span>
              <span>Quốc tịch</span>
              <span>Số điện thoại</span>
            </div>
            <div className='flex flex-col gap-3 ml-10 text-gray-700'>
              <span>Mã học sinh: SE196253</span>
              <span>Khối: Khối 3</span>
              <span>Lớp: 3A</span>
              <span>Trạng Thái:
                <span className='ml-2 p-1 text-emerald-800 bg-green-200'>Đang học</span>
              </span>
              <span>Địa chỉ cư trú</span>
            </div>
          </div>
        </div>
        <div>
          <h2 className='text-lg font-semibold mb-4'>Thông tin gia đình</h2>
          <div className='flex flex-col gap-3 text-gray-700'>
            <span>Họ và tên: </span>
            <span>Ngày sinh: </span>
            <span>Nghề nghiệp: </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentHealthProfile;