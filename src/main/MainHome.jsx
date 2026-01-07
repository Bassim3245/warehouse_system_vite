import { useRef, useCallback, useState, useEffect } from "react";
import "./main.css"; // Tailwind CSS for main pages
import Reports from "./BannerAndReports/Reports";
import Banner from "./BannerAndReports/Banner";
import Footer from "./Footer/Footer";
import AppbarHeader from "./AppBar";
import { BackendUrl } from "../redux/api/axios";
import Home from "./Home";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getPermissions } from "../utils/handelCookie";

// Icons
import { Settings } from "lucide-react";

function MainHome({ header = true }) {
  const homeRef = useRef(null);
  const reportsRef = useRef(null);
  const categoryRef = useRef(null);
  const footerRef = useRef(null);
  const bannerSectionRef = useRef(null);

  const navigate = useNavigate();
  const { t } = useTranslation();
  const getPermissionsApplication = getPermissions();

  // State to track if we should show fixed banner or not
  const [showFixedBanner, setShowFixedBanner] = useState(true);

  // Check user permissions
  const hasPermission = useCallback(
    (applicationId) => {
      const permissions =
        getPermissionsApplication?.length > 0 ? getPermissionsApplication : [];
      return permissions?.some(
        (permission) =>
          Number(permission?.user_id_application__permission_id) ===
          Number(applicationId)
      );
    },
    [getPermissionsApplication]
  );

  // Scroll to specific section
  const scrollToRef = (ref) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Detect when user scrolls near the banner section (before footer)
  useEffect(() => {
    const handleScroll = () => {
      if (bannerSectionRef.current) {
        const bannerRect = bannerSectionRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        // When the static banner section is visible in viewport, hide the fixed banner
        if (bannerRect.top < windowHeight && bannerRect.bottom > 0) {
          setShowFixedBanner(false);
        } else {
          setShowFixedBanner(true);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check initial state

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="font-arabic" dir="rtl">
      {/* Header Navigation */}
      {header && <AppbarHeader />}

      {/* Hero + Features + Stats + CTA (all in Home component now) */}
      <Home
        BackendUrl={BackendUrl}
        scrollToRef={scrollToRef}
        reportsRef={reportsRef}
      />

      <Reports BackendUrl={BackendUrl} />

      {/* Category Section */}
      {/* <Category BackendUrl={BackendUrl} /> */}

      {/* Fixed Bottom Banner - Hidden when near footer */}
      {/* <div
        className={`fixed bottom-0 left-0 right-0 z-50 transition-all duration-300 ${showFixedBanner
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-full pointer-events-none"
          }`}
      >
        <Banner BackendUrl={BackendUrl} isFixed={true} />
      </div> */}

      {/* Static Banner Section - Shows when scrolled to this area */}
      {/* <div ref={bannerSectionRef} className="pb-4">
        <Banner BackendUrl={BackendUrl} isFixed={false} />
      </div> */}

      {/* Footer Section */}
      <Footer
        homeRef={() => scrollToRef(homeRef)}
        reportsRef={() => scrollToRef(reportsRef)}
        categoryRef={() => scrollToRef(categoryRef)}
        footerRef={() => scrollToRef(footerRef)}
      />

      {/* Platform Management FAB */}
      {hasPermission(3) && (
        <button
          onClick={() => navigate("/platform-management")}
          className={`fixed left-6 z-50 w-14 h-14 rounded-xl bg-white text-[#1e3a8a] shadow-2xl hover:shadow-xl hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center group ${showFixedBanner ? "bottom-28" : "bottom-6"
            }`}
          title={t("أدارة المنصة")}
        >
          <Settings className="w-6 h-6 group-hover:rotate-90 transition-transform duration-500" />
        </button>
      )}
    </div>
  );
}

export default MainHome;
