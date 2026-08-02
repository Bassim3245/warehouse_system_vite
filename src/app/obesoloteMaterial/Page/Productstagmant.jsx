import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { BackendUrl } from "../../../redux/api/axios";
import { useEffect, useState } from "react";
import { CustomNoRowsOverlay, isImageFile } from "../../../utils/Function";
import HeaderCenter from "../../../components/reusableComponent/HeaderCenterComponent";
import { Autocomplete, Box, TextField, useTheme } from "@mui/material";
import { useSelector } from "react-redux";
import Loader from "../../../components/reusableComponent/Loader";
import { getUserInformation } from "../../../utils/handelCookie";
import useStateMaterial from "../../../hooks/genaral/useStatMaterila";
function ProductStagnant() {
  const dataUserById = getUserInformation();

  const Params = useParams();
  const mainClassId = Params?.id;
  const [dataProduct, setDataProduct] = useState([]);
  const [dataMinClass, setDataMainClass] = useState({});
  const [selectedState, setSelectedState] = useState(null);
  const [selectedSubClass, setSelectedSubClass] = useState(null);
  const [selectedTyMaterial, setSelectedTypeMaterial] = useState(null);
  const [subClassData, setSubClassData] = useState([]);
  const [loading, setLoading] = useState(false);
  const maintheme = useSelector((state) => state?.ThemeData?.maintheme);
  const theme = useTheme();
  const { stateMaterial } = useStateMaterial()
  const typeMaterial = [
    { typeMaterial: "مادة راكدة" },
    { typeMaterial: "مادة بطيئة الحركة" },
  ];

  const fetchData = async () => {
    try {
      setLoading(true);
      const [productResponse, mainClassResponse, subClassResponse] =
        await Promise.all([
          axios.get(
            `${BackendUrl}/api/getDataStagnantMaterialAllByMainClassId?mainClassId=${mainClassId}&Entities_id=${dataUserById?.entity_id}`
          ),
          axios.get(`${BackendUrl}/api/getDataMainClassById/${mainClassId}`),
          axios.get(`${BackendUrl}/api/getDataSubClass`),
        ]);

      if (productResponse) {
        let filteredProducts = productResponse?.data?.response;

        // Filter products based on selected filters
        if (selectedState) {
          filteredProducts = filteredProducts?.filter(
            (product) => product?.state_matrial_id === selectedState?.id
          );
        }

        if (selectedSubClass) {
          filteredProducts = filteredProducts?.filter(
            (product) => product?.subClass_id === selectedSubClass?.subClass_id // Assuming product has sub_class_id
          );
        }

        if (selectedTyMaterial) {
          filteredProducts = filteredProducts?.filter(
            (product) =>
              product?.typ_material === selectedTyMaterial?.typeMaterial
          );
        }

        setDataProduct(filteredProducts);
      }
      if (mainClassResponse) {
        setDataMainClass(mainClassResponse?.data?.response);
      }
      if (subClassResponse) {
        setSubClassData(subClassResponse?.data?.response);
      }
    } catch (error) {
      console.error(error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [mainClassId, selectedState, selectedSubClass, selectedTyMaterial]); // Fetch data on any filter changes

  return (
    <Box>
      {loading && <Loader />}
      <div className="text-center container py-5 mt-4">
        {dataProduct?.length > 0 && (
          <HeaderCenter
            title={` المواد الراكدة - ${dataMinClass?.main_Class_name}`}
            typeHeader={"h4"}
          />
        )}
        <div className="d-flex gap-4 mb-3 flex-wrap">
          <Autocomplete
            disablePortal
            options={stateMaterial}
            sx={{ width: 300 }}
            getOptionLabel={(option) => option?.state_name}
            value={selectedState}
            onChange={(event, newValue) => {
              setSelectedState(newValue);
              fetchData(); // Fetch data on state selection change
            }}
            renderInput={(params) => (
              <TextField {...params} label="حالة المادة" />
            )}
          />
          <Autocomplete
            disablePortal
            options={subClassData}
            sx={{ width: 300 }}
            getOptionLabel={(option) => option?.sub_class_name}
            value={selectedSubClass}
            onChange={(event, newValue) => {
              setSelectedSubClass(newValue);
              fetchData(); // Fetch data on subclass selection change
            }}
            renderInput={(params) => (
              <TextField {...params} label="التصنيفات الفرعية" />
            )}
          />
          <Autocomplete
            disablePortal
            options={typeMaterial}
            sx={{ width: 300 }}
            getOptionLabel={(option) => option?.typeMaterial}
            value={selectedTyMaterial}
            onChange={(event, newValue) => {
              setSelectedTypeMaterial(newValue);
              fetchData(); // Fetch data on type material selection change
            }}
            renderInput={(params) => (
              <TextField {...params} label="نوع المادة" />
            )}
          />
        </div>
        <div className="displayMaterial">
          {dataProduct.length > 0 ? (
            dataProduct.map((item) => (
              <div
                className="col-lg-4 col-md-12 mb-2 w-100"
                key={item?.stagnant_id}
              >
                <div
                  className="card"
                  style={{
                    background:
                      theme.palette.mode === "dark"
                        ? maintheme.lightblack
                        : maintheme.paperColor,
                    color:
                      theme.palette.mode === "dark"
                        ? maintheme.paperColor
                        : "#000000",
                  }}
                >
                  <div
                    className="bg-image hover-zoom ripple ripple-surface ripple-surface-light BoxImage"
                    data-mdb-ripple-color="light"
                  >
                    <Link to={`/Product-Overview/${item?.stagnant_id}`}>
                      <img
                        className="ImageProduct w-100"
                        src={isImageFile(item?.images) || "fallback-image-url"}
                        alt={item?.name_material}
                      />
                    </Link>
                    <div className="card-body">
                      <a href="#" className="text-reset">
                        <h5 className="card-title">{item?.name_material}</h5>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <CustomNoRowsOverlay />
          )}
        </div>
      </div>
    </Box>
  );
}

export default ProductStagnant;
