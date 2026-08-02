import React, { useEffect, useState } from "react";
import Search from "@mui/icons-material/Search";
import Inventory from "@mui/icons-material/Inventory";
import CheckCircle from "@mui/icons-material/CheckCircle";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

import InputAdornment from "@mui/material/InputAdornment";
import Chip from "@mui/material/Chip";
import Alert from "@mui/material/Alert";

import Autocomplete from "@mui/material/Autocomplete";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";

import useUserPermissions from "../../hooks/genaral/useUserPermissions";
const MaterialSearchSection = ({
  setSearchTerm,
  searchResults,
  selectedMaterial,
  setSelectedMaterial,
  selectedWarehouse,
  setSelectedWarehouse,
  searchLoading,
  handleMaterialSelect,
  wareHouseData,
}) => {
  const { rtl } = useUserPermissions();
  const [materialInputValue, setMaterialInputValue] = useState("");
  const [open, setOpen] = useState(false);

  // Handle warehouse change and clear selected material
  const handleWarehouseChange = (event, newValue) => {
    setSelectedWarehouse(newValue ? newValue.id : "");
    if (setSelectedMaterial) {
      setSelectedMaterial(null);
    }
  };
  // Handle material selection
  const handleMaterialChange = (event, newValue) => {
    if (newValue) {
      handleMaterialSelect(newValue);
      setMaterialInputValue(newValue.name_of_material);
    } else {
      setSelectedMaterial(null);
      setMaterialInputValue("");
    }
  };

  // Handle input change for material search
  const handleMaterialInputChange = (event, newInputValue) => {
    setMaterialInputValue(newInputValue);
    setSearchTerm(newInputValue);
  };

  useEffect(() => {
    // Clear search results when warehouse changes
    if (setSearchTerm) {
      setSearchTerm("");
      setMaterialInputValue("");
    }
  }, [selectedWarehouse, setSearchTerm]);

  return (
    <Card
      elevation={1}
      sx={{
        height: "fit-content",
        borderRadius: 1,
        overflow: "hidden",
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
          <SearchIcon />
          البحث عن المادة
        </Typography>
      </Box>

      <CardContent sx={{ p: 2 }}>
        <Stack spacing={3}>
          <Box dir={rtl?.dir}>
            <Typography
              variant="subtitle2"
              sx={{ mb: 1, color: "text.secondary" }}
            >
              اختيار المخزن
            </Typography>
            <Autocomplete
              fullWidth
              options={wareHouseData || []}
              getOptionLabel={(option) => option.name || ""}
              value={
                wareHouseData?.find((w) => w.id === selectedWarehouse) || null
              }
              onChange={handleWarehouseChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  dir={rtl?.dir}
                  label="المخزن"
                  placeholder="ابحث عن مخزن..."
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <InputAdornment position="start">
                        <InventoryIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 1,
                    },
                  }}
                />
              )}
              renderOption={(props, option) => (
                <Box
                  component="li"
                  dir={rtl?.dir}
                  {...props}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    p: 1,
                  }}
                >
                  <InventoryIcon sx={{ color: "primary.main", fontSize: 18 }} />
                  <Typography variant="body2">{option.name}</Typography>
                </Box>
              )}
              noOptionsText="لا توجد مخازن متاحة"
            />
            <Box>
              <Typography
                variant="subtitle2"
                sx={{ mb: 1, color: "text.secondary" }}
              >
                البحث في المواد
              </Typography>
              <Autocomplete
                fullWidth
                options={searchResults || []}
                getOptionLabel={(option) => option.name_of_material || ""}
                value={selectedMaterial}
                onChange={handleMaterialChange}
                inputValue={materialInputValue}
                onInputChange={handleMaterialInputChange}
                loading={searchLoading}
                open={open}
                onOpen={() => setOpen(true)}
                onClose={() => setOpen(false)}
                filterOptions={(options, params) => {
                  // Don't filter options as filtering is handled by the search
                  return options;
                }}
                isOptionEqualToValue={(option, value) =>
                  option.id === value?.id
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="البحث بالرقم الرمزي أو اسم المادة أو المواصفات"
                    placeholder="ابدأ بكتابة اسم المادة..."
                    InputProps={{
                      ...params.InputProps,
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon color="action" />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <>
                          {searchLoading ? (
                            <CircularProgress color="inherit" size={20} />
                          ) : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 1,
                      },
                    }}
                  />
                )}
                renderOption={(props, option) => (
                  <Box
                    component="li"
                    dir={rtl?.dir}
                    {...props}
                    sx={{
                      display: "flex",
                      p: 2,
                      borderBottom: "1px solid #f0f0f0",
                      "&:hover": {
                        backgroundColor: "#f8f9fa",
                      },
                    }}
                  >
                    <Box sx={{ mb: 1, p: 1 }}>
                      <Typography
                        variant="body2"
                        fontWeight="bold"
                        color="#333"
                        sx={{ fontSize: "0.875rem", mb: 0.5 }}
                      >
                        أسم المادة : {option.name_of_material}
                      </Typography>

                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ display: "block", fontSize: "0.75rem", mb: 0.5 }}
                      >
                        الرقم الرمزي: {option.cod_material}
                      </Typography>
                    </Box>
                    <Stack direction="column" spacing={0.5} useFlexGap>
                      <Chip
                        size="small"
                        label={` الرصيد الكلي: ${option.balance || 0}`}
                        color={option.balance > 0 ? "success" : "error"}
                        variant="outlined"
                        sx={{
                          fontSize: "0.7rem",
                          height: "20px",
                          "& .MuiChip-label": { px: 0.5 },
                        }}
                      />
                      <Chip
                        size="small"
                        label={`الحد الأدنى: ${option.minimum_stock_level || 0
                          }`}
                        color="default"
                        variant="outlined"
                        sx={{
                          fontSize: "0.7rem",
                          height: "20px",
                          "& .MuiChip-label": { px: 0.5 },
                        }}
                      />
                    </Stack>
                  </Box>
                )}
                noOptionsText={
                  materialInputValue.length < 2
                    ? "اكتب على الأقل حرفين للبحث"
                    : "لا توجد نتائج"
                }
                ListboxProps={{
                  sx: {
                    maxHeight: 400,
                    "& .MuiAutocomplete-option": {
                      padding: 0,
                    },
                  },
                }}
              />
            </Box>
          </Box>

          {/* معلومات المادة المختارة */}
          {selectedMaterial && (
            <Alert
              severity="success"
              icon={<CheckCircleIcon sx={{ fontSize: "16px" }} />}
              sx={{
                borderRadius: 1,
                backgroundColor: "#f9f9f9",
                border: "1px solid #e0e0e0",
                py: 0.5,
                "& .MuiAlert-message": {
                  width: "100%",
                  py: 0,
                },
              }}
            >
              <Box>
                <Typography
                  variant="caption"
                  fontWeight="bold"
                  sx={{ fontSize: "0.8rem", display: "block" }}
                >
                  تم اختيار المادة بنجاح
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ mt: 0.25, display: "block", fontSize: "0.75rem" }}
                >
                  <strong>اسم المادة:</strong>{" "}
                  {selectedMaterial?.name_of_material}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ display: "block", fontSize: "0.75rem" }}
                >
                  <strong>الرقم الرمزي:</strong>{" "}
                  {selectedMaterial?.cod_material}
                </Typography>
                {selectedMaterial?.specification && (
                  <Typography
                    variant="caption"
                    sx={{ display: "block", fontSize: "0.75rem" }}
                  >
                    <strong>المواصفات:</strong>{" "}
                    {selectedMaterial?.specification}
                  </Typography>
                )}
                {selectedMaterial?.balance && (
                  <Typography
                    variant="caption"
                    sx={{ display: "block", fontSize: "0.75rem" }}
                  >
                    <strong>الرصيد الكلي:</strong> {selectedMaterial?.balance}
                  </Typography>
                )}
              </Box>
            </Alert>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default MaterialSearchSection;
