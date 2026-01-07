import React, { useRef, useState } from "react";
import { ButtonSave } from "../../../../../style/ButtomStyle";
import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import IconButton from "@mui/material/IconButton";
import Slide from "@mui/material/Slide";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

import Close from "@mui/icons-material/Close";
import { useReactToPrint } from "react-to-print";
import Logo from "../../../../../components/Layout/logo";
import { formatDateYearsMonth } from "../../../../../utils/formatData";
const Transition = React.forwardRef((props, ref) => (
  <Slide direction="up" ref={ref} {...props} />
));
const DisplayInformationComponent = ({
  includes,
  usersData,
  ministriesData,
  materialsData,
  mainClassesData,
  materialOfDataWithinGivenData,
  informationUser,
  informationMaterial,
  dateForm,
  dateTo,
  materialsBookedData
}) => {
  const [open, setOpen] = useState(false);
  const componentRef = useRef();
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <div>
      <ButtonSave variant="outlined" onClick={handleClickOpen}>
        عرض البيانات
      </ButtonSave>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: "relative", backgroundColor: "#0d47a1" }}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={handleClose}>
              <Close />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              التقارير
            </Typography>
            <Button autoFocus color="inherit" onClick={handlePrint}>
              طباعة
            </Button>
          </Toolbar>
        </AppBar>
        <div
          className="mt-4"
          dir="rtl"
          style={{   width: "210mm",
            minHeight: "297mm",
            padding: "20mm",
            margin: "auto", }}
          ref={componentRef}
          id="print-content"
        >
          <div dir="ltr">
            <Logo />
          </div>
          <h1 className="text-center">البيانات</h1>

          {/* User Data Section */}
          {includes?.includes("users") && (
            <>
              <h3 style={{ color: "#1e6a99" }}>بيانات المستخدمين</h3>
              <table className="table table-striped table-hover">
                <thead>
                  <tr>
                    <th>#</th>
                    {informationUser.includes("user_name") && (
                      <th>اسم المستخدم</th>
                    )}
                    {informationUser.includes("phone_number") && (
                      <th>رقم الهاتف</th>
                    )}
                    {informationUser.includes("email") && (
                      <th>البريد الالكتروني</th>
                    )}
                    {informationUser.includes("job_name") && (
                      <th>العنوان الوظيفي</th>
                    )}
                    {informationUser.includes("Entities_name") && (
                      <th>الجهة المستفيدة</th>
                    )}
                    {informationUser.includes("ministries") && <th>الوزارة</th>}
                    {informationUser.includes("governorate_name") && (
                      <th>العنوان</th>
                    )}
                    {informationUser.includes("create_At") && (
                      <th>تاريخ الإنشاء</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {usersData?.map((item, index) => (
                    <tr key={index}>
                      <th>{index + 1}</th>
                      {informationUser.includes("user_name") && (
                        <td>{item?.user_name || "N/A"}</td>
                      )}
                      {informationUser.includes("phone_number") && (
                        <td>{item?.phone_number || "N/A"}</td>
                      )}
                      {informationUser.includes("email") && (
                        <td>{item?.email || "N/A"}</td>
                      )}
                      {informationUser.includes("job_name") && (
                        <td>{item?.job_name || "N/A"}</td>
                      )}
                      {informationUser.includes("Entities_name") && (
                        <td>{item?.Entities_name || "N/A"}</td>
                      )}
                      {informationUser.includes("ministries") && (
                        <td>{item?.ministries || "N/A"}</td>
                      )}
                      {informationUser.includes("governorate_name") && (
                        <td>{item?.governorate_name || "N/A"}</td>
                      )}
                      {informationUser.includes("create_At") && (
                        <td>
                          {formatDateYearsMonth(item?.create_At) || "N/A"}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <th colSpan={informationUser?.length}>الإجمالي</th>
                    <th>{usersData?.length}</th>
                  </tr>
                </tfoot>
              </table>
            </>
          )}
          {/* Ministries and Entities Data */}
          {includes?.includes("ministriesAndEntities") && (
            <>
              <h3 style={{ color: "#1e6a99" }}>الوزارات والجهات المستفيدة</h3>
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>اسم الوزارة</th>
                    <th>الجهة المستفيدة</th>
                  </tr>
                </thead>
                <tbody>
                  {ministriesData?.map((ministry, ministryIndex) => (
                    <tr key={ministryIndex}>
                      <th>{ministryIndex + 1}</th>
                      <td>{ministry?.ministry_name || "N/A"}</td>
                      <td>
                        <ul style={{ listStyleType: "square" }}>
                          {ministry?.entities?.length > 0
                            ? ministry?.entities?.map((entity, entityIndex) => (
                                <li key={entityIndex}>
                                  {entity?.name || "N/A"}
                                </li>
                              ))
                            : "No entities"}
                        </ul>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <th colSpan="2">الإجمالي</th>
                    <th>{ministriesData?.length}</th>
                  </tr>
                </tfoot>
              </table>
            </>
          )}

          {/* Materials Data */}
          {includes?.includes("material") && (
            <>
              <h3 style={{ color: "#1e6a99" }}>المواد الاجمالية في المنصة</h3>
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>#</th>
                    {informationMaterial?.includes("name_material") && (
                      <th>أسم المادة</th>
                    )}
                    {informationMaterial?.includes("state_name") && (
                      <th>حالة المادة</th>
                    )}
                    {informationMaterial?.includes("Quantity") && (
                      <th>كمية المادة</th>
                    )}
                    {informationMaterial?.includes("created_at") && (
                      <th>تاريخ الادخال</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {materialsData?.map((item, index) => (
                    <tr key={index}>
                      <th>{index + 1}</th>
                      {informationMaterial?.includes("name_material") && (
                        <td>{item?.name_material || "N/A"}</td>
                      )}
                      {informationMaterial?.includes("state_name") && (
                        <td>{item?.state_name || "N/A"}</td>
                      )}
                      {informationMaterial?.includes("Quantity") && (
                        <td>{item?.Quantity || "N/A"}</td>
                      )}
                      {informationMaterial?.includes("created_at") && (
                        <td>
                          {formatDateYearsMonth(item?.created_at) || "N/A"}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <th colSpan={informationMaterial?.length}>الإجمالي</th>
                    <th>{materialsData?.length}</th>
                  </tr>
                </tfoot>
              </table>
            </>
          )}

          {includes?.includes("mainClass") && (
            <>
              <h3 style={{ color: "#1e6a99" }}> الفئات الرئيسية وال فرعية</h3>
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>اسم الفئة الرئيسية</th>
                    <th>أسم الفئة الفرعية</th>
                  </tr>
                </thead>
                <tbody>
                  {mainClassesData?.map((item, index) => (
                    <tr key={index}>
                      <th>{index + 1}</th>
                      <td>{item?.main_Class_name || "N/A"}</td>
                      <td>{item?.subclasses || "N/A"}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <th colSpan="2">الإجمالي</th>
                    <th>{mainClassesData?.length}</th>
                  </tr>
                </tfoot>
              </table>
            </>
          )}
          {includes?.includes("materialOfDataWithinGivenDate") && (
            <>
              <h3 style={{ color: "#1e6a99" }}>
                المواد المحدد خلال{" "}
                {dateForm ? formatDateYearsMonth(dateForm) : null} الى
                {dateTo ? formatDateYearsMonth(dateTo) : null}
              </h3>
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>#</th>
                    {informationMaterial?.includes("name_material") && (
                      <th>أسم المادة</th>
                    )}
                    {informationMaterial?.includes("state_name") && (
                      <th>حالة المادة</th>
                    )}
                    {informationMaterial?.includes("Quantity") && (
                      <th> كمية المادة</th>
                    )}
                    {informationMaterial?.includes("created_at") && (
                      <th>تاريخ الادخال</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {materialOfDataWithinGivenData?.map((item, index) => (
                    <tr key={index}>
                      <th>{index + 1}</th>
                      {informationMaterial?.includes("name_material") && (
                        <td>{item?.name_material || "N/A"}</td>
                      )}
                      {informationMaterial?.includes("state_name") && (
                        <td>{item?.state_name || "N/A"}</td>
                      )}
                      {informationMaterial?.includes("Quantity") && (
                        <td>{item?.Quantity || "N/A"}</td>
                      )}
                      {informationMaterial?.includes("created_at") && (
                        <td>
                          {formatDateYearsMonth(item?.created_at) || "N/A"}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <th colSpan={informationMaterial?.length}>الإجمالي</th>
                    <th>{materialOfDataWithinGivenData?.length}</th>
                  </tr>
                </tfoot>
              </table>
            </>
          )}
          {includes?.includes("completedTransactions") && (
            <>
              <h3 style={{color:"#1e6a99"}}>عدد الصفقات المكتملة</h3>
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>اسم المادة</th>
                    <th> حالة المادة</th>
                    <th> الكمية</th>
                  </tr>
                </thead>
                <tbody>
     
                  {materialsBookedData?.map((item, index) => (
                    <tr>
                      <th>{index + 1}</th>
                      <td>{item?.name_material}</td>
                      <td>{item?.state_name}</td>
                      <td>{item?.Quantity_buy}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <th colspan="3">الإجمالي</th>
                    <th>{materialsBookedData?.length}</th>
                  </tr>
                </tfoot>
              </table>
            </>
          )}
        </div>
      </Dialog>
    </div>
  );
};

export default DisplayInformationComponent;
