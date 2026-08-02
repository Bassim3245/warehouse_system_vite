import imageObsolete from "../../../../assets/image/obesoleteMatrial.png";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import axios from "axios";
import Loader from "../../../../components/reusableComponent/Loader";
import ArrowBackIosNew from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIos from "@mui/icons-material/ArrowForwardIos";
import AOS from "aos";
import "aos/dist/aos.css";
import HeaderCenter from "../../../../components/reusableComponent/HeaderCenterComponent";
import { getToken } from "../../../../utils/handelCookie";
import "./Category.css";
import { BackendUrFile } from "../../../../redux/api/axios";

function Category({ BackendUrl }) {
  const [dataMainClass, setDataMainClass] = useState([]);
  const [allDataMainClass, setAllDataMainClass] = useState([]);
  const [loading, setLoading] = useState(false);
  const [visibleCount, setVisibleCount] = useState(
    window.innerWidth < 768 ? 3 : 5
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();
  // Fetch data from the backend
  const fetchMainClassData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BackendUrl}/api/getDataMainClass`);
      setAllDataMainClass(response?.data?.response);
      setDataMainClass(response?.data?.response.slice(0, visibleCount));
    } catch (error) {
      console.error(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchMainClassData();
  }, [visibleCount]);
  const token = getToken();
  // Handle 'load more' button click
  const handleLoadMore = () => {
    const newIndex = currentIndex + visibleCount;
    const newVisibleItems = allDataMainClass.slice(
      newIndex,
      newIndex + visibleCount
    );
    setDataMainClass(newVisibleItems);
    setCurrentIndex(newIndex);
    AOS.refresh(); // Trigger AOS refresh to animate newly loaded items
  };

  // Handle 'load less' button click
  const handleLoadLess = () => {
    const newIndex = Math.max(currentIndex - visibleCount, 0);
    const newVisibleItems = allDataMainClass.slice(
      newIndex,
      newIndex + visibleCount
    );
    setDataMainClass(newVisibleItems);
    setCurrentIndex(newIndex);
    AOS.refresh(); // Trigger AOS refresh to animate newly loaded items
  };

  // Initialize AOS for animations
  useEffect(() => {
    AOS.init({ duration: 800, once: false, offset: 200 });
  }, []);

  // Update visible count on window resize
  useEffect(() => {
    const updateVisibleCount = () => {
      setVisibleCount(window.innerWidth < 768 ? 2 : 5);
    };
    window.addEventListener("resize", updateVisibleCount);
    return () => window.removeEventListener("resize", updateVisibleCount);
  }, []);

  return (
    <>
      {loading && <Loader />}
      <div
        className="services pt-4"
        // style={{ overflow: "hidden" }}
        id="services"
      >
        <HeaderCenter title="التصنيفات" typeHeader="h4" />
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* Back button */}

          {currentIndex > 0 && (
            <IconButton onClick={handleLoadLess}>
              <ArrowBackIosNew />
            </IconButton>
          )}

          {/* Card container */}
          <div className="container containerDisplay">
            {dataMainClass?.map((item, index) => (
              <div
                className="cardHomeBag"
                key={index}
                data-aos="zoom-in-down"
                data-aos-offset="200"
              >
                <Link to={`/Product-Obsolete/${item?.mainClass_id}`}>
                  <div
                    style={{
                      width: "200px",
                      maxWidth: "100%",
                      height: "200px",
                      maxHeight: "100%",
                    }}
                  >
                    <div
                      className="bg-image hover-zoom ripple ripple-surface ripple-surface-light BoxImage"
                      data-mdb-ripple-color="light"
                    >
                      {item?.file_name ? (
                        <Link to={`/Product-Obsolete/${item?.mainClass_id}`}>
                          <img
                            src={`${BackendUrFile}/${item?.file_name}`}
                            className="ImageProduct"
                            alt={item?.main_Class_name}
                          />
                        </Link>
                      ) : (
                        <Link to={`/Product-Obsolete/${item?.mainClass_id}`}>
                          <div className="d-flex justify-content-center align-items-center BoxImageEmpty">
                            <img
                              src={imageObsolete}
                              className="emptyImage"
                              alt={item?.main_Class_name}
                            />
                          </div>
                        </Link>
                      )}
                    </div>
                  </div>
                  <div
                    className="card-body text-center"
                    style={{ height: "50px" }}
                  >
                    <p className="text-reset hidden-text">
                      {item?.main_Class_name}
                    </p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
          {/* Forward button */}
          {currentIndex + visibleCount < allDataMainClass.length && (
            <IconButton onClick={handleLoadMore}>
              <ArrowForwardIos />
            </IconButton>
          )}
        </Box>
        {!token && (
          <div className="container mt-3">
            <Button
              onClick={() => {
                navigate("/All-Category");
              }}
            >
              أستكشاف المزيد
            </Button>
          </div>
        )}
      </div>
    </>
  );
}

export default Category;
