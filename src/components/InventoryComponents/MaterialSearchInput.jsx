import { useEffect, useState, useCallback } from "react";
import SearchIcon from "@mui/icons-material/Search";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";

import useSerchMateril from "../../hooks/Material/useSerchMateril";
import { FormatDataNumber } from "../../utils/formatData";

const inputStyles = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 1,
  },
};

/**
 * Reusable material search input bound to a warehouseId.
 * - Fetches only when user types >= 2 chars and warehouseId is provided.
 * - Calls onSelect with the chosen material or null.
 */
const MaterialSearchInput = ({
  warehouseId,
  selectedMaterial,
  onSelect,
  dir = "rtl",
  label = "البحث بالرقم الرمزي أو اسم المادة أو المواصفات",
  placeholder = "ابدأ بكتابة اسم المادة...",
  open = false,
}) => {
  const [materialInputValue, setMaterialInputValue] = useState("");
  const {
    searchMaterials,
    searchResults,
    loading,
    setSearchTerm,
    searchTerm,
    loadMore,
    hasMore,
  } = useSerchMateril({ warehouseId });

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Keep input in sync when selected material changes externally
  useEffect(() => {
    if (selectedMaterial?.name_of_material) {
      setMaterialInputValue(selectedMaterial.name_of_material);
      setSearchTerm(selectedMaterial.name_of_material);
    }
  }, [selectedMaterial, setSearchTerm]);

  // Trigger search when user types and warehouse id is set
  useEffect(() => {
    searchMaterials();
  }, [warehouseId, searchTerm, searchMaterials]);

  const handleMaterialChange = useCallback(
    (event, newValue) => {
      if (newValue && newValue.isLoadMore) {
        // Handle in renderOption onClick or here
        return;
      }
      if (newValue) {
        onSelect?.(newValue);
        setMaterialInputValue(newValue?.name_of_material || "");
        setSearchTerm(newValue?.name_of_material || "");
      } else {
        onSelect?.(null);
        setMaterialInputValue("");
        setSearchTerm("");
      }
    },
    [onSelect, setSearchTerm]
  );

  const handleMaterialInputChange = useCallback(
    (event, newInputValue, reason) => {
      if (reason === "input") {
        setMaterialInputValue(newInputValue);
        setSearchTerm(newInputValue);
      } else if (reason === "reset") {
        // If it's a reset (like when selecting or loading more), only update if menu is closed
        if (!isMenuOpen) {
           setMaterialInputValue(newInputValue);
        }
      }
    },
    [setSearchTerm, isMenuOpen]
  );

  const options =
    hasMore
      ? [...(searchResults || []), { isLoadMore: true, id: "load-more-btn" }]
      : searchResults || [];

  return (
    <Autocomplete
      fullWidth
      options={options}
      getOptionLabel={(option) => option?.name_of_material || ""}
      value={selectedMaterial || null}
      onChange={handleMaterialChange}
      inputValue={materialInputValue}
      onInputChange={handleMaterialInputChange}
      loading={loading}
      open={isMenuOpen}
      onOpen={() => setIsMenuOpen(true)}
      onClose={(event, reason) => {
        // Prevent closing if the user clicked the Load More virtual option
        if (reason === "selectOption") {
           // We'll manage closing manually if needed, but for regular options it's fine.
           // However, selectOption reason usually means something was chosen.
        }
        setIsMenuOpen(false);
      }}
      filterOptions={(options) => options}
      isOptionEqualToValue={(option, value) => option.id === value?.id}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={placeholder}
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            endAdornment: (
              <>
                {loading ? (
                  <CircularProgress color="inherit" size={20} />
                ) : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
          sx={inputStyles}
        />
      )}
      renderOption={(props, option) => {
        if (option.isLoadMore) {
          return (
            <Box
              component="li"
              {...props}
              key="load-more-btn"
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                p: 1.5, // Increased padding
                borderTop: "1px solid #f0f0f0",
                backgroundColor: "#f8f9fa !important",
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: "#e9ecef !important",
                },
              }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                loadMore();
              }}
            >
              <Typography
                variant="body2"
                color="primary"
                fontWeight="bold"
                sx={{ display: "flex", alignItems: "center", gap: 1 }}
              >
                {loading ? (
                  <CircularProgress size={16} color="inherit" />
                ) : null}
                عرض المزيد ...
              </Typography>
            </Box>
          );
        }

        return (
          <Box
            component="li"
            dir={dir}
            {...props}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
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
                أسم المادة : {option?.name_of_material}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block", fontSize: "0.75rem", mb: 0.5 }}
              >
                الرقم الرمزي: {option?.cod_material || ""}
              </Typography>
            </Box>
            <Stack direction="column" spacing={0.5} useFlexGap>
              <Chip
                size="small"
                label={` الرصيد الكلي: ${FormatDataNumber(option?.balance || 0)}`}
                color={option?.balance > 0 ? "success" : "error"}
                variant="outlined"
                sx={{
                  fontSize: "0.7rem",
                  height: "20px",
                  "& .MuiChip-label": { px: 0.5 },
                }}
              />
              <Chip
                size="small"
                label={`الحد الأدنى: ${option.minimum_stock_level || 0}`}
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
        );
      }}
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
  );
};

export default MaterialSearchInput;
