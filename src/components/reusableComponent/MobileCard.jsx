import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { memo, useCallback } from "react";
import { alpha } from "@mui/material/styles";

// مكون الكارد للموبايل
const MobileCard = memo(({ row, columns, isSelected, onSelect, getRowClassName, theme }) => {
  const rowClass = getRowClassName ? getRowClassName({ row }) : '';
  
  // تحديد لون الخلفية بناءً على الكلاس
  const getBackgroundColor = () => {
    if (rowClass.includes('highlighted-row-ended')) {
      return alpha(theme.palette.success.light, 0.15);
    }
    if (rowClass.includes('highlighted-row-CompleteProject')) {
      return alpha(theme.palette.success.main, 0.15);
    }
    if (rowClass.includes('highlighted-row-expired')) {
      return alpha(theme.palette.error.light, 0.15);
    }
    if (rowClass.includes('highlighted-row-near-expiration')) {
      return alpha(theme.palette.warning.light, 0.15);
    }
    return theme.palette.mode === 'dark' 
      ? alpha(theme.palette.background.paper, 0.6)
      : alpha(theme.palette.background.paper, 0.9);
  };

  return (
    <Card
      sx={{
        mb: 2,
        backgroundColor: getBackgroundColor(),
        border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        borderRadius: 2,
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: theme.shadows[4],
          transform: 'translateY(-2px)',
        },
        position: 'relative',
      }}
    >
      <CardContent sx={{ p: 2 }}>
        {onSelect && (
          <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
            <Checkbox
              checked={isSelected}
              onChange={() => onSelect(row)}
              sx={{
                color: theme.palette.primary.main,
                '&.Mui-checked': {
                  color: theme.palette.primary.main,
                },
              }}
            />
          </Box>
        )}
        
        <Stack spacing={1.5}>
          {columns.map((column) => {
            // تخطي الأعمدة المخفية
            if (column.field === 'id' || column.field === 'stagnant_id' || !column.headerName) {
              return null;
            }

            const value = row[column.field];
            
            // تخطي القيم الفارغة
            if (value === null || value === undefined || value === '') {
              return null;
            }

            return (
              <Box key={column.field}>
                <Typography
                  variant="caption"
                  sx={{
                    color: theme.palette.text.secondary,
                    fontWeight: 600,
                    fontSize: '0.75rem',
                    mb: 0.5,
                    display: 'block',
                    fontFamily: 'Cairo, sans-serif',
                  }}
                >
                  {column.headerName}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: theme.palette.text.primary,
                    fontWeight: 400,
                    fontSize: '0.875rem',
                    fontFamily: 'Cairo, sans-serif',
                    wordBreak: 'break-word',
                  }}
                >
                  {column.renderCell 
                    ? column.renderCell({ row, value, field: column.field })
                    : value}
                </Typography>
              </Box>
            );
          })}
        </Stack>
      </CardContent>
    </Card>
  );
});

MobileCard.displayName = 'MobileCard';

// المكون الرئيسي
const MobileCardGrid = ({
  columns,
  rows = [],
  page = 1,
  limit = 10,
  totalItems = 0,
  loading,
  totalPages = 0,
  checkboxSelection = false,
  selectionModel = [],
  setPage = (newPage) => {},
  setLimit = (newLimit) => {},
  setSelectionModel = (newSelection) => {},
  getRowId = (row) => row.index,
  getRowClassName,
  showDesktopView = false,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // دالة معالجة الاختيار
  const handleSelect = useCallback((row) => {
    const rowId = getRowId(row);
    const isSelected = selectionModel.includes(rowId);
    
    if (isSelected) {
      setSelectionModel(selectionModel.filter(id => id !== rowId));
    } else {
      setSelectionModel([...selectionModel, rowId]);
    }
  }, [selectionModel, setSelectionModel, getRowId]);

  // دالة تغيير الصفحة
  const handlePageChange = useCallback((event, newPage) => {
    setPage(newPage);
  }, [setPage]);

  // عرض رسالة في حالة عدم وجود بيانات
  if (rows.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: 300,
          p: 3,
        }}
      >
        <Paper
          sx={{
            p: 4,
            textAlign: 'center',
            backgroundColor: theme.palette.mode === 'dark'
              ? alpha(theme.palette.background.paper, 0.6)
              : alpha(theme.palette.background.paper, 0.9),
          }}
        >
          <Typography variant="h6" color="text.secondary" sx={{ fontFamily: 'Cairo, sans-serif' }}>
            لا توجد بيانات لعرضها
          </Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', p: { xs: 1, sm: 2 } }}>
      {/* عرض الكاردات */}
      <Box sx={{ mb: 2 }}>
        {rows?.map((row) => {
          const rowId = getRowId(row);
          const isSelected = selectionModel.includes(rowId);
          
          return (
            <MobileCard
              key={rowId}
              row={row}
              columns={columns}
              isSelected={isSelected}
              onSelect={checkboxSelection ? handleSelect : null}
              getRowClassName={getRowClassName}
              theme={theme}
            />
          );
        })}
      </Box>

      {/* الترقيم */}
      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, mb: 2 }}>
          <Paper
            sx={{
              p: 2,
              backgroundColor: theme.palette.mode === 'dark'
                ? alpha(theme.palette.background.paper, 0.6)
                : alpha(theme.palette.background.paper, 0.9),
            }}
          >
            <Stack spacing={2} alignItems="center">
              <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'Cairo, sans-serif' }}>
                الصفحة {page} من {totalPages} - إجمالي السجلات: {totalItems}
              </Typography>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                size={isMobile ? "small" : "medium"}
                showFirstButton
                showLastButton
                sx={{
                  '& .MuiPaginationItem-root': {
                    fontFamily: 'Cairo, sans-serif',
                  },
                }}
              />
            </Stack>
          </Paper>
        </Box>
      )}

      {/* معلومات الاختيار */}
      {checkboxSelection && selectionModel.length > 0 && (
        <Box sx={{ position: 'fixed', bottom: 16, left: '50%', transform: 'translateX(-50%)', zIndex: 1000 }}>
          <Chip
            label={`تم تحديد ${selectionModel.length} عنصر`}
            color="primary"
            sx={{
              fontFamily: 'Cairo, sans-serif',
              fontWeight: 600,
              fontSize: '0.875rem',
              boxShadow: theme.shadows[4],
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default memo(MobileCardGrid);