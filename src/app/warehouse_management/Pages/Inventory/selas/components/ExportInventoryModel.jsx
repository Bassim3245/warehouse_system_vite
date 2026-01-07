import React, { useState, useEffect, useMemo, useCallback } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

import PopupForm from "../../../../../../components/reusableComponent/PopupForm";
import CustomDatePicker from "../../../../../../components/reusableComponent/CustomDatePicker";

import { ButtonTheme } from "../../../../../../style/ButtomStyle";
import { useTranslation } from "react-i18next";
import SaveIcon from "@mui/icons-material/Save";
import ModeEditOutlined from "@mui/icons-material/ModeEditOutlined";
import dayjs from "dayjs";

import { BackendUrl } from "../../../../../../redux/api/axios";
import { toast } from "react-toastify";
import { axiosInstance } from "../../../../../../redux/api/axiosConfig";
import { useMovementMaterial } from "../../../../../../hooks/invantory/useMovmentMaterial";

function InventoryExportModel({ inventoryData, setRefreshButton, isInternalTransfer }) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [distributedMovements, setDistributedMovements] = useState([]);
  const { materialMovements } = useMovementMaterial({ materialId: inventoryData?.material_id })

  /* -------------------------------------
       FORM DATA FOR EDITING
  -------------------------------------- */
  const [formData, setFormData] = useState({
    quantity: "",
    export_date: dayjs(),
    price: "",
    note: "",
    reason: "",
    warehouse_id: "",
    priceMethod: "fifo", // "fifo" or "manual"
  });

  /* -------------------------------------
      AVAILABLE MOVEMENTS (from materialMovements)
  -------------------------------------- */
  const availableMovements = useMemo(() => {
    if (!materialMovements || !Array.isArray(materialMovements)) {
      return [];
    }
    // Filter for incoming documents with remaining quantity and sort by purchase date (FIFO)
    return materialMovements
      .filter(movement =>
        movement.document_type === "in" &&
        parseFloat(movement.quantity) > 0.00 &&
        parseFloat(movement.price) > 0.00)
      .sort((a, b) => new Date(a.purchase_date) - new Date(b.purchase_date));
  }, [materialMovements]);

  /* -------------------------------------
      AUTO DISTRIBUTION FUNCTION
  -------------------------------------- */
  const distributeQuantityAutomatically = useCallback((requestedQuantity) => {
    const distributed = [];
    let remainingQuantity = parseFloat(requestedQuantity);
    let totalCost = 0;


    for (const movement of availableMovements) {
      if (remainingQuantity <= 0) break;
      const available = parseFloat(movement.quantity);
      const qty = Math.min(remainingQuantity, available);

      if (qty > 0) {
        // Find the matching detail from inventoryData.details using transaction_id
        const matchingDetail = inventoryData?.details?.find(
          detail => detail.transaction_id === movement.transaction_id
        );
        distributed.push({
          inventory_id: movement?.inventory_id,
          document_id: movement?.document_id,
          document_number: movement?.document_number,
          transaction_id: movement?.transaction_id,
          detailsId: matchingDetail?.details_id, // Use detail.id if found, fallback to transaction_id
          price: movement?.price,
          allocated_quantity: qty,
          origin_quantity: movement?.quantity, // الكمية الأصلية للمستند
          remaining_after_allocation: available - qty,
          purchase_date: movement?.purchase_date,
        });
        totalCost += qty * parseFloat(movement?.price || 0);
        remainingQuantity -= qty;
      }
    }

    return {
      distributed,
      totalCost,
      canFulfill: remainingQuantity === 0,
      shortfall: remainingQuantity
    };
  }, [availableMovements, inventoryData]);

  /* -------------------------------------
      LOAD DATA FOR EDITING
  -------------------------------------- */
  useEffect(() => {
    setFormData({
      quantity: inventoryData?.total_quantity || "",
      price: inventoryData?.price || "",
      export_date: inventoryData?.export_date ? dayjs(inventoryData.export_date) : null,
      note: inventoryData?.note || "",
      priceMethod: "fifo"
    });
  }, [inventoryData]);

  /* -------------------------------------
      CALCULATE FIFO AVERAGE PRICE
  -------------------------------------- */
  const calculateFIFOAveragePrice = useCallback((quantity, distributed) => {
    if (!distributed || distributed.length === 0 || !quantity) {
      return 0;
    }
    const totalCost = distributed.reduce((sum, mov) => {
      return sum + (parseFloat(mov.allocated_quantity) * parseFloat(mov.price || 0));
    }, 0);
    return (totalCost / parseFloat(quantity)).toFixed(2);
  }, []);

  /* -------------------------------------
      AUTO DISTRIBUTE WHEN QUANTITY CHANGES
  -------------------------------------- */
  useEffect(() => {
    if (formData.quantity && availableMovements.length > 0) {
      const result = distributeQuantityAutomatically(formData.quantity);
      setDistributedMovements(result.distributed);

      // Update price based on distribution ONLY if NOT internal transfer and FIFO method is selected
      if (!isInternalTransfer && result.canFulfill && result.distributed.length > 0 && formData.priceMethod === "fifo") {
        const avgPrice = calculateFIFOAveragePrice(formData.quantity, result.distributed);
        setFormData(prev => ({
          ...prev,
          price: avgPrice,
          distribution_details: result.distributed
        }));
      } else if (!isInternalTransfer && formData.priceMethod === "fifo") {
        // If FIFO is selected but can't fulfill, still set distribution details
        setFormData(prev => ({
          ...prev,
          distribution_details: result.distributed
        }));
      } else if (isInternalTransfer) {
        // For internal transfers, just set distribution details without price
        setFormData(prev => ({
          ...prev,
          distribution_details: result.distributed,
          price: null
        }));
      }
    }
  }, [formData.quantity, formData.priceMethod, availableMovements, distributeQuantityAutomatically, calculateFIFOAveragePrice, isInternalTransfer]);

  /* -------------------------------------
      INPUT CHANGE (STABLE CALLBACK)
  -------------------------------------- */
  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  /* -------------------------------------
      DATE CHANGE (STABLE CALLBACK)
  -------------------------------------- */
  const handleDateChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  /* -------------------------------------
      PRICE METHOD CHANGE HANDLER
  -------------------------------------- */
  const handlePriceMethodChange = useCallback((e) => {
    const newMethod = e.target.value;
    setFormData(prev => {
      const updated = { ...prev, priceMethod: newMethod };

      // If switching to FIFO, recalculate the price
      if (newMethod === "fifo" && distributedMovements.length > 0 && prev.quantity) {
        const avgPrice = calculateFIFOAveragePrice(prev.quantity, distributedMovements);
        updated.price = avgPrice;
      }

      return updated;
    });
  }, [distributedMovements, calculateFIFOAveragePrice]);

  /* -------------------------------------
      OPEN / CLOSE POPUP
  -------------------------------------- */
  const handleOpen = useCallback(() => setOpen(true), []);
  const handleClose = useCallback(() => setOpen(false), []);
  /* -------------------------------------
      SUBMIT HANDLER (STABLE CALLBACK)
  -------------------------------------- */
  const handleSubmit = useCallback(async () => {
    setLoading(true);
    try {
      if (!formData.quantity || !formData.export_date || !formData.reason) {
        toast.error("الرجاء ملء جميع الحقول المطلوبة");
        return;
      }
      const response = await axiosInstance.post(
        `${BackendUrl}/api/warehouse/inventory-export-edit`,
        {
          formData: {
            quantity: formData.quantity,
            export_date: formData.export_date,
            note: formData.note,
            reason: formData.reason,
            price: formData.price || 0,
            price_method: formData.priceMethod,
          },
          distribution_details: formData.distribution_details || [],
          originQuantity: inventoryData?.total_quantity,
          export_id: inventoryData?.export_id,
          material_id: inventoryData?.material_id,
          document_id: inventoryData?.document_id,
          isInternalTransfer: isInternalTransfer,
        }
      );

      toast.success(response?.data?.message || "تم التعديل بنجاح");
      setRefreshButton(prev => !prev);
      setOpen(false);
    } catch (error) {
      console.log("Error submitting data:", error);
      toast.error(error?.response?.data?.message || "حدث خطأ أثناء الحفظ");
    } finally {
      setLoading(false);
    }
  }, [formData, inventoryData, setRefreshButton]);

  /* -------------------------------------
      FORM CONTENT (MEMOIZED)
  -------------------------------------- */
  const renderFormContent = useMemo(() => (
    <Box>
      <Grid container spacing={2} sx={{ mt: 1 }}>
        {/* الكمية */}
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            name="quantity"
            label={"الكمية صادرة"}
            fullWidth
            required
            type="number"
            value={formData.quantity}
            onChange={handleInputChange}
          />
        </Grid>

        {/* طريقة حساب السعر - Only show if NOT internal transfer */}
        {!isInternalTransfer && (
          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl component="fieldset">
              <FormLabel component="legend" sx={{ fontSize: "14px", mb: 1 }}>
                طريقة حساب السعر
              </FormLabel>
              <RadioGroup
                row
                name="priceMethod"
                value={formData.priceMethod}
                onChange={handlePriceMethodChange}
              >
                <FormControlLabel
                  value="fifo"
                  control={<Radio />}
                  label="متوسط السعر (FIFO)"
                />
                <FormControlLabel
                  value="manual"
                  control={<Radio />}
                  label="إدخال يدوي"
                />
              </RadioGroup>
            </FormControl>
          </Grid>
        )}

        {/* السعر - Only show if NOT internal transfer */}
        {!isInternalTransfer && (
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              name="price"
              label="السعر"
              value={formData?.price}
              type="number"
              onChange={handleInputChange}
              fullWidth
              disabled={formData.priceMethod === "fifo"}
              InputProps={{
                endAdornment: <InputAdornment position="end">دينار</InputAdornment>
              }}
              helperText={
                formData.priceMethod === "fifo"
                  ? "السعر محسوب تلقائياً بناءً على FIFO"
                  : "أدخل السعر يدوياً"
              }
            />
          </Grid>
        )}

        {/* Automatic Distribution Chips */}
        {distributedMovements.length > 0 && (
          <Grid item xs={12}>
            <Box
              sx={{
                p: 2,
                bgcolor: "rgba(25, 118, 210, 0.05)",
                borderRadius: 2,
                border: "1px solid rgba(25, 118, 210, 0.2)",
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{ mb: 1, fontWeight: "bold", color: "primary.main" }}
              >
                توزيع الكميات التلقائي:
              </Typography>

              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {distributedMovements.map((mov, i) => (
                  <Chip
                    key={i}
                    label={`مستند ${mov.document_number}: ${mov.allocated_quantity} بسعر ${mov.price} دينار`}
                    variant="outlined"
                    size="small"
                    color="primary"
                  />
                ))}
              </Box>
            </Box>
          </Grid>
        )}

        {/* الوصف */}
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            name="note"
            label="ملاحظات"
            fullWidth
            multiline
            rows={4}
            value={formData.note}
            onChange={handleInputChange}
          />
        </Grid>
        {/* الوصف */}
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            name="reason"
            label="اسباب التعديل "
            fullWidth
            multiline
            rows={4}
            required
            value={formData.reason}
            onChange={handleInputChange}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <CustomDatePicker
            label="تاريخ التصدير"
            value={formData.export_date}
            required
            setValue={v => handleDateChange("export_date", v)}
            haswidth
            format="YYYY/MM/DD"
          />
        </Grid>

      </Grid>
    </Box>
  ), [
    formData,
    distributedMovements,
    handleInputChange,
    handleDateChange,
    handlePriceMethodChange
  ]);

  /* -------------------------------------
      FORM FOOTER (MEMOIZED)
  -------------------------------------- */
  const renderFormActions = useMemo(() => (
    <>
      <ButtonTheme
        onClick={handleSubmit}
        startIcon={<SaveIcon />}
        disabled={loading}
      >
        تعديل
      </ButtonTheme>
      <Button onClick={handleClose} variant="outlined" disabled={loading}>
        {t("close")}
      </Button>
    </>
  ), [loading, handleSubmit, handleClose, t]);

  return (
    <>
      <MenuItem onClick={handleOpen}>
        <ModeEditOutlined sx={{ fontSize: "20px" }} />
        <span className="ms-2"> تعديل المادة</span>
      </MenuItem>

      <PopupForm
        title={
          "أستمارة تعديل  "
        }
        open={open}
        onClose={handleClose}
        setOpen={setOpen}
        width="70%"
        content={renderFormContent}
        footer={renderFormActions}
      />
    </>
  );
}

export default React.memo(InventoryExportModel);
