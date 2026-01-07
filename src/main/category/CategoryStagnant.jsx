import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import imageObsolete from "../../assets/image/obesoleteMatrial.png";
import { getToken } from "../../utils/handelCookie";
import { BackendUrFile } from "../../redux/api/axios";

// Icons
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  ArrowLeft,
  Layers,
} from "lucide-react";

function Category({ BackendUrl }) {
  const [dataMainClass, setDataMainClass] = useState([]);
  const [allDataMainClass, setAllDataMainClass] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visibleCount] = useState(5);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  const fetchMainClassData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BackendUrl}/api/getDataMainClass`);
      setAllDataMainClass(response?.data?.response);
      setDataMainClass(response?.data?.response.slice(currentIndex, currentIndex + 5));
    } catch (error) {
      console.error(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMainClassData();
  }, [currentIndex]);

  const token = getToken();

  const handleLoadMore = () => {
    const newIndex = currentIndex + visibleCount;
    if (newIndex < allDataMainClass.length) {
      const newVisibleItems = allDataMainClass.slice(
        newIndex,
        newIndex + visibleCount
      );
      setDataMainClass(newVisibleItems);
      setCurrentIndex(newIndex);
    }
  };

  const handleLoadLess = () => {
    const newIndex = Math.max(currentIndex - visibleCount, 0);
    const newVisibleItems = allDataMainClass.slice(
      newIndex,
      newIndex + visibleCount
    );
    setDataMainClass(newVisibleItems);
    setCurrentIndex(newIndex);
  };

  return (
    <section className="section-padding bg-white">
      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="px-8 py-6 rounded-2xl bg-white shadow-2xl flex items-center gap-4 border">
            <Loader2 className="w-8 h-8 text-[#1e3a8a] animate-spin" />
            <span className="text-[#1e3a8a] font-bold text-lg">جاري التحميل...</span>
          </div>
        </div>
      )}

      <div className="container-max">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#1e3a8a]/10 rounded-full text-[#1e3a8a] text-sm font-medium mb-4">
            <Layers className="w-4 h-4" />
            <span>استكشف التصنيفات</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-[#1e3a8a] mb-4">
            التصنيفات
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            استكشف مجموعة متنوعة من تصنيفات المواد والمنتجات المتاحة على المنصة
          </p>
        </div>

        {/* Categories Carousel */}
        <div className="relative flex items-center justify-center">
          {/* Left Arrow */}
          {currentIndex > 0 && (
            <button
              onClick={handleLoadLess}
              className="absolute left-0 z-20 w-12 h-12 rounded-full bg-white shadow-lg border border-gray-200 hover:shadow-xl flex items-center justify-center text-[#1e3a8a] transition-all duration-300 hover:scale-110"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {/* Cards Container */}
          <div className="flex gap-6 overflow-hidden px-16 py-4 w-full max-w-6xl">
            {dataMainClass?.map((item, index) => (
              <Link
                key={item?.mainClass_id || index}
                to={`/Product-Obsolete/${item?.mainClass_id}`}
                className="group flex-shrink-0 w-52 transition-all duration-500"
              >
                <div className="card p-0 overflow-hidden group-hover:shadow-2xl">
                  {/* Image Container */}
                  <div className="relative h-40 overflow-hidden bg-gray-100">
                    {item?.file_name ? (
                      <img
                        src={`${BackendUrFile}/${item?.file_name}`}
                        alt={item?.main_Class_name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <img
                          src={imageObsolete}
                          alt={item?.main_Class_name}
                          className="w-16 h-16 object-contain opacity-40 group-hover:opacity-60 transition-opacity"
                        />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4 text-center">
                    <h3 className="font-bold text-[#1e3a8a] text-sm line-clamp-2 group-hover:text-[#2563eb] transition-colors">
                      {item?.main_Class_name}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Right Arrow */}
          {currentIndex + visibleCount < allDataMainClass.length && (
            <button
              onClick={handleLoadMore}
              className="absolute right-0 z-20 w-12 h-12 rounded-full bg-white shadow-lg border border-gray-200 hover:shadow-xl flex items-center justify-center text-[#1e3a8a] transition-all duration-300 hover:scale-110"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}
        </div>

        {/* Pagination Dots */}
        <div className="flex items-center justify-center gap-2 mt-10">
          {Array.from({ length: Math.ceil(allDataMainClass.length / visibleCount) }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                const newIndex = idx * visibleCount;
                setDataMainClass(allDataMainClass.slice(newIndex, newIndex + visibleCount));
                setCurrentIndex(newIndex);
              }}
              className={`h-2 rounded-full transition-all duration-300 ${Math.floor(currentIndex / visibleCount) === idx
                  ? "w-10 bg-gradient-to-r from-[#1e3a8a] to-[#2563eb]"
                  : "w-2 bg-gray-300 hover:bg-gray-400"
                }`}
            />
          ))}
        </div>

        {/* Explore More Button */}
        {!token && (
          <div className="text-center mt-14">
            <button
              onClick={() => navigate("/All-Category")}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#1e3a8a] to-[#2563eb] text-white font-semibold rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              <span>استكشاف المزيد</span>
              <ArrowLeft className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export default Category;
