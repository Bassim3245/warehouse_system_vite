import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import logoImage from "../../assets/image/Picture2.jpg";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Linkedin,
  Globe,
} from "lucide-react";

const Footer = ({ homeRef, reportsRef, categoryRef }) => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: "الصفحة الرئيسية", onClick: homeRef },
    { name: "الإحصائيات", onClick: reportsRef },
    { name: "التصنيفات", onClick: categoryRef },
    { name: "اتصل بنا", onClick: null },
  ];

  const services = [
    { name: "إدارة المواد الراكدة", href: "#" },
    { name: "المواد بطيئة الحركة", href: "#" },
    { name: "التقارير والإحصائيات", href: "#" },
    { name: "إدارة المخازن", href: "#" },
  ];

  const contactInfo = [
    {
      icon: Mail,
      label: "البريد الإلكتروني",
      value: "info@mei.com.iq",
      href: "mailto:info@mei.com.iq",
    },
    {
      icon: Phone,
      label: "الهاتف",
      value: "009647700009498",
      href: "tel:009647700009498",
    },
    {
      icon: MapPin,
      label: "الموقع",
      value: "العراق - بغداد - شارع الصناعة",
      href: "#",
    },
  ];

  const socialLinks = [
    {
      name: "Twitter",
      href: "#",
      icon: <Twitter className="w-5 h-5 color-white" />,
    },
    {
      name: "LinkedIn",
      href: "#",
      icon: <Linkedin className="w-5 h-5 color-white" />,
    },
    {
      name: "Facebook",
      href: "#",
      icon: <Facebook className="w-5 h-5 color-white" />,
    },
    {
      name: "Website",
      href: "#",
      icon: <Globe className="w-5 h-5 color-white" />,
    },
  ];

  return (
    <footer className="bg-gradient-primary text-white">
      <div className="container-max section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Company Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white/10 rounded-lg p-2 flex items-center justify-center">
                <img
                  src={logoImage}
                  alt="Logo"
                  className="w-full h-full object-contain rounded"
                />
              </div>
              <span className="text-xl font-bold">نظام الخزين</span>
            </div>
            <p className="text-[#cbd5e1] mb-6 max-w-md leading-relaxed">
              منصة إلكترونية متكاملة لإدارة ومراقبة المواد الراكدة وبطيئة الحركة في المؤسسات الحكومية العراقية
            </p>
            <div className="flex gap-3">
              {socialLinks.map((item) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 bg-[#fff] rounded-lg flex items-center justify-center hover:bg-[#1e6a99] hover:text-white transition-colors ease-in-out duration-200"
                >
                  {item.icon}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold mb-4">روابط سريعة</h3>
            <ul className="space-y-2">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.href}
                    className="text-[#cbd5e1] hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Services */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold mb-4">خدماتنا</h3>
            <ul className="space-y-2">
              {services.map((service, index) => (
                <li key={index}>
                  <Link
                    to={service.href}
                    className="text-[#cbd5e1] hover:text-white transition-colors duration-200"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-8 pt-8 border-t border-[#1e40af]"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {contactInfo.map((item, index) => {
              const Icon = item.icon;
              return (
                <a
                  key={index}
                  href={item.href}
                  className="flex items-center gap-3 text-[#cbd5e1] hover:text-white transition-colors duration-200"
                >
                  <Icon className="w-5 h-5" />
                  <div>
                    <div className="text-sm font-medium">{item.label}</div>
                    <div className="text-sm">{item.value}</div>
                  </div>
                </a>
              );
            })}
          </div>
        </motion.div>

        {/* Copyright */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-8 pt-8 border-t border-[#1e40af] text-center"
        >
          <p className="text-[#cbd5e1] text-sm">
            &copy; {currentYear} الشركة العامة للأنظمة الالكترونية العراقية. جميع الحقوق محفوظة.
          </p>
        </motion.div>
      </div>

      {/* Spacer for Banner */}
      <div className="h-20 md:h-24"></div>
    </footer>
  );
};

export default Footer;