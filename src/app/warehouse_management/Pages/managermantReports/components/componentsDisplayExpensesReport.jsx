
import Box from "@mui/material/Box";
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import ExcelJS from 'exceljs';
import { formatCurrency, FormatDataNumber, formatDateAr, formatTimeAr } from '../../../../../utils/formatData';
import Person from '@mui/icons-material/Person';

const DisplayExpensesReport = ({ dataItem }) => {
  if (!dataItem?.beneficiaries) {
    return (
      <Box sx={{ p: 8, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          لا توجد بيانات متاحة
        </Typography>
      </Box>
    );
  }
  const { beneficiaries, total_beneficiaries, grand_total } = dataItem;

  // Excel Export Function using ExcelJS
  const handleExportToExcel = async () => {
    try {
      const workbook = new ExcelJS.Workbook();
      workbook.creator = 'نظام إدارة المخازن';
      workbook.created = new Date();

      // Summary Sheet
      const summarySheet = workbook.addWorksheet('الملخص', {
        views: [{ rightToLeft: true }]
      });

      summarySheet.columns = [{ width: 30 }, { width: 30 }];

      // Add title
      summarySheet.mergeCells('A1:B1');
      const titleCell = summarySheet.getCell('A1');
      titleCell.value = 'تقرير المصروفات';
      titleCell.font = { size: 18, bold: true, color: { argb: 'FFFFFFFF' } };
      titleCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF667eea' }
      };
      titleCell.alignment = { horizontal: 'center', vertical: 'middle' };
      summarySheet.getRow(1).height = 40;

      // Add summary data
      summarySheet.addRow(['تاريخ التقرير', new Date().toLocaleDateString('ar-IQ')]);
      summarySheet.addRow(['عدد المستفيدين', total_beneficiaries]);
      summarySheet.addRow(['إجمالي المصروفات الكلي', `${formatCurrency(grand_total)} دينار`]);

      // Style summary rows
      [2, 3, 4].forEach(rowNum => {
        const row = summarySheet.getRow(rowNum);
        row.getCell(1).font = { bold: true };
        row.getCell(1).fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFF3F4F6' }
        };
        row.height = 25;
      });

      // Create a sheet for each beneficiary
      beneficiaries.forEach((beneficiary, index) => {
        const sheetName = `${beneficiary.beneficiary.substring(0, 25)}_${index + 1}`;
        const sheet = workbook.addWorksheet(sheetName, {
          views: [{ rightToLeft: true }]
        });

        // Header
        sheet.mergeCells('A1:M1');
        const headerCell = sheet.getCell('A1');
        headerCell.value = `المستفيد: ${beneficiary.beneficiary}`;
        headerCell.font = { size: 16, bold: true, color: { argb: 'FFFFFFFF' } };
        headerCell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FF3a7bd5' }
        };
        headerCell.alignment = { horizontal: 'center', vertical: 'middle' };
        sheet.getRow(1).height = 35;

        // Summary info
        sheet.addRow([`عدد المعاملات: ${beneficiary.total_transactions}`, '', '', '', '', '', '', '', `المجموع: ${formatCurrency(beneficiary.total_spent)} دينار`]);
        sheet.getRow(2).height = 25;
        sheet.getRow(2).font = { bold: true };

        sheet.addRow([]);

        // Table headers
        const headerRow = sheet.addRow([
          '#',
          'رقم الوثيقة',
          'رمز المادة',
          'اسم المادة',
          'المواصفات',
          'الكمية',
          'وحدة القياس',
          'السعر',
          'المبلغ الكلي',
          'المنشأ',
          'المخزن',
          'تاريخ الوثيقة',
          'تاريخ الصرف'
        ]);

        headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
        headerRow.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FF2c3e50' }
        };
        headerRow.alignment = { horizontal: 'center', vertical: 'middle' };
        headerRow.height = 30;

        // Add data rows
        beneficiary.transactions.forEach((transaction, idx) => {
          const row = sheet.addRow([
            idx + 1,
            transaction.document_number,
            transaction.material_code,
            transaction.material_name,
            transaction.specification,
            FormatDataNumber(transaction.total_quantity),
            transaction.measuring_unit,
            formatCurrency(transaction.price),
            formatCurrency(transaction.total_amount),
            transaction.origin,
            transaction.warehouse_name,
            new Date(transaction.document_date).toLocaleDateString('ar-IQ'),
            new Date(transaction.export_date).toLocaleDateString('ar-IQ')
          ]);

          // Alternate row colors
          if (idx % 2 === 0) {
            row.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'FFF8F9FA' }
            };
          }
          row.alignment = { horizontal: 'center', vertical: 'middle' };
          row.height = 22;
        });

        // Total row
        sheet.addRow([]);
        const totalRow = sheet.addRow(['', '', '', '', '', '', '', '', `مجموع المستفيد: ${formatCurrency(beneficiary.total_spent)} دينار`]);
        totalRow.font = { bold: true, size: 12 };
        totalRow.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FFe0f2f1' }
        };
        totalRow.height = 30;

        // Set column widths
        sheet.columns = [
          { width: 5 },
          { width: 15 },
          { width: 12 },
          { width: 25 },
          { width: 20 },
          { width: 10 },
          { width: 12 },
          { width: 12 },
          { width: 15 },
          { width: 12 },
          { width: 15 },
          { width: 15 },
          { width: 15 }
        ];

        // Add borders to all cells
        sheet.eachRow((row) => {
          row.eachCell((cell) => {
            cell.border = {
              top: { style: 'thin' },
              left: { style: 'thin' },
              bottom: { style: 'thin' },
              right: { style: 'thin' }
            };
          });
        });
      });

      // All Transactions Sheet
      const allSheet = workbook.addWorksheet('جميع المعاملات', {
        views: [{ rightToLeft: true }]
      });

      // Header
      allSheet.mergeCells('A1:N1');
      const allHeaderCell = allSheet.getCell('A1');
      allHeaderCell.value = 'جميع المعاملات';
      allHeaderCell.font = { size: 16, bold: true, color: { argb: 'FFFFFFFF' } };
      allHeaderCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF667eea' }
      };
      allHeaderCell.alignment = { horizontal: 'center', vertical: 'middle' };
      allSheet.getRow(1).height = 35;

      allSheet.addRow([]);

      // Table headers
      const allHeaderRow = allSheet.addRow([
        '#',
        'المستفيد',
        'رقم الوثيقة',
        'رمز المادة',
        'اسم المادة',
        'المواصفات',
        'الكمية',
        'وحدة القياس',
        'السعر',
        'المبلغ الكلي',
        'المنشأ',
        'المخزن',
        'تاريخ الوثيقة',
        'تاريخ الصرف'
      ]);

      allHeaderRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      allHeaderRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF2c3e50' }
      };
      allHeaderRow.alignment = { horizontal: 'center', vertical: 'middle' };
      allHeaderRow.height = 30;

      // Add all transactions
      let rowNumber = 1;
      beneficiaries.forEach((beneficiary) => {
        beneficiary.transactions.forEach((transaction, idx) => {
          const row = allSheet.addRow([
            rowNumber++,
            beneficiary.beneficiary,
            transaction.document_number,
            transaction.material_code,
            transaction.material_name,
            transaction.specification,
            FormatDataNumber(transaction.total_quantity),
            transaction.measuring_unit,
            formatCurrency(transaction.price),
            formatCurrency(transaction.total_amount),
            transaction.origin,
            transaction.warehouse_name,
            new Date(transaction.document_date).toLocaleDateString('ar-IQ'),
            new Date(transaction.export_date).toLocaleDateString('ar-IQ')
          ]);

          if (idx % 2 === 0) {
            row.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'FFF8F9FA' }
            };
          }
          row.alignment = { horizontal: 'center', vertical: 'middle' };
          row.height = 22;
        });
      });

      // Grand total row
      allSheet.addRow([]);
      const grandTotalRow = allSheet.addRow(['', '', '', '', '', '', '', '', '', `الإجمالي الكلي: ${formatCurrency(grand_total)} دينار`]);
      grandTotalRow.font = { bold: true, size: 12 };
      grandTotalRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFe0f2f1' }
      };
      grandTotalRow.height = 30;

      // Set column widths
      allSheet.columns = [
        { width: 5 },
        { width: 20 },
        { width: 15 },
        { width: 12 },
        { width: 25 },
        { width: 20 },
        { width: 10 },
        { width: 12 },
        { width: 12 },
        { width: 15 },
        { width: 12 },
        { width: 15 },
        { width: 15 },
        { width: 15 }
      ];

      // Add borders
      allSheet.eachRow((row) => {
        row.eachCell((cell) => {
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' }
          };
        });
      });

      // Generate file
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `تقرير_المصروفات_${new Date().toLocaleDateString('ar-IQ').replace(/\//g, '-')}.xlsx`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      alert('حدث خطأ أثناء تصدير البيانات إلى Excel');
    }
  };

  return (
    <Box
      sx={{
        p: { xs: 1, sm: 2, md: 4 },
        maxWidth: 1600,
        mx: 'auto',
        backgroundColor: '#f8f9fa',
        minHeight: '100vh'
      }}
      dir="rtl"
    >
      {/* Header Section */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 3, md: 4 },
          mb: { xs: 2, md: 4 },
          backgroundColor: '#ffffff',
          borderRadius: 2,
          border: '1px solid #e0e0e0'
        }}
      >
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            mb: 3,
            color: '#2c3e50',
            textAlign: 'center',
            fontSize: { xs: '1.5rem', md: '2.125rem' },
            letterSpacing: '0.5px'
          }}
        >
          📊 تقرير المصروفات
        </Typography>

        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={3} justifyContent="center" alignItems="center">
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ textAlign: 'center', p: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                عدد المستفيدين
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 600, color: '#5a6c7d' }}>
                {FormatDataNumber(total_beneficiaries)}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ textAlign: 'center', p: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                تاريخ التقرير
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 500, color: '#5a6c7d' }}>
                {formatDateAr(new Date())}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={12} md={6}>
            <Box sx={{ textAlign: 'center', p: { xs: 1, md: 2 } }}>
              <Button
                variant="contained"
                color="success"
                size="large"
                fullWidth
                startIcon={<FileDownloadIcon />}
                onClick={handleExportToExcel}
                sx={{
                  maxWidth: { xs: '100%', md: 300 },
                  py: 1.5,
                  fontWeight: 600,
                  boxShadow: 2,
                  '&:hover': {
                    boxShadow: 4,
                    transform: 'translateY(-2px)',
                    transition: 'all 0.3s'
                  }
                }}
              >
                تصدير إلى Excel
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>

      {/* Grand Total Card */}
      <Card
        elevation={0}
        sx={{
          mb: 4,
          borderRadius: 2,
          overflow: 'hidden'
        }}
      >
        <CardContent sx={{ textAlign: 'center', p: { xs: 2, md: 4 } }}>
          <Typography
            variant="h6"
            sx={{
              mb: { xs: 1, md: 2 },
              fontWeight: 500,
              fontSize: { xs: '1.1rem', md: '1.25rem' }
            }}
          >
             إجمالي المصروفات الكلي
          </Typography>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              fontSize: { xs: '1.8rem', sm: '2.5rem', md: '3rem' },
              textShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            {formatCurrency(grand_total)} دينار
          </Typography>
        </CardContent>
      </Card>

      {/* Beneficiaries Reports */}
      {beneficiaries.map((beneficiary, index) => (
        <Paper
          key={index}
          elevation={0}
          sx={{
            mb: 4,
            overflow: 'hidden',
            borderRadius: 2,
            border: '1px solid #e0e0e0'
          }}
        >
          {/* Beneficiary Header */}
          <Box
            sx={{
              background: 'linear-gradient(135deg, #3a7bd5 0%, #00d2ff 100%)',
              color: 'white',
              p: { xs: 2, md: 3 }
            }}
          >
            <Grid container justifyContent="space-between" alignItems="center" spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 1, fontSize: { xs: '1.25rem', md: '1.5rem' } }}>
                  <Person sx={{ verticalAlign: 'middle', mr: 1 }}/> {beneficiary.beneficiary}
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.95 }}>
                  المستفيد رقم {index + 1}
                </Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{
                  display: { xs: 'flex', md: 'inline-block' },
                  flexDirection: { xs: 'column', sm: 'row' },
                  justifyContent: 'space-between',
                  alignItems: { xs: 'flex-start', sm: 'center' },
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  borderRadius: 2,
                  p: 2,
                  backdropFilter: 'blur(10px)',
                  width: { xs: '100%', md: 'auto' },
                  float: { md: 'left' } // equivalent to right in LTR, aligns to left in RTL
                }}>
                  <Typography variant="body2" sx={{ mb: { xs: 1, sm: 0 }, mr: { sm: 2 } }}>
                    عدد المعاملات: {FormatDataNumber(beneficiary.total_transactions)}
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700, fontSize: { xs: '1.1rem', md: '1.25rem' } }}>
                    المجموع: {formatCurrency(beneficiary.total_spent)} دينار
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>

          {/* Transactions Table */}
          <TableContainer sx={{ maxHeight: 600, overflowX: 'auto' }}>
            <Table stickyHeader size="small" sx={{ minWidth: 900 }}>
              <TableHead>
                <TableRow sx={{ '& th': { fontWeight: 700, backgroundColor: '#f8f9fa', color: '#2c3e50', borderBottom: '2px solid #dee2e6', fontSize: '0.875rem', py: 1.5, whiteSpace: 'nowrap', px: 2 } }}>
                  <TableCell align="center">#</TableCell>
                  <TableCell align="center">رقم الوثيقة</TableCell>
                  <TableCell align="center">رمز المادة</TableCell>
                  <TableCell align="center">اسم المادة</TableCell>
                  <TableCell align="center">المواصفات</TableCell>
                  <TableCell align="center">الكمية</TableCell>
                  <TableCell align="center">وحدة القياس</TableCell>
                  <TableCell align="center">السعر</TableCell>
                  <TableCell align="center">المبلغ الكلي</TableCell>
                  <TableCell align="center">المنشأ</TableCell>
                  <TableCell align="center">المخزن</TableCell>
                  <TableCell align="center">تاريخ الوثيقة</TableCell>
                  <TableCell align="center">تاريخ الصرف</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {beneficiary.transactions.map((transaction, idx) => (
                  <TableRow
                    key={transaction.transaction_id}
                    sx={{
                      '&:nth-of-type(even)': { backgroundColor: '#f8f9fa' },
                      '&:hover': { backgroundColor: '#e9ecef', transition: 'background-color 0.2s ease' },
                      '& td': { fontSize: '0.875rem', py: 1.5, whiteSpace: 'nowrap', px: 2 }
                    }}
                  >
                    <TableCell align="center" sx={{ fontWeight: 600, color: '#6c757d' }}>{idx + 1}</TableCell>
                    <TableCell align="center">{transaction.document_number}</TableCell>
                    <TableCell align="center">{transaction.material_code}</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 500 }}>{transaction.material_name}</TableCell>
                    <TableCell align="center">{transaction.specification}</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 600 }}>{FormatDataNumber(transaction.total_quantity)}</TableCell>
                    <TableCell align="center">{transaction.measuring_unit}</TableCell>
                    <TableCell align="center" sx={{ color: '#495057' }}>{formatCurrency(transaction.price)}</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 700, color: '#3a7bd5' }}>{formatCurrency(transaction.total_amount)}</TableCell>
                    <TableCell align="center">{transaction.origin}</TableCell>
                    <TableCell align="center">{transaction.warehouse_name}</TableCell>
                    <TableCell align="center" sx={{ color: '#6c757d' }}>{formatDateAr(transaction.document_date)}</TableCell>
                    <TableCell align="center" sx={{ color: '#6c757d' }}>{formatDateAr(transaction.export_date)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Beneficiary Total Footer */}
          <Box
            sx={{
              p: 3,
              background: 'linear-gradient(135deg, #e0f2f1 0%, #b2dfdb 100%)',
              borderTop: '2px solid #80cbc4'
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                textAlign: 'center',
                color: '#00695c',
                fontSize: { xs: '1.1rem', md: '1.25rem' }
              }}
            >
              💵 مجموع المستفيد: {formatCurrency(beneficiary.total_spent)} دينار
            </Typography>
          </Box>
        </Paper>
      ))}

      {/* Footer */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mt: 4,
          backgroundColor: '#ffffff',
          borderRadius: 2,
          border: '1px solid #e0e0e0',
          textAlign: 'center'
        }}
      >
        <Typography variant="body2" color="text.secondary">
          تم إنشاء التقرير بتاريخ {formatDateAr(new Date())} - {formatTimeAr(new Date())}
        </Typography>
      </Paper>
    </Box>
  );
};

export default DisplayExpensesReport;
