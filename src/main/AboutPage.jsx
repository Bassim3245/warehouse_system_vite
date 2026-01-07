import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import imageCompany from "../assets/image/DSC02984.JPG";
import image2 from "../assets/image/8.jpg";
import image3 from "../assets/image/1.jpg";
import AppbarHeader from "./AppBar";
import Footer from "./Footer/Footer";
import { getToken } from "../utils/handelCookie";
import "./main.css";

// Icons
import {
  CheckCircle2,
  Target,
  Users,
  Award,
  ArrowLeft,
  Sparkles
} from "lucide-react";

function AboutPage() {
  const { t } = useTranslation();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(true);
  }, []);

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
      transition: { staggerChildren: 0.2 }
    }
  };

  // Features data
  const features = [
    {
      icon: Target,
      title: "رؤيتنا",
      description: "نسعى لتقديم حلول تقنية متكاملة لإدارة المخازن بكفاءة وفعالية عالية"
    },
    {
      icon: Users,
      title: "فريقنا",
      description: "فريق متخصص من المهندسين والمطورين ذوي الخبرة في مجال نظم المعلومات"
    },
    {
      icon: Award,
      title: "جودتنا",
      description: "نلتزم بأعلى معايير الجودة في تطوير وتشغيل أنظمتنا التقنية"
    }
  ];

  return (
    <div className="font-arabic min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      {!getToken() && <AppbarHeader />}

      {/* Hero Section */}
      <section className="relative bg-gradient-primary text-white py-20 md:py-32 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 left-10 w-48 h-48 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="text-center max-w-4xl mx-auto"
          >
         

            <motion.h1
              variants={fadeInUp}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
            >
              من نحن
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-lg md:text-xl text-white/90 leading-relaxed max-w-2xl mx-auto"
            >
              نظام متكامل لإدارة الخزين والمواد الراكدة، نوفر حلولاً تقنية متطورة
              لتسهيل عمليات إدارة المخازن بكفاءة عالية
            </motion.p>
          </motion.div>
        </div>

        {/* Wave Bottom */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" className="w-full h-auto">
            <path fill="#f9fafb" d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,64C960,75,1056,85,1152,80C1248,75,1344,53,1392,42.7L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"></path>
          </svg>
        </div>
      </section>

      {/* About Content Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Text Content */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInRight}
              className="order-2 lg:order-1"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#1e6a99]/10 rounded-full mb-6">
                <div className="w-2 h-2 rounded-full bg-[#1e6a99]"></div>
                <span className="text-[#1e6a99] font-medium text-sm">معلومات عنا</span>
              </div>

              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                نظام إدارة الخزين والمواد الراكدة
              </h2>

              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                نحن نقدم نظاماً متكاملاً لإدارة المخازن والمستودعات، يساعد على تتبع
                المواد الراكدة وتحسين عمليات الجرد والتخزين. تم تصميم النظام ليكون
                سهل الاستخدام ويوفر تقارير دقيقة وشاملة.
              </p>

              {/* Feature List */}
              <div className="space-y-4 mb-8">
                {[
                  "إدارة شاملة للمخازن والمستودعات",
                  "تتبع المواد الراكدة والقديمة",
                  "تقارير تفصيلية ولحظية",
                  "واجهة سهلة الاستخدام"
                ].map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3 group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#1e6a99]/10 flex items-center justify-center group-hover:bg-[#1e6a99] transition-colors duration-300">
                      <CheckCircle2 className="w-5 h-5 text-[#1e6a99] group-hover:text-white transition-colors duration-300" />
                    </div>
                    <span className="text-gray-700 font-medium">{item}</span>
                  </motion.div>
                ))}
              </div>

             
            </motion.div>

            {/* Images Grid */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInLeft}
              className="order-1 lg:order-2"
            >
              <div className="grid grid-cols-2 gap-4">
                {/* Main Image */}
                <div className="col-span-2 md:col-span-1 md:row-span-2">
                  <div className="relative group overflow-hidden rounded-2xl shadow-xl h-full min-h-[300px]">
                    <img
                      src={imageCompany}
                      alt="About Company"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </div>

                {/* Secondary Images */}
                <div className="col-span-1">
                  <div className="relative group overflow-hidden rounded-2xl shadow-xl h-[140px] md:h-[180px]">
                    <img
                      src={image2}
                      alt="About Image 2"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </div>

                <div className="col-span-1">
                  <div className="relative group overflow-hidden rounded-2xl shadow-xl h-[140px] md:h-[180px]">
                    <img
                      src={image3}
                      alt="About Image 3"
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </div>

             
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2
              variants={fadeInUp}
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            >
              لماذا نحن؟
            </motion.h2>
            <motion.div
              variants={fadeInUp}
              className="w-24 h-1 bg-[#1e6a99] mx-auto rounded-full"
            ></motion.div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                className="group bg-gray-50 hover:bg-[#1e6a99] rounded-2xl p-8 text-center transition-all duration-500 hover:shadow-2xl"
              >
                <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-[#1e6a99]/10 group-hover:bg-white/20 flex items-center justify-center transition-all duration-500">
                  <feature.icon className="w-8 h-8 text-[#1e6a99] group-hover:text-white transition-colors duration-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-white mb-4 transition-colors duration-500">
                  {feature.title}
                </h3>
                <p className="text-gray-600 group-hover:text-white/90 leading-relaxed transition-colors duration-500">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>


      {/* Footer */}
      <Footer />
    </div>
  );
}

export default AboutPage;
