import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import axios from "axios";
import { BackendUrFile, BackendUrl } from "../../../../redux/api/axios";
import Loader from "../../../../components/reusableComponent/Loader";
import "aos/dist/aos.css";
import AutocompleteExample from "../../../../components/reusableComponent/AutoCompletSearch";
import imageObsolete from "../../../../assets/image/obesoleteMatrial.png";
import HeaderCenter from "../../../../components/reusableComponent/HeaderCenterComponent";
import Aos from "aos";
import { useTranslation } from "react-i18next";
import "./Category.css"

function AllCategory() {
  const [filterData, setFilteredData] = useState([]);
  const [allDataMainClass, setAllDataMainClass] = useState([]);
  const [loading, setLoading] = useState(null);
  const {t}=useTranslation()
  const fetchMainClassData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BackendUrl}/api/getDataMainClass`);
      setAllDataMainClass(response?.data?.response);
    } catch (error) {
      console.error(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchMainClassData();
  }, []);
  useEffect(() => {
    Aos.init({
      once: false,
      offset: 200,
      duration: 800,
      easing: 'ease-in-out',
    });
  }, []);

  return (
    <>
      {loading && <Loader />}
      <div className="services mt-0 pb-0 mb-3" id="services">
        <div 
          className="container containerDispla w-50"
          data-aos="fade-down"
          data-aos-delay="100"
        >
          <AutocompleteExample
            dataToSetFilter={allDataMainClass}
            filterData={filterData}
            setFilteredData={setFilteredData}
            getOption={(option) => option?.main_Class_name}
          />
        </div>
        
        <div data-aos="fade-up" data-aos-delay="200">
          <HeaderCenter title={t("layout.Main class")} typeHeader="h4" />
        </div>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            py: 4,
          }}
        >
          <div className="container containerDisplay">
            {filterData?.map((item, index) => (
              <div
                className="cardHomeBag"
                key={index}
                data-aos="zoom-in"
                data-aos-delay={100 + index * 50}
                style={{
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-10px)',
                  }
                }}
              >
                <div 
                  style={{ 
                    width: "200px", 
                    maxWidth: "100%",
                    height: "200px",
                    maxHeight: "100%",
                    borderRadius: "12px",
                    overflow: "hidden",
                    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                  }}
                >
                  <div
                    className="bg-image hover-zoom ripple ripple-surface ripple-surface-light BoxImage"
                    data-mdb-ripple-color="light"
                    style={{
                      height: "100%",
                      transition: "transform 0.3s ease-in-out",
                      "&:hover": {
                        transform: "scale(1.05)",
                      }
                    }}
                  >
                    {item?.file_name ? (
                      <Link 
                        to={`/Product-Obsolete/${item?.mainClass_id}`}
                        style={{ display: 'block', height: '100%' }}
                      >
                        <img
                          src={`${BackendUrFile}/${item?.file_name}`}
                          className="ImageProduct"
                          alt={item?.main_Class_name}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            transition: "transform 0.3s ease",
                          }}
                        />
                      </Link>
                    ) : (
                      <Link 
                        to={`/Product-Obsolete/${item?.mainClass_id}`}
                        style={{ display: 'block', height: '100%' }}
                      >
                        <div className="d-flex justify-content-center align-items-center BoxImageEmpty">
                          <img
                            src={imageObsolete}
                            className="emptyImage"
                            alt={item?.main_Class_name}
                            style={{
                              maxWidth: "80%",
                              maxHeight: "80%",
                              objectFit: "contain",
                            }}
                          />
                        </div>
                      </Link>
                    )}
                  </div>
                </div>
                <div
                  className="card-body text-center"
                  style={{ 
                    height: "50px",
                    padding: "1rem",
                    background: "rgba(255,255,255,0.9)",
                    backdropFilter: "blur(8px)",
                    borderRadius: "0 0 12px 12px",
                  }}
                >
                  <p 
                    className="text-reset hidden-text"
                    style={{
                      margin: 0,
                      fontSize: "1rem",
                      fontWeight: 500,
                      color: "#333",
                    }}
                  >
                    {item?.main_Class_name}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Box>
      </div>
    </>
  );
}

export default AllCategory;
