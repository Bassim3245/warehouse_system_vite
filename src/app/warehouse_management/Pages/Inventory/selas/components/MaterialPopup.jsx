import {
  useEffect,
  useState,
  useMemo,
  useImperativeHandle,
  forwardRef,
  useCallback,
} from "react";

import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Checkbox from "@mui/material/Checkbox";
import Box from "@mui/material/Box";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Print from "@mui/icons-material/Print";


import PopupForm from "../../../../../../components/reusableComponent/PopupForm";
import { FormatDataNumber, formatDateYearsMonth } from "../../../../../../utils/formatData";

export const MaterialPopup = forwardRef(
  ({ availableMovements, handlePriceSelect, selectedMaterial }, ref) => {
    const [open, setOpen] = useState(false);
    const [selectedMovements, setSelectedMovements] = useState([]);
    const [previouslySelectedData, setPreviouslySelectedData] = useState([]);

    // -----------------------------------------------------------
    // 📌 Expose reset function to parent
    // -----------------------------------------------------------
    useImperativeHandle(
      ref,
      () => ({
        resetSelections: () => {
          setSelectedMovements([]);
          setOpen(false);
        },
      }),
      []
    );

    // -----------------------------------------------------------
    // 📌 Handlers (memoized)
    // -----------------------------------------------------------
    const handleOpen = useCallback(() => setOpen(true), []);
    const handleClose = useCallback(() => {
      setOpen(false);
      setSelectedMovements([]);
    }, []);

    const handleCheckboxChange = useCallback((movement, isChecked) => {
      setSelectedMovements(prev => {
        const exists = prev.some(m => m.inventory_id === movement.inventory_id);
        if (isChecked) {
          return exists ? prev : [...prev, movement];
        }
        return prev.filter(m => m.inventory_id !== movement.inventory_id);
      });
    }, []);

    const handleConfirmSelection = useCallback(() => {
      if (selectedMovements.length > 0) {
        const sortedMovements = [...selectedMovements].sort(
          (a, b) => new Date(a.purchase_date) - new Date(b.purchase_date)
        );
        handlePriceSelect(sortedMovements);
        handleClose();
      }
    }, [selectedMovements, handlePriceSelect, handleClose]);

    // -----------------------------------------------------------
    // 📌 Auto Distribute FIFO
    // -----------------------------------------------------------
    const handleAutoDistribute = useCallback(() => {
      const dataToUse =
        availableMovements?.length > 0
          ? availableMovements
          : previouslySelectedData;

      const sorted = [...dataToUse].sort(
        (a, b) => new Date(a.purchase_date) - new Date(b.purchase_date)
      );

      setSelectedMovements(sorted);
    }, [availableMovements, previouslySelectedData]);

    // -----------------------------------------------------------
    // 📌 selected total quantity (memoized)
    // -----------------------------------------------------------
    const totalSelectedQuantity = useMemo(
      () =>
        selectedMovements.reduce((total, movement) => {
          const quantity = parseFloat(movement?.remaining_quantity) || 0;
          return total + quantity;
        }, 0),
      [selectedMovements]
    );

    // -----------------------------------------------------------
    // 📌 Avoid MUTATING availableMovements.reverse()
    // -----------------------------------------------------------
    const reversedAvailableMovements = useMemo(() => {
      return availableMovements?.length > 0
        ? [...availableMovements].reverse()
        : [];
    }, [availableMovements]);

    const tableData = useMemo(() => {
      if (availableMovements?.length > 0 && selectedMaterial.balance !== 0) {
        return reversedAvailableMovements;
      }
      if (previouslySelectedData?.length > 0) {
        return previouslySelectedData;
      }
      return [];
    }, [
      availableMovements,
      selectedMaterial?.balance,
      reversedAvailableMovements,
      previouslySelectedData,
    ]);

    // -----------------------------------------------------------
    // 📌 Handle previously saved selections
    // -----------------------------------------------------------
    useEffect(() => {
      if (availableMovements?.length > 0) {
        setSelectedMovements([]);
        setPreviouslySelectedData([]);
      } else {
        if (selectedMovements.length > 0) {
          setPreviouslySelectedData([...selectedMovements]);
        }
      }
    }, [availableMovements]);

    // -----------------------------------------------------------
    // 📌 Render Form Content
    // -----------------------------------------------------------
    const renderFormContent = useMemo(
      () => (
        <>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>تحديد الكمية</TableCell>
                  <TableCell>رقم المستند</TableCell>
                  <TableCell>الكمية</TableCell>
                  <TableCell>السعر</TableCell>
                  <TableCell>التاريخ</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {tableData.length > 0 ? (
                  tableData.map((movement, index) => {
                    const isSelected = selectedMovements.some(
                      m => m.inventory_id === movement.inventory_id
                    );

                    return (
                      <TableRow
                        key={index}
                        sx={{
                          backgroundColor: isSelected
                            ? "rgba(25, 118, 210, 0.08)"
                            : "inherit",
                          "&:hover": {
                            backgroundColor: isSelected
                              ? "rgba(25, 118, 210, 0.12)"
                              : "rgba(0, 0, 0, 0.04)",
                          },
                        }}
                      >
                        <TableCell>
                          <Checkbox
                            checked={isSelected}
                            onChange={e =>
                              handleCheckboxChange(
                                movement,
                                e.target.checked
                              )
                            }
                          />
                        </TableCell>

                        <TableCell>
                          {movement?.document_number || "غير متوفر"}
                        </TableCell>

                        <TableCell>
                          {FormatDataNumber(
                            movement?.remaining_quantity || 0
                          )}
                        </TableCell>

                        <TableCell>
                          {movement?.price
                            ? `${FormatDataNumber(movement.price)} دينار`
                            : "غير متوفر"}
                        </TableCell>

                        <TableCell>
                          {formatDateYearsMonth(
                            movement?.purchase_date
                          ) || "غير متوفر"}
                        </TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={5}>
                      <Typography sx={{ mt: 2, textAlign: "center" }}>
                        لا توجد معلومات توريد متاحة لهذه المادة
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {tableData.length > 0 && (
            <Box
              sx={{
                mt: 2,
                p: 2,
                backgroundColor: "rgba(0, 0, 0, 0.02)",
                borderRadius: 1,
              }}
            >
              <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                إجمالي جميع الكميات:{" "}
                {FormatDataNumber(
                  tableData.reduce(
                    (total, movement) =>
                      total + (parseFloat(movement?.remaining_quantity) || 0),
                    0
                  )
                )}
              </Typography>

              {selectedMovements.length > 0 && (
                <>
                  <Typography variant="body2" color="primary" sx={{ mt: 0.5 }}>
                    إجمالي المحدد: {FormatDataNumber(totalSelectedQuantity)}
                  </Typography>

                  <Box>
                    تم اختيار {selectedMovements.length} من أصل{" "}
                    {tableData.length} عنصر
                  </Box>
                </>
              )}
            </Box>
          )}
        </>
      ),
      [tableData, selectedMovements, totalSelectedQuantity, handleCheckboxChange]
    );

    // -----------------------------------------------------------
    // 📌 Render Actions (memoized)
    // -----------------------------------------------------------
    const renderFormActions = useMemo(
      () => (
        <>
          {tableData.length > 0 && (
            <Button variant="outlined" onClick={handleAutoDistribute} sx={{ mr: 1 }}>
              توزيع تلقائي (FIFO)
            </Button>
          )}

          <Button
            variant="contained"
            color="primary"
            onClick={handleConfirmSelection}
            disabled={selectedMovements.length === 0}
            sx={{ mr: 1 }}
          >
            تأكيد الاختيار ({selectedMovements.length}) - الكمية:{" "}
            {FormatDataNumber(totalSelectedQuantity)}
          </Button>

          <Button onClick={handleClose} variant="outlined">
            إغلاق
          </Button>
        </>
      ),
      [
        tableData.length,
        handleAutoDistribute,
        handleConfirmSelection,
        selectedMovements.length,
        totalSelectedQuantity,
        handleClose,
      ]
    );

    return (
      <div>
        <Button variant="outlined" onClick={handleOpen} disableRipple>
          <Print sx={{ fontSize: "20px" }} />
          <span className="ms-2">عرض أسعار التوريد</span>
        </Button>

        <PopupForm
          title={`أسعار التوريد - ${selectedMaterial?.name_of_material}`}
          open={open}
          onClose={handleClose}
          setOpen={setOpen}
          width="60%"
          is_margin={false}
          fullheight={false}
          content={renderFormContent}
          footer={renderFormActions}
        />
      </div>
    );
  }
);
