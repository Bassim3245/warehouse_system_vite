import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box"
import axios from "axios";
import Loader from "../../../components/Loader";
import { ArrowBackIosNew, ArrowForwardIos } from "@mui/icons-material";
import "aos/dist/aos.css"
function ProductGetByDate({ BackendUrl }) {
  const [dataMainClass, setDataMainClass] = useState([]);
  const [allDataMainClass, setAllDataMainClass] = useState([]); // Store all fetched data here
  const [loading, setLoading] = useState(null);
  const [visibleCount, setVisibleCount] = useState(window.innerWidth < 768 ? 2 : 5);
  const [currentIndex, setCurrentIndex] = useState(0);
  const fetchMainClassData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${BackendUrl}/api/getDataStagnantMaterialAllByMainClassIdCurrentMonth`
      );
      setAllDataMainClass(response?.data?.response); // Store all data here
      setDataMainClass(response?.data?.response.slice(0, visibleCount));
    } catch (error) {
      console.error(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchMainClassData();
  }, []);

  const handleLoadMore = () => {
    const newIndex = currentIndex + visibleCount;
    const newVisibleItems = allDataMainClass.slice(
      newIndex,
      newIndex + visibleCount
    );
    setDataMainClass(newVisibleItems);
    setCurrentIndex(newIndex);
  };
  const handleLoadLess = () => {
    const newIndex = Math.max(currentIndex - visibleCount, 0); // Ensure we don't go below index 0
    const newVisibleItems = allDataMainClass.slice(
      newIndex,
      newIndex + visibleCount
    );
    setDataMainClass(newVisibleItems);
    setCurrentIndex(newIndex);
  };

  useEffect(() => {
    const updateVisibleCount = () => {
      setVisibleCount(window.innerWidth < 768 ? 2 : 5);
    };
    updateVisibleCount(); // Initial call
    window.addEventListener('resize', updateVisibleCount);
    return () => window.removeEventListener('resize', updateVisibleCount);
  }, [window.innerWidth]);
  return (
    <>
      {loading && <Loader />}
      <div className=" services pt-4" id="services">
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {currentIndex > 0 && (
            <IconButton onClick={handleLoadLess}>
              <ArrowBackIosNew />
            </IconButton>
          )}
          <div className="container">
            {dataMainClass?.map((item, index) => (
              <div className="" key={item?.stagnant_id} data-aos="zoom-in-down">
                <div className="card" style={{ width: "200" }}>
                  <div
                    className="bg-image hover-zoom ripple ripple-surface ripple-surface-light BoxImage"
                    data-mdb-ripple-color="light"
                  >
                    <Link to={`/Product-Overview/${item?.stagnant_id}`}>
                      <img
                        className="ImageProduct  "
                        style={{ height: "150px" }}
                        src={`${BackendUrl}/${item?.images?.[0]?.file_name}`}
                      />
                    </Link>
                  </div>
                  <div className="card-body text-center" style={{ height: "150px" }}>
                    <a href="#" className="text-reset">
                      <h5 className="card-title mb-3">{item?.name_material}</h5>
                    </a>
                    <a href="#" className="text-reset">
                      <p>{item?.sub_class_name}</p>
                    </a>
                    <p>{item?.typ_material}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {currentIndex + visibleCount < allDataMainClass.length && (
            <IconButton onClick={handleLoadMore}>
              <ArrowForwardIos />
            </IconButton>
          )}
        </Box>
      </div>
    </>
  );
}

export default ProductGetByDate;
