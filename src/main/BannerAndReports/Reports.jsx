import { useEffect, useState } from "react";
import axios from "axios";
import CountUp from "react-countup";

// Icons
import { Users, Package, Calendar, UserCheck, TrendingUp, ArrowUpRight } from "lucide-react";

function Reports({ BackendUrl }) {
  const [countData, setCountData] = useState(0);
  const [countDataMinistry, setCountDataMinistry] = useState(0);
  const [countDataForCurrentMonth, setCountDataForCurrentMonth] = useState(0);
  const [countUser, setCountUser] = useState(0);
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const fetchMainClassData = async () => {
    try {
      const { data } = await axios.get(
        `${BackendUrl}/api/getDataCountOfMaterial`
      );
      setCountData(data?.total_count || 0);
      setCountDataMinistry(data?.totalMinistry || 0);
      setCountDataForCurrentMonth(data?.totalCountMonth || 0);
      setCountUser(data?.totalCountUser || 0);
      setIsLoaded(true);
    } catch (error) {
      console.error(
        "Error fetching main class data:",
        error?.response?.data?.message || error.message
      );
      setError("حدث خطأ في تحميل البيانات");
      setIsLoaded(true);
    }
  };

  useEffect(() => {
    fetchMainClassData();
  }, []);

  // Stats data with colors
  const statsData = [
    {
      icon: Users,
      count: countDataMinistry,
      text: "المؤسسات المشاركة",
      gradient: "from-blue-500 to-cyan-500",
      bgGradient: "from-blue-50 to-cyan-50",
      iconBg: "bg-blue-500",
    },
    {
      icon: Package,
      count: countData,
      text: "إجمالي المنتجات",
      gradient: "from-purple-500 to-pink-500",
      bgGradient: "from-purple-50 to-pink-50",
      iconBg: "bg-purple-500",
    },
    {
      icon: Calendar,
      count: countDataForCurrentMonth,
      text: "المنتجات هذا الشهر",
      gradient: "from-orange-500 to-red-500",
      bgGradient: "from-orange-50 to-red-50",
      iconBg: "bg-orange-500",
    },
    {
      icon: UserCheck,
      count: countUser,
      text: "عدد المستخدمين",
      gradient: "from-green-500 to-emerald-500",
      bgGradient: "from-green-50 to-emerald-50",
      iconBg: "bg-green-500",
    },
  ];

  return (
    <section className="w-full py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="w-full px-4 md:px-8 lg:px-16 xl:px-24">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1e3a8a] mb-4">
            إحصائيات شاملة
          </h2>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {statsData.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className={`group relative overflow-hidden rounded-3xl bg-gradient-to-br ${stat.bgGradient} p-8 border border-gray-200 hover:border-transparent hover:shadow-2xl transition-all duration-500 hover:-translate-y-2`}
              >
                {/* Background Pattern */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/30 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-700"></div>
                
                {/* Icon Container */}
                <div className="relative flex items-start justify-between mb-6">
                  <div className={`w-14 h-14 ${stat.iconBg} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <ArrowUpRight className="w-5 h-5 text-gray-700" />
                  </div>
                </div>

                {/* Counter */}
                <div className="relative">
                  <div className={`text-5xl font-bold bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent mb-3`}>
                    {isLoaded ? (
                      <CountUp end={stat.count} duration={2.5} separator="," />
                    ) : (
                      <span className="opacity-50">0</span>
                    )}
                  </div>

                  {/* Label */}
                  <div className="text-gray-700 font-semibold text-lg">
                    {stat.text}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="relative mt-6">
                  <div className="h-2 bg-white/50 rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${stat.gradient} rounded-full transition-all duration-1000 ease-out`}
                      style={{ width: isLoaded ? '100%' : '0%' }}
                    ></div>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute bottom-4 left-4 flex gap-1 opacity-40">
                  <div className="w-2 h-2 rounded-full bg-current"></div>
                  <div className="w-2 h-2 rounded-full bg-current"></div>
                  <div className="w-2 h-2 rounded-full bg-current"></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-12 max-w-2xl mx-auto">
            <div className="p-6 bg-red-50 border-r-4 border-red-500 rounded-2xl shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xl">!</span>
                </div>
                <p className="text-red-700 font-semibold text-lg">{error}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default Reports;