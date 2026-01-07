import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Checkbox from "@mui/material/Checkbox";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Collapse from "@mui/material/Collapse";
import Divider from "@mui/material/Divider";
import { useTheme } from "@mui/material/styles";
import { memo, useCallback, useState } from "react";
import { alpha } from "@mui/material/styles";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';

/**
 * MobileCard - مكون الكارد الفردي المحسّن
 * يعرض بيانات صف واحد على شكل كارد منسق مع إمكانية التوسيع
 */
const MobileCard = memo(({ row, columns, isSelected, onSelect, getRowClassName, theme, mainColor }) => {
  const [expanded, setExpanded] = useState(false);
  const rowClass = getRowClassName ? getRowClassName({ row }) : '';
  
  // فصل الأعمدة إلى رئيسية وثانوية
  const visibleColumns = columns.filter(col => 
    col.field !== 'id' && 
    col.field !== 'stagnant_id' && 
    col.headerName &&
    !col.hide
  );

  // فصل حقل Action (الإجراءات) ليكون في مكان خاص
  const actionColumn = visibleColumns.find(col => 
    col.field === 'Action' || col.field === 'action' || col.field === 'actions'
  );
  const dataColumns = visibleColumns.filter(col => 
    col.field !== 'Action' && col.field !== 'action' && col.field !== 'actions'
  );

  // أول 3 أعمدة فقط للعرض الأولي (بدون Action)
  const primaryColumns = dataColumns.slice(0, 3);
  const secondaryColumns = dataColumns.slice(3);
  
  // تحديد لون الخلفية بناءً على الكلاس - مطابق لـ StyledDataGrid
  const getBackgroundColor = () => {
    if (rowClass.includes('highlighted-row-ended')) {
      return alpha(theme.palette.success.light, 0.2);
    }
    if (rowClass.includes('highlighted-row-CompleteProject')) {
      return alpha(theme.palette.success.main, 0.2);
    }
    if (rowClass.includes('highlighted-row-expired')) {
      return alpha(theme.palette.error.light, 0.2);
    }
    if (rowClass.includes('highlighted-row-near-expiration')) {
      return alpha(theme.palette.warning.light, 0.2);
    }
    if (rowClass.includes('highlighted-row-odd')) {
      return alpha(theme.palette.warning.light, 0.1);
    }
    if (rowClass.includes('highlighted-row-even')) {
      return theme.palette.mode === 'dark'
        ? alpha(theme.palette.common.white, 0.05)
        : alpha(theme.palette.primary.light, 0.05);
    }
    if (rowClass.includes('highlighted-row-copy')) {
      return alpha(theme.palette.info.light, 0.1);
    }
    return theme.palette.mode === 'dark' 
      ? alpha(theme.palette.background.paper, 0.8)
      : theme.palette.background.paper;
  };

  const handleToggle = () => {
    setExpanded(!expanded);
  };

  const renderFieldValue = (column, isActionField = false) => {
    const value = row[column.field];
    
    // إذا كان في renderCell، استخدمه مباشرة
    if (column.renderCell) {
      const cellContent = column.renderCell({ 
        row, 
        value, 
        field: column.field,
        id: row.id || row.index,
      });
      
      // إذا كان المحتوى عبارة عن مكون React
      if (cellContent) {
        return (
          <Box key={column.field} sx={{ mb: isActionField ? 0 : 1.5, width: '100%' }}>
            {!isActionField && (
              <Typography
                variant="caption"
                sx={{
                  color: alpha(mainColor || theme.palette.primary.main, 0.8),
                  fontWeight: 600,
                  fontSize: '0.7rem',
                  mb: 0.5,
                  display: 'block',
                  fontFamily: 'Cairo, sans-serif',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}
              >
                {column.headerName}
              </Typography>
            )}
            <Box sx={{ mt: isActionField ? 0 : 0.5, display: 'flex', justifyContent: isActionField ? 'center' : 'flex-start' }}>
              {cellContent}
            </Box>
          </Box>
        );
      }
    }
    
    // إذا القيمة فارغة، لا تعرض شيء
    if (value === null || value === undefined || value === '') {
      return null;
    }

    // عرض القيمة العادية
    return (
      <Box key={column.field} sx={{ mb: 1.5 }}>
        <Typography
          variant="caption"
          sx={{
            color: alpha(mainColor || theme.palette.primary.main, 0.8),
            fontWeight: 600,
            fontSize: '0.7rem',
            mb: 0.3,
            display: 'block',
            fontFamily: 'Cairo, sans-serif',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}
        >
          {column.headerName}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: theme.palette.text.primary,
            fontWeight: 500,
            fontSize: '0.875rem',
            fontFamily: 'Cairo, sans-serif',
            wordBreak: 'break-word',
            lineHeight: 1.5,
          }}
        >
          {value}
        </Typography>
      </Box>
    );
  };

  return (
    <Card
      sx={{
        mb: 2,
        backgroundColor: getBackgroundColor(),
        border: theme.palette.mode === 'dark'
          ? `1px solid ${alpha(theme.palette.divider, 0.2)}`
          : `1px solid ${alpha(theme.palette.divider, 0.15)}`,
        boxShadow: theme.shadows[2],
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: theme.shadows[4],
          transform: 'translateY(-2px)',
          borderColor: alpha(mainColor || theme.palette.primary.main, 0.3),
        },
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* شريط علوي ملون */}
      <Box
        sx={{
          height: '4px',
          backgroundColor: mainColor || theme.palette.primary.main,
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
        }}
      />

      <CardContent sx={{ p: 2, pt: 2.5, '&:last-child': { pb: 2 } }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1.5 }}>
          {/* Checkbox */}
          {onSelect && (
            <Checkbox
              checked={isSelected}
              onChange={() => onSelect(row)}
              sx={{
                color: mainColor || theme.palette.primary.main,
                p: 0.5,
                mr: 1,
                '&.Mui-checked': {
                  color: mainColor || theme.palette.primary.main,
                },
              }}
            />
          )}
          
          {/* المحتوى الرئيسي */}
          <Box sx={{ flex: 1 }}>
            <Stack spacing={0}>
              {primaryColumns.map(column => renderFieldValue(column))}
            </Stack>
          </Box>

          {/* زر التوسيع */}
          {secondaryColumns.length > 0 && (
            <IconButton
              onClick={handleToggle}
              sx={{
                color: mainColor || theme.palette.primary.main,
                ml: 1,
                transition: 'transform 0.3s ease',
                transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
              }}
              size="small"
            >
              {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          )}
        </Box>

        {/* المحتوى الإضافي القابل للتوسيع */}
        {secondaryColumns.length > 0 && (
          <>
            <Collapse in={expanded} timeout="auto" unmountOnExit>
              <Divider 
                sx={{ 
                  my: 1.5,
                  borderColor: alpha(theme.palette.divider, 0.3)
                }} 
              />
              <Stack spacing={0}>
                {secondaryColumns.map(column => renderFieldValue(column))}
              </Stack>
            </Collapse>

            {/* مؤشر عدد الحقول الإضافية */}
            {!expanded && (
              <Box 
                sx={{ 
                  textAlign: 'center', 
                  mt: 1,
                  pt: 1,
                  borderTop: `1px dashed ${alpha(theme.palette.divider, 0.2)}`
                }}
              >
                <Chip
                  label={`${secondaryColumns.length} حقل إضافي`}
                  size="small"
                  onClick={handleToggle}
                  sx={{
                    backgroundColor: alpha(mainColor || theme.palette.primary.main, 0.1),
                    color: mainColor || theme.palette.primary.main,
                    fontFamily: 'Cairo, sans-serif',
                    fontSize: '0.7rem',
                    fontWeight: 600,
                    height: '24px',
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: alpha(mainColor || theme.palette.primary.main, 0.2),
                    }
                  }}
                />
              </Box>
            )}
          </>
        )}

        {/* قسم الإجراءات - يظهر دائماً في الأسفل */}
        {actionColumn && (
          <Box 
            sx={{ 
              mt: 2,
              pt: 1.5,
              borderTop: `2px solid ${alpha(theme.palette.divider, 0.15)}`,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {renderFieldValue(actionColumn, true)}
          </Box>
        )}
      </CardContent>
    </Card>
  );
});

MobileCard.displayName = 'MobileCard';

/**
 * MobileCardView - المكون الرئيسي لعرض الكاردات
 * يستخدم على الموبايل والتابلت كبديل للجدول
 */
const MobileCardView = ({
  columns,
  rows = [],
  checkboxSelection = false,
  selectionModel = [],
  setSelectionModel = (newSelection) => {},
  getRowId = (row) => row.index,
  getRowClassName,
  mainColor,
}) => {
  const theme = useTheme();
  
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
              ? alpha(theme.palette.background.paper, 0.7)
              : alpha(theme.palette.background.paper, 0.5),
            backdropFilter: 'blur(4px)',
            borderRadius: theme.shape.borderRadius,
          }}
        >
          <Typography 
            variant="h6" 
            color="text.secondary" 
            sx={{ fontFamily: 'Cairo, sans-serif' }}
          >
            لا توجد بيانات لعرضها
          </Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      {/* عرض الكاردات */}
      <Box>
        {rows.map((row) => {
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
              mainColor={mainColor}
            />
          );
        })}
      </Box>

      {/* معلومات الاختيار العائمة */}
      {checkboxSelection && selectionModel.length > 0 && (
        <Box 
          sx={{ 
            position: 'fixed', 
            bottom: 20, 
            left: '50%', 
            transform: 'translateX(-50%)', 
            zIndex: 1000,
            animation: 'slideUp 0.3s ease-out',
            '@keyframes slideUp': {
              from: {
                transform: 'translateX(-50%) translateY(100px)',
                opacity: 0,
              },
              to: {
                transform: 'translateX(-50%) translateY(0)',
                opacity: 1,
              }
            }
          }}
        >
          <Chip
            label={`✓ تم تحديد ${selectionModel.length} عنصر`}
            sx={{
              backgroundColor: mainColor || theme.palette.primary.main,
              color: theme.palette.getContrastText(mainColor || theme.palette.primary.main),
              fontFamily: 'Cairo, sans-serif',
              fontWeight: 700,
              fontSize: '0.875rem',
              height: '40px',
              px: 2,
              boxShadow: theme.shadows[8],
              '&:hover': {
                backgroundColor: alpha(mainColor || theme.palette.primary.main, 0.9),
              }
            }}
          />
        </Box>
      )}
    </Box>
  );
};

export default memo(MobileCardView);