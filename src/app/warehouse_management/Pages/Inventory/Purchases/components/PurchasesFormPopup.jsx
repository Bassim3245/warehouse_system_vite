import{ useState } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Add from "@mui/icons-material/Add";
import Calculate from "@mui/icons-material/Calculate";
import Inventory from "@mui/icons-material/Inventory";
import { ButtonTheme } from "../../../../../../style/ButtomStyle";
import PopupForm from "../../../../../../components/reusableComponent/PopupForm";
import CustomDatePicker from "../../../../../../components/reusableComponent/CustomDatePicker";
import { FormatDataNumber } from "../../../../../../utils/formatData";
import MaterialSearchInput from "../../../../../../components/InventoryComponents/MaterialSearchInput";

// Input styles
const inputStyles = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 1,
  },
};

export const PurchasesFormPopup = ({
  formData,
  handleInputChange,
  handleDateChange,
  stateMaterial,
  selectedMaterial,
  handleMaterialSelect,
  handleImportSubmit,
  rtl,
  setSelectedMaterial,
  searchParams,
  warehouseDataBYId,
}) => {
  const [open, setOpen] = useState(false);
  const fixedWarehouseId =
    warehouseDataBYId?.id || searchParams.get("warehouseId");
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
  };

  // Selection handler plugging into parent callbacks
  const onMaterialSelect = (mat) => {
    if (handleMaterialSelect) handleMaterialSelect(mat || null);
    if (setSelectedMaterial) setSelectedMaterial(mat || null);
  };

  const totalPrice =
    formData?.quantity && formData?.price
      ? formData.quantity * formData.price
      : 0;

  const renderFormContent = () => (
    <Box sx={{ p: 3 }} dir={rtl}>
      <Card
        elevation={1}
        sx={{
          borderRadius: 1,
          maxWidth: 900,
          mx: "auto",
        }}
      >
        <Box
          sx={{
            backgroundColor: "#f5f5f5",
            color: "#333",
            p: 2,
            borderBottom: "1px solid #e0e0e0",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Add />
            تفاصيل الاستلام
          </Typography>
        </Box>

        <CardContent sx={{ p: 3 }}>
          <Stack spacing={3}>
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <MaterialSearchInput
                  warehouseId={fixedWarehouseId}
                  selectedMaterial={selectedMaterial}
                  onSelect={onMaterialSelect}
                  dir={rtl}
                  open={open}
                />
              </Grid>
              {/* Quantity */}
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="الكمية المستوردة"
                  type="text"
                  name="quantity"
                  value={formData?.quantity || ""}
                  onChange={handleInputChange}
                  inputProps={{ min: 0, step: 0.01 }}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Inventory color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={inputStyles}
                />
              </Grid>

              {/* Price */}
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="سعر الوحدة (دينار)"
                  type="text"
                  name="price"
                  value={formData.price || ""}
                  onChange={handleInputChange}
                  inputProps={{ min: 0, step: 0.01 }}
                  sx={inputStyles}
                />
              </Grid>

              {/* Material State */}
              <Grid size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth required sx={inputStyles}>
                  <InputLabel>حالة المادة</InputLabel>
                  <Select
                    name="state_id"
                    value={formData?.state_id || ""}
                    onChange={handleInputChange}
                    label="حالة المادة"
                  >
                    {stateMaterial?.map((item) => (
                      <MenuItem key={item?.id} value={item?.id}>
                        {item.state_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Production Date */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Box sx={{ height: "56px", direction: "ltr" }}>
                  <CustomDatePicker
                    label="تاريخ الانتاج"
                    format="YYYY/MM/DD"
                    placeholder="تاريخ الانتاج"
                    required={false}
                    value={
                      formData?.production_date
                        ? formData?.production_date
                        : null
                    }
                    CustomFontSize="14px"
                    is_dateTime={false}
                    setValue={(value) =>
                      handleDateChange("production_date", value)
                    }
                    is_Time={false}
                    borderColor="inherit"
                  />
                </Box>
              </Grid>

              {/* Expiry Date */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Box sx={{ height: "56px", direction: "ltr" }}>
                  <CustomDatePicker
                    label="تاريخ نفاذ الصلاحية"
                    format="YYYY/MM/DD"
                    placeholder="تاريخ نفاذ الصلاحية"
                    required={false}
                    value={formData?.expiry_date ? formData?.expiry_date : null}
                    CustomFontSize="14px"
                    is_dateTime={false}
                    setValue={(value) => handleDateChange("expiry_date", value)}
                    is_Time={false}
                    borderColor="inherit"
                  />
                </Box>
              </Grid>

              {/* Purchase Date */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Box sx={{ height: "56px", direction: "ltr" }}>
                  <CustomDatePicker
                    label="تاريخ شراء المادة"
                    format="YYYY/MM/DD"
                    placeholder="تاريخ شراء المادة"
                    required={false}
                    value={
                      formData?.purchase_date ? formData?.purchase_date : null
                    }
                    CustomFontSize="14px"
                    is_dateTime={false}
                    setValue={(value) =>
                      handleDateChange("purchase_date", value)
                    }
                    is_Time={false}
                    borderColor="inherit"
                  />
                </Box>
              </Grid>
            </Grid>

            {/* Total Price Display */}
            {totalPrice > 0 && (
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  backgroundColor: "#f9f9f9",
                  border: "1px solid #e0e0e0",
                  borderRadius: 1,
                  mt: 2,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    justifyContent: "center",
                  }}
                >
                  <Calculate />
                  <Typography variant="subtitle2" fontWeight="bold">
                    إجمالي المبلغ:
                  </Typography>
                  <Typography variant="h6" fontWeight="bold">
                    {FormatDataNumber(totalPrice)} دينار
                  </Typography>
                </Box>
              </Paper>
            )}
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );

  const renderFormActions = () => (
    <>
      <Button
        variant="contained"
        color="primary"
        sx={{ mr: 1 }}
        onClick={handleImportSubmit}
        disabled={!selectedMaterial || !formData.quantity}
      >
        إضافة إلى الوصل
      </Button>
      <Button onClick={handleClose} variant="outlined">
        إغلاق
      </Button>
    </>
  );

  return (
    <div>
      <ButtonTheme variant="outlined" onClick={handleOpen} disableRipple>
        <Add sx={{ fontSize: "20px" }} />
        <span className="ms-2">أضافة الى وصل</span>
      </ButtonTheme>
      <PopupForm
        title={`إضافة مادة جديدة للوصل`}
        open={open}
        onClose={handleClose}
        setOpen={setOpen}
        width="100%"
        isFullScreen={false}
        content={renderFormContent()}
        footer={renderFormActions()}
      />
    </div>
  );
};
