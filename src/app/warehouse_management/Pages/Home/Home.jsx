import { useMemo } from "react";
import { motion } from "framer-motion";
import logo from "../../../../assets/image/1671635909.png";
import "../../../../main/main.css";

// Icons
import {
  Package,
  BarChart3,
  Zap,
  Warehouse,
  TrendingUp,
  Shield
} from "lucide-react";

function HomeWarehouse() {
  // Features data
  const features = useMemo(
    () => [
      {
        icon: Package,
        title: "إدارة شاملة للمخزون",
        description: "تتبع دقيق للكميات والمواقع مع نظام تنبيهات متقدم"
      },
      {
        icon: BarChart3,
        title: "تقارير تفصيلية",
        description: "تحليلات متقدمة وتقارير شاملة لدعم القرارات"
      },
      {
        icon: Zap,
        title: "سرعة الأداء",
        description: "نظام سريع وموثوق للعمليات اليومية"
      }
    ],
    []
  );

  // Stats data
  const stats = useMemo(
    () => [
      { value: "+1000", label: "مادة مسجلة", icon: Package },
      { value: "+50", label: "مخزن", icon: Warehouse },
      { value: "+200", label: "تقرير شهري", icon: TrendingUp }
    ],
    []
  );

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const fadeInLeft = {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6 } }
  };

  const fadeInRight = {
    hidden: { opacity: 0, x: 30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  return (
    <div className="min-h-screen font-arabic" dir="rtl">
      {/* Hero Section - Light Theme */}
      <section className="relative min-h-screen flex items-center bg-[#FAFAFA] overflow-hidden">

        {/* Background Decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Gradient Blobs */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#1e6a99]/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#1e6a99]/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-[#1e6a99]/5 rounded-full blur-2xl"></div>

          {/* Grid Pattern */}
          <div className="absolute inset-0 opacity-30" style={{
            backgroundImage: "radial-gradient(#1e6a99 1px, transparent 1px)",
            backgroundSize: "40px 40px"
          }}></div>
        </div>

        {/* Content */}
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">

            {/* Right Section - Text + Features */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="flex-1 text-right"
            >
              <motion.div variants={fadeInRight} className="mb-6">
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-[#1e6a99]/10 rounded-full text-sm font-medium text-[#1e6a99] border border-[#1e6a99]/20">
                  <Shield className="w-4 h-4" />
                  نظام موثوق وآمن
                </span>
              </motion.div>

              <motion.h1
                variants={fadeInRight}
                className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-gray-900"
              >
                مرحباً بك في نظام{" "}
                <span className="text-[#1e6a99]">إدارة المخازن</span>{" "}
                المتكامل
              </motion.h1>

              <motion.p
                variants={fadeInRight}
                className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed max-w-2xl"
              >
                نظام متكامل يساعدك في إدارة مخزونك بكفاءة عالية وتحكم كامل
              </motion.p>

              {/* Features List */}
              <motion.div variants={staggerContainer} className="space-y-4">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    variants={fadeInRight}
                    className="group flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-[#1e6a99]/30 hover:-translate-x-2 transition-all duration-300 cursor-pointer"
                  >
                    <div className="w-14 h-14 rounded-xl bg-[#1e6a99]/10 flex items-center justify-center group-hover:bg-[#1e6a99] transition-colors duration-300">
                      <feature.icon className="w-7 h-7 text-[#1e6a99] group-hover:text-white transition-colors duration-300" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{feature.title}</h3>
                      <p className="text-gray-500 text-sm">{feature.description}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Left Section - Logo Card */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeInLeft}
              className="flex-shrink-0"
            >
              <div className="relative">
                {/* Glow Effect */}
                <div className="absolute -inset-4 bg-[#1e6a99]/20 rounded-3xl blur-2xl"></div>

                {/* Main Card */}
                <div className="relative w-80 h-80 bg-gradient-to-br from-[#1e6a99] to-[#155a7a] rounded-3xl shadow-2xl flex flex-col items-center justify-center p-8 border border-white/20">
                  {/* Logo */}
                  <motion.div
                    animate={{
                      y: [0, -10, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="mb-4"
                  >
                    <img src={logo} alt="Logo" className="w-32 h-32 object-contain" />
                  </motion.div>

                  <h2 className="text-2xl font-bold text-white mb-2">نظام المخازن</h2>
                  <p className="text-white/90 text-center text-sm">الحل الأمثل لإدارة مخزونك</p>

                  {/* Decorative Lines */}
                  <div className="absolute top-4 left-4 w-8 h-1 bg-white/30 rounded-full"></div>
                  <div className="absolute top-4 left-4 w-1 h-8 bg-white/30 rounded-full"></div>
                  <div className="absolute bottom-4 right-4 w-8 h-1 bg-white/30 rounded-full"></div>
                  <div className="absolute bottom-4 right-4 w-1 h-8 bg-white/30 rounded-full"></div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Stats Section */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:border-[#1e6a99]/30 transition-all duration-300 group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#1e6a99]/10 flex items-center justify-center group-hover:bg-[#1e6a99] transition-colors duration-300">
                    <stat.icon className="w-6 h-6 text-[#1e6a99] group-hover:text-white transition-colors duration-300" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-[#1e6a99]">{stat.value}</div>
                    <div className="text-gray-500 text-sm">{stat.label}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default HomeWarehouse;
