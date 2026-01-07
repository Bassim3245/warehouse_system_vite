
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import  Box  from "@mui/material/Box";
import axios from "axios";
import { BackendUrFile, BackendUrl } from "../../redux/api/axios";
import "aos/dist/aos.css";
import imageObsolete from "../../assets/image/obesoleteMatrial.png";
import Aos from "aos";
import { useTranslation } from "react-i18next";
import "./Category.css"
import AppbarHeader from "../../main/AppBar";
import { getToken } from "../../utils/handelCookie";
import Loader from "../../components/reusableComponent/Loader";
import AutocompleteExample from "../../components/reusableComponent/AutoCompletSearch";
import HeaderCenter from "../../components/reusableComponent/HeaderCenterComponent";
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
    Aos.init({  once: false, offset: 200 });
  }, []);
  return (
    <>
       {!getToken() &&
      <AppbarHeader />
    }
      {loading && <Loader />}
      <div className="services mt-0 pb-0 mb-3" id="services">
        <div className="container containerDispla w-50">
          <AutocompleteExample
            dataToSetFilter={allDataMainClass}
            filterData={filterData}
            setFilteredData={setFilteredData}
            getOption={(option) => option?.main_Class_name} // Pass as getOption instead of getOptionLabel
          />
        </div>
        <HeaderCenter title={t("layout.Main class")} typeHeader="h4" />
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div className="container containerDisplay">
          {filterData?.map((item, index) => (
              <div
                className="cardHomeBag"
                key={index}
                data-aos="zoom-in-down"
                data-aos-offset="200"
              >
                <div style={{ width: "200px", maxWidth: "100%" ,height:"200px",maxHeight:"100%"}}>
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
              </div>
            ))}
          </div>
        </Box>
      </div>
    </>
  );
}

export default AllCategory;
