import { useEffect, useState, useCallback, useMemo } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Chip from "@mui/material/Chip";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";

import Print from "@mui/icons-material/Print";
import PopupForm from "../../../../../../components/reusableComponent/PopupForm";
import { ButtonTheme } from "../../../../../../style/ButtomStyle";
import { FormatDataNumber } from "../../../../../../utils/formatData";
import { MaterialPopup } from "./MaterialPopup";
import MaterialSearchInput from "../../../../../../components/InventoryComponents/MaterialSearchInput";

export const SalesFormPopup = ({
  formData,
  materialMovements,
  handleInputChange,
  handleAddToSalesList,
  setFormData,
  materialPopupRef,
  distributedMovements,
  setDistributedMovements,
  setSelectedMaterial,
  selectedMaterial,
  handleMaterialSelect,
  rtl,
  searchParams,
  warehouseDataBYId,
  priceMethod,
  setPriceMethod,
}) => {
  const [open, setOpen] = useState(false);
  const [IsMorInfo, setIsMorInfo] = useState(false);
  const isInternalTransfer = useMemo(
    () => searchParams?.get("documentType") === "internal_consumption",
    [searchParams],
  );

  const fixedWarehouseId = useMemo(
    () => warehouseDataBYId?.id || searchParams.get("warehouseId"),
    [warehouseDataBYId, searchParams],
  );

  // ---------------------------------------------
  // open / close handlers (stable)
  // ---------------------------------------------
  const handleOpen = useCallback(() => setOpen(true), []);
  const handleClose = useCallback(() => setOpen(false), []);

  // ---------------------------------------------
  // Material Selection (stable)
  // ---------------------------------------------
  const onMaterialSelect = useCallback(
    (mat) => {
      handleMaterialSelect?.(mat || null);
      setSelectedMaterial?.(mat || null);
    },
    [handleMaterialSelect, setSelectedMaterial],
  );

  // ---------------------------------------------
  // Available Movements (FIFO + memoized)
  // ---------------------------------------------
  const availableMovements = useMemo(() => {
    return materialMovements
      .filter((m) => m.document_type === "in" && m.remaining_quantity > 0)
      .sort((a, b) => new Date(a.purchase_date) - new Date(b.purchase_date));
  }, [materialMovements]);

  // ---------------------------------------------
  // Auto Distribution (memoized)
  // ---------------------------------------------
  const distributeQuantityAutomatically = useCallback(
    (requestedQuantity) => {
      const distributed = [];
      let remainingQuantity = parseFloat(requestedQuantity);
      let totalCost = 0;

      for (const movement of availableMovements) {
        if (remainingQuantity <= 0) break;
        const available = parseFloat(movement.remaining_quantity);
        const qty = Math.min(remainingQuantity, available);

        if (qty > 0) {
          distributed.push({
            ...movement,
            allocated_quantity: qty,
            remaining_after_allocation: available - qty,
          });
          totalCost += qty * parseFloat(movement.price || 0);
          remainingQuantity -= qty;
        }
      }

      return {
        distributed,
        totalCost,
        canFulfill: remainingQuantity === 0,
        shortfall: remainingQuantity,
      };
    },
    [availableMovements],
  );

  useEffect(() => {
    if (formData.quantity && selectedMaterial) {
      const result = distributeQuantityAutomatically(formData.quantity);
      setDistributedMovements(result.distributed);

      if (result.distributed.length > 0) {
        const update = {
          distribution_details: result.distributed,
          price_method: priceMethod,
        };
        // Only auto-calculate price if FIFO method is selected and not internal transfer
        if (
          !isInternalTransfer &&
          result.canFulfill &&
          priceMethod === "fifo"
        ) {
          update.price = (result.totalCost / formData.quantity).toFixed(2);
        }
        setFormData((prev) => ({ ...prev, ...update }));
      }
    }
  }, [
    formData.quantity,
    selectedMaterial,
    isInternalTransfer,
    priceMethod,
    distributeQuantityAutomatically,
    setDistributedMovements,
    setFormData,
  ]);

  useEffect(() => {
    if (isInternalTransfer) {
      setFormData((prev) => ({ ...prev, price: null }));
    }
  }, [isInternalTransfer, setFormData]);

  // ---------------------------------------------
  // Price Method Change Handler
  // ---------------------------------------------
  const handlePriceMethodChange = useCallback(
    (e) => {
      const newMethod = e.target.value;
      setPriceMethod(newMethod);

      // If switching to FIFO, recalculate the price
      if (
        newMethod === "fifo" &&
        distributedMovements.length > 0 &&
        formData.quantity
      ) {
        const totalCost = distributedMovements.reduce(
          (sum, mov) =>
            sum +
            parseFloat(mov.allocated_quantity) * parseFloat(mov.price || 0),
          0,
        );
        const avgPrice = (totalCost / formData.quantity).toFixed(2);
        setFormData((prev) => ({
          ...prev,
          price: avgPrice,
          price_method: newMethod,
        }));
      } else {
        setFormData((prev) => ({ ...prev, price_method: newMethod }));
      }
    },
    [distributedMovements, formData.quantity, setFormData],
  );

  const handlePriceSelect = useCallback(
    (movements) => {
      if (Array.isArray(movements)) {
        const totalQty = movements.reduce(
          (sum, m) => sum + parseFloat(m.remaining_quantity || 0),
          0,
        );

        if (isInternalTransfer) {
          setFormData((prev) => ({
            ...prev,
            price: null,
            quantity: Math.min(prev?.quantity || 1, totalQty),
            selected_movements: movements,
          }));
          setPriceMethod("fifo");
          return;
        }

        const totalCost = movements.reduce(
          (sum, m) =>
            sum +
            parseFloat(m.remaining_quantity || 0) * parseFloat(m.price || 0),
          0,
        );
        const avg = totalCost / totalQty;

        setFormData((prev) => ({
          ...prev,
          price: avg.toFixed(2),
          quantity: Math.min(prev?.quantity || 1, totalQty),
          selected_movements: movements,
        }));
        setPriceMethod("fifo");
        return;
      }

      // single movement
      setFormData((prev) => ({
        ...prev,
        price: isInternalTransfer ? null : movements.price,
        quantity: Math.min(prev?.quantity || 1, movements.remaining_quantity),
        inventory_id: movements.inventory_id,
      }));
      setPriceMethod("fifo");
    },
    [isInternalTransfer, setFormData],
  );
  useEffect(() => {
    setIsMorInfo((prv) => !prv);
  }, []);

  const renderFormContent = useCallback(
    () => (
      <Box dir={rtl} sx={{ p: 2 }}>
        <Grid container spacing={2}>
          {/* Material Search */}
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
              label="الكمية"
              name="quantity"
              type="text"
              value={formData.quantity}
              onChange={handleInputChange}
              size="small"
              fullWidth
              disabled={!selectedMaterial}
              inputProps={{
                min: 1,
                max: selectedMaterial?.balance,
              }}
              helperText={
                selectedMaterial
                  ? `متوفر: ${FormatDataNumber(selectedMaterial?.balance)}`
                  : "يرجى اختيار مادة"
              }
            />
          </Grid>

          {/* Price Method Selection (if not internal) */}
          {!isInternalTransfer && (
            <Grid size={{ xs: 12, md: 6 }}>
              <FormControl component="fieldset">
                <FormLabel component="legend" sx={{ fontSize: "14px", mb: 1 }}>
                  طريقة حساب السعر
                </FormLabel>
                <RadioGroup
                  row
                  name="priceMethod"
                  value={priceMethod}
                  onChange={handlePriceMethodChange}
                >
                  <FormControlLabel
                    value="fifo"
                    control={<Radio />}
                    label="متوسط السعر (FIFO)"
                    disabled={!selectedMaterial}
                  />
                  <FormControlLabel
                    value="manual"
                    control={<Radio />}
                    label="إدخال يدوي"
                    disabled={!selectedMaterial}
                  />
                </RadioGroup>
              </FormControl>
            </Grid>
          )}

          {/* Price (if not internal) */}
          {!isInternalTransfer && (
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                label="السعر"
                name="price"
                type="number"
                value={formData.price ?? ""}
                onChange={(e) => {
                  handleInputChange(e);
                  if (e.target.value !== "" && e.target.value !== null) {
                    setPriceMethod("manual");
                  }
                }}
                size="small"
                fullWidth
                disabled={!selectedMaterial || priceMethod === "fifo"}
                helperText={
                  priceMethod === "fifo"
                    ? "السعر محسوب تلقائياً بناءً على FIFO"
                    : "أدخل السعر يدوياً"
                }
              />
            </Grid>
          )}
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              label="رقم أمر العمل (اختياري)"
              name="work_order_number"
              value={formData.work_order_number ?? ""}
              onChange={handleInputChange}
              size="small"
              fullWidth 
            />
          </Grid>

          {/* Automatic Distribution Chips */}
          {distributedMovements.length > 0 && (
            <Grid size={{ xs: 12 }}>
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
                      label={`مستند ${mov.document_number}: ${FormatDataNumber(
                        mov.allocated_quantity,
                      )} بسعر ${FormatDataNumber(mov.price)} دينار`}
                      variant="outlined"
                      size="small"
                      color="primary"
                    />
                  ))}
                </Box>
              </Box>
            </Grid>
          )}

          {/* Material Popup */}
          {selectedMaterial && (
            <Grid size={{ xs: 12 }}>
              <MaterialPopup
                ref={materialPopupRef}
                availableMovements={availableMovements}
                handlePriceSelect={handlePriceSelect}
                selectedMaterial={selectedMaterial}
              />
            </Grid>
          )}

         

          {/* Notes — always visible */}
          <Grid size={{ xs: 12 }}>
            <TextField
              label="ملاحظات"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              size="small"
              fullWidth
              multiline
              rows={3}
            />
          </Grid>
        </Grid>
      </Box>
    ),
    [
      open,
      rtl,
      fixedWarehouseId,
      selectedMaterial,
      distributedMovements,
      formData,
      availableMovements,
      handleInputChange,
      onMaterialSelect,
      handlePriceSelect,
      isInternalTransfer,
      priceMethod,
      handlePriceMethodChange,
      IsMorInfo,
    ],
  );
  const renderFormActions = useCallback(
    () => (
      <>
        <Button
          variant="contained"
          color="primary"
          sx={{ mr: 1 }}
          onClick={handleAddToSalesList}
          disabled={!selectedMaterial || !formData.quantity}
        >
          إضافة إلى الوصل
        </Button>

        <Button onClick={handleClose} variant="outlined">
          إغلاق
        </Button>
      </>
    ),
    [handleAddToSalesList, handleClose, selectedMaterial, formData.quantity],
  );
  return (
    <div>
      <ButtonTheme
        variant="outlined"
        onClick={handleOpen}
        disableRipple
        startIcon={<Print sx={{ fontSize: "20px" }} />}
      >
        أضافة الى الوصل
      </ButtonTheme>
      <PopupForm
        title="إضافة مادة جديدة للوصل"
        open={open}
        onClose={handleClose}
        setOpen={setOpen}
        width="80%"
        isFullScreen={false}
        content={renderFormContent()}
        footer={renderFormActions()}
      />
    </div>
  );
};
