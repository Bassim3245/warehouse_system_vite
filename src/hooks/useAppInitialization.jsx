import { useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import { setscreenwidth } from "../redux/windoScreen/settingDataSlice";
import {
  initPerformanceOptimizations,
  throttle,
} from "../utils/performanceOptimizer";
import Aos from "aos";

/**
 * Custom hook for app initialization
 * This hook handles performance optimizations, screen width tracking, and AOS initialization
 */
const useAppInitialization = () => {
  const dispatch = useDispatch();

  // // Initialize performance optimizations
  useEffect(() => {
    initPerformanceOptimizations();
  }, []);

  // Throttled resize handler for better performance
  const dispatchScreen = useCallback(() => dispatch(setscreenwidth(window.innerWidth))
    , [dispatch])
  useEffect(() => {
    dispatchScreen()
    const handleResize = throttle(() => {

    }, 100);

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [dispatchScreen]);

  // Initialize AOS with performance-optimized settings
  useEffect(() => {
    Aos.init({
      duration: 600,
      once: true, // Animation happens only once
      disable: "mobile", // Disable on mobile for better performance
    });
  }, []);
};

export default useAppInitialization;
