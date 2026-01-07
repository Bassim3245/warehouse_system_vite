import { useSelector } from "react-redux";
import { useParams } from "react-router";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Loader from "../../../../components/reusableComponent/Loader";
import { BackendUrl } from "../../../../redux/api/axios";
import {
  getFileIcon,
  isImageFile,
} from "../../../../utils/Function";
import {useTheme} from "@mui/material/styles";import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import ArrowCircleLeftOutlined from "@mui/icons-material/ArrowCircleLeftOutlined";

import { getToken } from "../../../../utils/handelCookie";
import { useTranslation } from "react-i18next";
import { formatDateYearsMonth } from "../../../../utils/formatData";
import { debounce } from "@mui/material/utils";
const MaterialOverview = () => {
  const maintheme = useSelector((state) => state?.ThemeData?.maintheme);
  const { id: stagnant_id } = useParams();
  const token = getToken();
  const [dataProduct, setDataProduct] = useState({});
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const { t } = useTranslation();
  const containerRef = useRef(null);
  // Debounced resize handler
  const handleResize = debounce(() => {
    if (containerRef.current) {
      console.log(
        "Container resized:",
        containerRef.current.getBoundingClientRect()
      );
    }
  }, 100);
  useEffect(() => {
    const resizeObserver = new ResizeObserver(handleResize);
    const currentRef = containerRef.current;
    if (currentRef) resizeObserver.observe(currentRef);
    return () => currentRef && resizeObserver.unobserve(currentRef);
  }, [handleResize]);
  const fetchMainClassData = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        `${BackendUrl}/api/getDataStagnantMaterialAllByAndStagnantId/${stagnant_id}`,
        {
          headers: { authorization: token },
        }
      );
      setDataProduct(data?.response);
    } catch (error) {
      console.error(
        "Error fetching main class data:",
        error?.response?.data?.message || error.message
      );
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchMainClassData();
  }, [stagnant_id]);

  const renderListItem = (label, value, weight) => (
    <li
      className="list-group-item d-flex justify-content-between align-items-center px-0"
      style={{
        background:
          theme?.palette?.mode === "dark"
            ? maintheme?.lightblack
            : maintheme?.paperColor,
        color:
          theme?.palette?.mode === "dark" ? maintheme?.paperColor : "#000000",
        fontWeight: weight ? weight : "",
      }}
    >
      {label}
      <span>{value}</span>
    </li>
  );
  return (
    <Box className="">
      {loading && <Loader />}
      <div className="container py-5">
        <div className="row d-flex justify-content-center my-4">
          <div className="col-md-8">
            <div
              className="card-profile mb-4"
              style={{
                background:
                  theme?.palette?.mode === "dark"
                    ? maintheme?.lightblack
                    : maintheme?.paperColor,
              }}
            >
              <div
                className="card-header d-flex justify-content-between"
                style={{ background: maintheme?.iconColor }}
              >
                <Button
                  onClick={() => window.history.back(-1)}
                  sx={{ color: "white" }}
                >
                  <ArrowCircleLeftOutlined className="me-2" />
                  الرجوع الى الخلف
                </Button>
              </div>
              <div className="card-body ">
                <div className="main-image ">
                  <img
                    className="center"
                    src={isImageFile(dataProduct?.images)}
                    alt={dataProduct?.name_material || "Product Image"}
                  />
                </div>
                <div className="d-flex justify-content-center align-items-center gap-3 flex-wrap">
                  {dataProduct?.images?.map((item, index) => (
                    <>
                      <div key={index}>
                        {getFileIcon(item?.file_name, "_", "edit")}
                      </div>
                    </>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            {/* {dataProduct?.Quantity === 0 ? ( */}
            <>
              <div
                className="card-profile mb-4"
                style={{
                  background:
                    theme?.palette?.mode === "dark"
                      ? maintheme?.lightblack
                      : maintheme?.paperColor,
                }}
              >
                <div
                  className="card-header py-3"
                  dir="rtl"
                  style={{ background: maintheme?.iconColor }}
                >
                  <h5 className="mb-0" style={{ color: "white" }}>
                    {dataProduct?.name_material} معلومات
                  </h5>
                </div>
                <div className="card-body">
                  <ul className="list-group list-group-flush" dir="rtl">
                    {renderListItem(
                      t("MaterialOverview.Material Name"),
                      dataProduct?.name_material
                    )}
                    {renderListItem(
                      t("MaterialOverview.main Class"),
                      dataProduct?.main_Class_name
                    )}
                    {renderListItem(
                      t("MaterialOverview.sub Class"),
                      dataProduct?.sub_class_name
                    )}
                    {renderListItem(
                      t("MaterialOverview.State of matter"),
                      dataProduct?.state_name
                    )}
                    {renderListItem(
                      t("MaterialOverview.typeMaterial"),
                      dataProduct?.typ_material
                    )}
                    {renderListItem(
                      t("MaterialOverview.purchase date"),

                      formatDateYearsMonth(dataProduct?.puchase_date)
                    )}
                    {renderListItem(
                      t("MaterialOverview.ministry name"),
                      dataProduct?.ministries
                    )}
                    {renderListItem(
                      t("MaterialOverview.entity name"),
                      dataProduct?.Entities_name
                    )}
                    {renderListItem(
                      t("MaterialOverview.Quantity"),
                      dataProduct?.Quantity === 0
                        ? "تم الحجز"
                        : dataProduct?.Quantity
                    )}
                    {renderListItem(
                      t("MaterialOverview.phone Number"),
                      dataProduct?.phone_number,
                      "build"
                    )}
                    {renderListItem(
                      t("MaterialOverview.Address"),
                      dataProduct?.address,
                      "bold"
                    )}
                  </ul>
                </div>
                <Box
                  className="productDescription"
                  dir="rtl"
                  sx={{
                    background:
                      theme?.palette?.mode === "dark"
                        ? maintheme?.lightblack
                        : maintheme?.paperColor,
                    color:
                      theme?.palette?.mode === "dark"
                        ? maintheme?.paperColor
                        : "#000000",
                  }}
                >
                  {token && (
                    <>
                      <h4>{t("MaterialOverview.Description")}</h4>
                      <p
                        style={{
                          color:
                            theme?.palette?.mode === "dark"
                              ? maintheme?.paperColor
                              : "#000000",
                        }}
                      >
                        {dataProduct?.description || "لايوجد"}
                      </p>
                    </>
                  )}
                </Box>
              </div>
              <div className="card-profile">
                {dataProduct?.approved_admin ? (
                  <Typography sx={{ fontWeight: "bold" }}>
                    تم الموافقة على طلب الرفع من قبل المسؤل
                  </Typography>
                ) : dataProduct?.approve_super_user_root ? (
                  <Typography sx={{ fontWeight: "bold" }}>
                    تم الموافقة على النشر
                  </Typography>
                ) : (
                  <Typography sx={{ fontWeight: "bold" }}>
                    في أنتضار الموافقة على رفع المنتج من قبل مسؤلي المنصة
                  </Typography>
                )}
              </div>
            </>
          </div>
        </div>
      </div>
    </Box>
  );
};
export default MaterialOverview;
