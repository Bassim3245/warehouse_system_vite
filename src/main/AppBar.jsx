import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { getToken, getUserInformation } from "../utils/handelCookie";
import OtherApplication from "./Appliction";
import DrobMenueAuth from "../components/Layout/DrobMenueAuth";
import { useDispatch } from "react-redux";
import { LogIn, Menu, X, Home, BarChart3, Grid3X3, Phone, ChevronLeft } from "lucide-react";

const AppbarHeader = () => {
  const dataUserById = getUserInformation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const token = getToken();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  // ===== Effects =====
  
  // Handle navbar scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    if (mobileMenuOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen]);

  // ===== Navigation Configuration =====
  
  const navLinks = [
    { label: "الرئيسية", href: "/", icon: Home },
    { label: "الإحصائيات", href: "#reports", icon: BarChart3 },
    { label: "التصنيفات", href: "#categories", icon: Grid3X3 },
    { label: "اتصل بنا", href: "#footer", icon: Phone },
  ];

  // ===== Handlers =====
  
  const handleNavClick = (href) => {
    setMobileMenuOpen(false);
    // Smooth scroll to section
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // ===== Render Helper Components =====

  const UserAvatar = ({ size = "default" }) => {
    const sizeClasses = {
      small: "w-10 h-10",
      default: "w-10 h-10 lg:w-12 lg:h-12",
      large: "w-14 h-14"
    };

    return (
      <div className="relative">
        <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg ring-2 ring-white transition-all duration-300 hover:ring-blue-200 hover:shadow-xl ${size === 'default' ? 'text-sm lg:text-lg' : 'text-lg'}`}>
          {dataUserById?.Entities_name?.charAt(0).toUpperCase() || "U"}
        </div>
        {/* Online Status Indicator */}
        <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
      </div>
    );
  };

  const BrandLogo = () => (
    <div className="flex items-center gap-2 cursor-pointer group">
      <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300">
        <span className="text-white font-bold text-xl lg:text-2xl">م</span>
      </div>
      <span className="hidden md:block text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
        إدارة الخزين
      </span>
    </div>
  );

  const NavLink = ({ link, onClick }) => {
    const Icon = link.icon;
    return (
      <a
        href={link.href}
        onClick={(e) => {
          e.preventDefault();
          onClick?.(link.href);
        }}
        className="group relative px-5 py-2.5 text-slate-600 hover:text-blue-600 font-semibold transition-all duration-200"
      >
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
          <span>{link.label}</span>
        </div>
        {/* Animated underline */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-600 group-hover:w-3/4 transition-all duration-300"></div>
      </a>
    );
  };

  const MobileNavLink = ({ link, onClick }) => {
    const Icon = link.icon;
    return (
      <a
        href={link.href}
        onClick={(e) => {
          e.preventDefault();
          onClick?.(link.href);
        }}
        className="flex items-center gap-4 px-4 py-3.5 text-slate-700 hover:text-blue-600 hover:bg-blue-50 rounded-xl font-semibold transition-all duration-200 group"
      >
        <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-slate-100 group-hover:bg-blue-100 transition-colors duration-200">
          <Icon className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
        </div>
        <span className="flex-1">{link.label}</span>
        <ChevronLeft className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
      </a>
    );
  };

  // ===== Main Render =====

  return (
    <>
      {/* Main Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 backdrop-blur-md shadow-lg"
            : "bg-white/80 backdrop-blur-sm shadow-md"
        }`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            
            {/* Left Section - Logo/User */}
            <div className="flex items-center gap-4 min-w-0 flex-shrink-0">
              {token ? (
                <div className="flex items-center gap-3 group cursor-pointer">
                  <UserAvatar />
                  
                  {/* User Info - Desktop Only */}
                  <div className="hidden md:flex flex-col min-w-0">
                    <span className="text-sm text-slate-500 font-medium">مرحباً بك</span>
                    <span className="text-slate-800 font-bold truncate max-w-[180px] group-hover:text-blue-600 transition-colors">
                      {dataUserById?.Entities_name}
                    </span>
                  </div>
                </div>
              ) : (
                <BrandLogo />
              )}
            </div>

            {/* Center Section - Desktop Navigation */}
            {!token && (
              <div className="hidden lg:flex items-center gap-2 flex-1 justify-center">
                {navLinks.map((link, index) => (
                  <NavLink key={index} link={link} onClick={handleNavClick} />
                ))}
              </div>
            )}

            {/* Right Section - Actions */}
            <div className="flex items-center gap-3 flex-shrink-0">
              {!token ? (
                <>
                  {/* Login Button */}
                  <button
                    onClick={() => navigate("/login")}
                    className="group relative px-5 py-2.5 lg:px-8 lg:py-3 bg-gradient-primary text-white rounded-xl font-bold shadow-lg hover:shadow-xl overflow-hidden transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
                    aria-label={t("تسجيل الدخول")}
                  >
                    {/* Hover Effect Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    
                    <div className="relative flex items-center gap-2">
                      <LogIn className="w-4 h-4 lg:w-5 lg:h-5 group-hover:rotate-12 transition-transform duration-200" />
                      <span className="hidden sm:inline">{t("تسجيل الدخول")}</span>
                      <span className="sm:hidden">{t("دخول")}</span>
                    </div>
                  </button>
                  
                  {/* Mobile Menu Toggle */}
                  <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="lg:hidden p-2.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200"
                    aria-label="Toggle mobile menu"
                    aria-expanded={mobileMenuOpen}
                  >
                    {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                  </button>
                </>
              ) : (
                <>
                  {/* Logged In Actions - Desktop */}
                  <div className="hidden md:flex items-center gap-2">
                    <OtherApplication navigate={navigate} />
                    <DrobMenueAuth dispatch={dispatch} navigate={navigate} />
                  </div>
                  
                  {/* Mobile Menu Toggle for Logged Users */}
                  <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="md:hidden p-2.5 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200"
                    aria-label="Toggle mobile menu"
                    aria-expanded={mobileMenuOpen}
                  >
                    {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          ></div>

          {/* Menu Panel */}
          <div className="absolute top-16 left-0 right-0 mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-top duration-300">
            
            {/* User Profile Section - Mobile (Logged In) */}
            {token && (
              <div className="p-6 bg-gradient-to-r from-blue-500 to-indigo-600">
                <div className="flex items-center gap-4">
                  <UserAvatar size="large" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white/80 font-medium">مرحباً بك</p>
                    <p className="text-white font-bold text-lg truncate">
                      {dataUserById?.Entities_name}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Links - Mobile (Not Logged In) */}
            {!token && (
              <div className="p-4 space-y-1">
                {navLinks.map((link, index) => (
                  <MobileNavLink key={index} link={link} onClick={handleNavClick} />
                ))}
              </div>
            )}

            {/* Mobile Actions for Logged Users */}
            {token && (
              <div className="p-4 border-t border-slate-100">
                <div className="flex flex-col gap-3">
                  <OtherApplication navigate={navigate} />
                  <DrobMenueAuth dispatch={dispatch} navigate={navigate} />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default AppbarHeader;