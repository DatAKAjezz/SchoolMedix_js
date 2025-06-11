import { useState } from "react";
import child_1 from "../../student_imgs/student_1.jpg"
import child_2 from "../../student_imgs/student_2.jpg"
import child_3 from "../../student_imgs/student_3.jpg"
import { Services } from "../components/Services";
import { Heart, Calendar, Activity, Pill, Syringe, BarChart3 } from "lucide-react";
export const ParentDashboard = () =>{
    const services = [
    {
      icon: <Heart className="w-8 h-8 text-red-500" />,
      title: "Tiêm Chủng",
      description:"Theo dõi và cập nhật lịch tiêm chủng", 
      info: "4/6 mũi tiêm đã hoàn thành", 
    },
    {
      icon: <Calendar className="w-8 h-8 text-blue-500" />,
      title: "Khám sức khỏe định kỳ ",
      description: "Lịch khám và kết quả khám định kỳ",
      info: "Kham gần nhất: 15/5/2025", 
    },
    {
      icon: <Activity className="w-8 h-8 text-green-500" />,
      title: "Khảo sát y tế",
      description: "Các khảo sát về tình trạng sức khỏe",
      info: "2 khảo sát cần hoàn thành", 
    },
    {
      icon: <Pill className="w-8 h-8 text-purple-500" />,
      title: "Gửi thuốc cho nhà trường",
      description: "Đăng ký và theo dõi thuốc tại trường",
      info: "1 đơn thuốc đang chờ xác nhận", 
    },
    {
      icon: <Syringe className="w-8 h-8 text-orange-500" />,
      title: "Tổng quan sức khỏe",
      description: "Lịch khám và kết quả khám định kỳ",
      info: "Khám gần nhất: 15/2/2025", 
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-indigo-500" />,
      title: "Báo cáo sức khỏe",
      description: "Xem báo cáo tổng quan sức khỏe",
      info: "Cập nhật 20/01/2025", 
    },
    ];
    const children = {
        child_1: {
            name: "Nguyễn Minh An",
            class: "Lớp 3A",
            image: child_1,
        },
        child_2: {
            name: "Nguyễn Minh An",
            class: "Lớp 3A",
            image: child_2,
        },
        child_3: {
            name: "Nguyễn Minh An",
            class: "Lớp 3A",
            image: child_3,
        }
    };
    const [selectedChild, setSelectedChild] = useState(null);

    return(
        <section className="max-w-7xl mx-auto min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Danh sách con của bạn</h1>
            {children && Object.keys(children).length > 0 ? (
                <div className="flex justify-center items-center gap-20 mb-8">
                    {Object.entries(children).map(([key, child]) => (
                        <button key={key} onClick={()=>setSelectedChild(key)} 
                        className={`bg-white p-6 rounded-lg shadow-md flex flex-col items-center hover:shadow-lg cursor-pointer transition-shadow duration-300
                                ${selectedChild === key ? 'border-2 border-blue-500 bg-blue-400' : ''}`}>
                            <img src={child.image} alt={child.name} className="w-24 h-24 rounded-full mb-4"/>
                            <h3 className="text-lg font-semibold">{child.name}</h3>
                            <p className="text-gray-600">{child.class}</p>
                        </button>
                    ))}
                </div>
            ) : (
                <p className="text-center text-gray-500">Không có thông tin trẻ em.</p>
            )}
            <h2 className="text-2xl font-bold text-gray-900">Quản Lý Y Tế học đường </h2>
            <div>
                <Services services={services}/>
            </div>
        </section>
    )
} 