import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import {
  Package,
  BarChart3,
  ArrowLeft,
  Play,
  Sparkles,
  Headset,
  Warehouse,
  ArrowRight,
} from "lucide-react";

function Home({ BackendUrl }) {
  const [aboutSystem, setAboutSystem] = useState([]);
  const [loaded, setLoaded] = useState(false);

  const navigate = useNavigate();

  const fetchBannerData = async () => {
    try {
      const response = await axios.get(`${BackendUrl}/api/getDataAbout`);
      setAboutSystem(response?.data?.response);
      setLoaded(true);
    } catch (error) {
      console.error(error?.response?.data?.message);
      setLoaded(true);
    }
  };

  useEffect(() => {
    fetchBannerData();
  }, []);

  // System Features
  const features = [
    {
      icon: Package,
      title: "إدارة المواد الراكدة",
      description: "تتبع وإدارة المواد غير المستخدمة بكفاءة عالية وتحسين استغلال الموارد",
    },
    {
      icon: Warehouse,
      title: "إدارة الخزين",
      description: "رصد وتحليل المواد ذات معدل الدوران المنخفض واتخاذ الإجراءات المناسبة لتحسين الاستفادة منها",
    },

    {
      icon: BarChart3,
      title: "تقارير تفصيلية",
      description: "إحصائيات شاملة ومؤشرات أداء واضحة لدعم اتخاذ القرار",
    },

    {
      icon: Headset,
      title: "الدعم الفني وخدمات الصيانة",
      description: "تقديم خدمات دعم فني وصيانة دورية لضمان استمرارية عمل نظام الخزين",
    },
  ];

  // Stats
  const stats = [
    { number: "500+", label: "مخزن حكومي" },
    { number: "50K+", label: "صنف مادة" },
    { number: "99.9%", label: "نسبة الموثوقية" },
    { number: "24/7", label: "دعم متواصل" },
  ];



  return (
    <div className="overflow-hidden font-arabic">
      {/* ========== Hero Section ========== */}
      <section className="relative bg-gradient-primary text-white section-padding min-h-screen flex items-center">
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black opacity-10"></div>

        {/* Floating Orbs */}
        <div className="absolute -top-4 -right-4 w-72 h-72 bg-white/10 rounded-full blur-[80px]"></div>
        <div className="absolute -bottom-4 -left-4 w-72 h-72 bg-emerald-500/20 rounded-full blur-[80px]"></div>
        <div className="absolute top-20 right-20 w-16 h-16 bg-white/10 rounded-full hidden lg:block animate-float"></div>
        <div className="absolute bottom-20 left-20 w-12 h-12 bg-emerald-500/20 rounded-full hidden lg:block animate-float-reverse"></div>

        <div className="container-max relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* ===================== Content Side ===================== */}
            <div
              className={`transition-all duration-800 ${loaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
                }`}
            >
              {/* ===== Badge ===== */}
              <div
                className={`badge-glass mb-6 transition-all duration-500 delay-200 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
                  }`}
              >
                <Sparkles className="w-4 h-4 ml-2 text-yellow-300" />
                <span>نظام خزن حكومي ذكي</span>
              </div>

              {/* ===== Title ===== */}
              <h1
                className={`text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 transition-all duration-500 delay-400 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
                  }`}
              >
                نظام الخزين
              </h1>

              {/* ===== Description ===== */}
              <p
                className={`text-xl text-white/90 mb-8 leading-relaxed transition-all duration-500 delay-600 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
                  }`}
              >
                منصة إلكترونية متكاملة لإدارة الخزن والمخازن الحكومية،
                تُعنى بتنظيم ومتابعة المواد والموجودات داخل المستودعات،
                وتدعم عمليات الإدخال والصرف وإعداد التقارير والتحليل الإحصائي،
                بما يسهم في تحسين كفاءة إدارة المخزون ودعم اتخاذ القرار.
              </p>

              {/* ===== Buttons ===== */}
              <div
                className={`flex flex-col sm:flex-row gap-4 transition-all duration-500 delay-800 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
                  }`}
              >
                <Link to="/login" className="bg-white btn-primary gap-2">
                  <span>الدخول إلى النظام</span>
                  <ArrowLeft className="w-5 h-5" />
                </Link>

                <button
                  onClick={() => navigate('/about-page')}
                  className="btn-secondary gap-2"
                >
                  <Play className="w-5 h-5" />
                  <span>عن نظام الخزين</span>
                </button>
              </div>
            </div>
            {/* =================== End Content Side =================== */}

            {/* Image Side */}
            <div className={`relative transition-all duration-800 delay-400 ${loaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`}>
              <div className="relative z-10">
                <img
                  src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80"
                  alt="نظام إدارة المخازن"
                  className="rounded-2xl shadow-2xl w-full"
                />
              </div>
              {/* Decorative Orbs behind image */}
              <div className="absolute -top-4 -right-4 w-72 h-72 bg-white/10 rounded-full blur-[60px]"></div>
              <div className="absolute -bottom-4 -left-4 w-72 h-72 bg-emerald-500/20 rounded-full blur-[60px]"></div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== Features Section ========== */}
      <section className="section-padding bg-[#f8fafc]">
        <div className="container-max">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1e3a8a] mb-4">
              مميزات النظام
            </h2>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="card text-center group hover:shadow-2xl"
                >
                  <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#1e3a8a] mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>


      {/* ========== About System ========== */}
      {aboutSystem?.length > 0 && (
        <section className="w-full py-16 md:py-24 bg-gradient-primary">
          <div className="w-full px-4 md:px-8 lg:px-16 xl:px-24">

            {/* ===== Section Header ===== */}
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                عن النظام
              </h2>
              <div className="w-24 h-1 bg-white/80 mx-auto rounded-full"></div>
            </div>

            {/* ===== Cards Flex Container ===== */}
            <div className="flex flex-col lg:flex-row gap-6 mb-12">
              {aboutSystem.map((item, index) => (
                <div
                  key={item?.id}
                  className="flex-1 group relative overflow-hidden rounded-3xl bg-white/5 backdrop-blur-sm border border-white/20 hover:border-white/40 transition-all duration-500 hover:shadow-2xl"
                >
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                  {/* Content */}
                  <div className="relative p-8 md:p-10 flex flex-col h-full">
                    {/* Number Badge */}
                    <div className="absolute top-6 left-6 w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white font-bold text-xl border border-white/30">
                      {index + 1}
                    </div>

                    {/* Title */}
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-6 mt-8">
                      {item?.title}
                    </h3>

                    {/* Divider */}
                    <div className="w-16 h-1 bg-gradient-to-r from-white/60 to-transparent rounded-full mb-6"></div>

                    {/* Description */}
                    <p className="text-white/85 text-base md:text-lg leading-relaxed flex-grow">
                      {item?.text}
                    </p>

                    {/* Bottom Accent */}
                    <div className="mt-6 flex items-center gap-2 text-white/60 group-hover:text-white/90 transition-colors duration-300">
                      <div className="w-2 h-2 rounded-full bg-white/60"></div>
                      <div className="w-4 h-2 rounded-full bg-white/40"></div>
                      <div className="w-6 h-2 rounded-full bg-white/20"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ===== More Button ===== */}
            <div className="flex justify-center">
              <Link
                to="/about-page"
                className="group inline-flex items-center gap-3 text-white font-bold text-lg px-10 py-4 rounded-full bg-white/10 backdrop-blur-md border-2 border-white/30 hover:bg-white hover:text-[#1e3a8a] transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105"
              >
                <span>اكتشف المزيد</span>
                <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>

          </div>
        </section>
      )}
    </div>
  );
}

export default Home;
