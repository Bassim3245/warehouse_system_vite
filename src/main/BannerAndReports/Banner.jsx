import { useState, useEffect } from "react";
import axios from "axios";
import logoUr from "../../assets/image/image.png";
import logoEgcs from "../../assets/image/Picture2.jpg";

// Icons
import { Megaphone, ChevronLeft, X } from "lucide-react";

function Banner({ BackendUrl, isFixed = true }) {
  const [bannerData, setBannerData] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentAd, setCurrentAd] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const fetchBannerData = async () => {
    try {
      const response = await axios.get(`${BackendUrl}/api/getDataBanner`);
      setBannerData(response?.data?.response || []);
      setIsLoaded(true);
    } catch (error) {
      console.error(error?.response?.data?.message);
      setIsLoaded(true);
    }
  };

  useEffect(() => {
    fetchBannerData();
  }, []);

  // Auto-rotate ads every 5 seconds
  useEffect(() => {
    if (bannerData.length > 1) {
      const interval = setInterval(() => {
        setCurrentAd((prev) => (prev + 1) % bannerData.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [bannerData.length]);

  if (!isVisible && isFixed) return null;

  // Fixed Banner Design - Compact & Elegant
  if (isFixed) {
    return (
      <div
        className={`w-full transition-all duration-500 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
      >
        <div className="relative bg-gradient-to-r from-[#1e6a99] via-[#2a7fb5] to-[#1e6a99] shadow-2xl overflow-hidden">
          {/* Decorative Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-0 w-24 h-24 bg-white rounded-full translate-x-1/2 translate-y-1/2"></div>
          </div>

          <div className="relative z-10 px-4 py-3">
            <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
              {/* Left Logo */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 p-1.5 backdrop-blur-sm border border-white/30 flex-shrink-0">
                  <img
                    src={logoUr}
                    alt="Logo"
                    className="w-full h-full object-contain rounded-full"
                  />
                </div>
                <div className="hidden sm:block">
                  <Megaphone className="w-5 h-5 text-yellow-300 animate-pulse" />
                </div>
              </div>

              {/* Center Content - Title & Ad */}
              <div className="flex-1 text-center min-w-0">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <h3 className="text-white font-bold text-sm sm:text-base truncate">
                    نظام إدارة الخزين والمواد الراكدة
                  </h3>
                </div>

                {/* Scrolling Announcement */}
                {bannerData?.length > 0 && (
                  <div className="overflow-hidden">
                    <p className="text-yellow-200 text-xs sm:text-sm truncate animate-pulse">
                      📢 {bannerData[currentAd]?.content}
                    </p>
                  </div>
                )}
              </div>

              {/* Right Logo */}
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-white/20 p-1.5 backdrop-blur-sm border border-white/30 flex-shrink-0">
                  <img
                    src={logoEgcs}
                    alt="Logo EGCS"
                    className="w-full h-full object-contain rounded-full"
                  />
                </div>

                {/* Close Button */}
                <button
                  onClick={() => setIsVisible(false)}
                  className="p-1.5 rounded-full hover:bg-white/20 transition-colors"
                  title="إغلاق"
                >
                  <X className="w-4 h-4 text-white/70 hover:text-white" />
                </button>
              </div>
            </div>

            {/* Progress Indicator for Multiple Ads */}
            {bannerData?.length > 1 && (
              <div className="flex justify-center gap-1.5 mt-2">
                {bannerData.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentAd(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${index === currentAd
                        ? "bg-yellow-300 w-4"
                        : "bg-white/40 hover:bg-white/60"
                      }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Static Banner Design - Full Version (Before Footer)
  return (
    <div
      className={`w-full px-4 sm:px-6 lg:px-8 py-6 transition-all duration-500 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
    >
      <div className="relative bg-gradient-to-br from-[#1e6a99] via-[#2a7fb5] to-[#1e6a99] rounded-2xl shadow-2xl overflow-hidden max-w-5xl mx-auto">
        {/* Decorative Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-40 h-40 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-white rounded-full translate-x-1/2 translate-y-1/2"></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 opacity-5"></div>
        </div>

        <div className="relative z-10 p-6 sm:p-8">
          {/* Header with Logos */}
          <div className="flex items-center justify-center gap-6 mb-6">
            {/* Logo 1 */}
            <div className="w-16 h-16 rounded-xl bg-white/20 p-2 backdrop-blur-sm border border-white/30">
              <img
                src={logoUr}
                alt="Logo UR"
                className="w-full h-full object-contain rounded-lg"
              />
            </div>

            {/* Title */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Megaphone className="w-6 h-6 text-yellow-300" />
                <h2 className="text-xl sm:text-2xl font-bold text-white">
                  إعلانات النظام
                </h2>
              </div>
              <p className="text-white/80 text-sm">نظام إدارة الخزين والمواد الراكدة</p>
            </div>

            {/* Logo 2 */}
            <div className="w-16 h-16 rounded-xl bg-white/20 p-2 backdrop-blur-sm border border-white/30">
              <img
                src={logoEgcs}
                alt="Logo EGCS"
                className="w-full h-full object-contain rounded-lg"
              />
            </div>
          </div>

          {/* Divider */}
          <div className="w-24 h-1 bg-yellow-300 rounded-full mx-auto mb-6"></div>

          {/* Announcements List */}
          {bannerData?.length > 0 ? (
            <div className="space-y-3">
              {bannerData?.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-4 rounded-xl bg-white/10 border border-white/20 hover:bg-white/15 transition-all duration-300 group"
                >
                  <div className="w-8 h-8 rounded-lg bg-yellow-400 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <span className="text-[#1e6a99] font-bold text-sm">{index + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm sm:text-base leading-relaxed">
                      {item?.content}
                    </p>
                  </div>
                  <ChevronLeft className="w-5 h-5 text-white/50 flex-shrink-0 group-hover:text-yellow-300 group-hover:-translate-x-1 transition-all" />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-white/70">لا توجد إعلانات حالياً</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Banner;
