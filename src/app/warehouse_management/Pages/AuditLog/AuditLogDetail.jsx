import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Box,
    Typography,
    Grid,
    Paper,
    IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import InfoIcon from '@mui/icons-material/Info';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import { ButtonTheme } from '../../../../style/ButtomStyle';
import { Visibility } from '@mui/icons-material';

const AuditLogDetail = ({ item }) => {

    const [open, setOpen] = React.useState(false);

    const onClose = () => {
        setOpen(false);
    };
    const handleOpen = () => {
        setOpen(true);
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('ar-EG', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    const renderDiff = () => {
        if (!item.before_data && !item.after_data) {
            return (
                <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ py: 3 }}>
                    لا توجد بيانات للمقارنة
                </Typography>
            );
        }

        const before = item.before_data || {};
        const after = item.after_data || {};

        return (
            <Box
                sx={{
                    bgcolor: '#1e1e1e',
                    p: 2,
                    borderRadius: 1,
                    fontFamily: 'monospace',
                    fontSize: '0.875rem',
                    maxHeight: 500,
                    overflow: 'auto'
                }}
            >
                {/* عرض بيانات Export */}
                {before.export && (
                    <Box sx={{ mb: 3 }}>
                        <Typography sx={{ color: '#ffd43b', fontWeight: 600, mb: 1, fontSize: '1rem' }}>
                            📤 بيانات الصرف (Export):
                        </Typography>

                        {/* Before Export */}
                        <Box sx={{ bgcolor: 'rgba(255, 107, 107, 0.15)', p: 1.5, borderRadius: 1, mb: 1, border: '1px solid rgba(255, 107, 107, 0.3)' }}>
                            <Typography sx={{ color: '#ff6b6b', fontWeight: 600, mb: 1 }}>
                                ❌ قبل التعديل:
                            </Typography>
                            {Object.entries(before.export).map(([key, value]) => (
                                <Box key={key} sx={{ ml: 2, mb: 0.5, display: 'flex', gap: 1 }}>
                                    <Typography component="span" sx={{ color: '#ffd43b', minWidth: '150px' }}>
                                        {key}:
                                    </Typography>
                                    <Typography component="span" sx={{ color: '#fff' }}>
                                        {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>

                        {/* After Export */}
                        {after.export && (
                            <Box sx={{ bgcolor: 'rgba(81, 207, 102, 0.15)', p: 1.5, borderRadius: 1, border: '1px solid rgba(81, 207, 102, 0.3)' }}>
                                <Typography sx={{ color: '#51cf66', fontWeight: 600, mb: 1 }}>
                                    ✅ بعد التعديل:
                                </Typography>
                                {(Array.isArray(after.export) ? after.export : [after.export]).map((exportItem, idx) => (
                                    <Box key={idx} sx={{ ml: 2 }}>
                                        {Object.entries(exportItem).map(([key, value]) => (
                                            <Box key={key} sx={{ mb: 0.5, display: 'flex', gap: 1 }}>
                                                <Typography component="span" sx={{ color: '#ffd43b', minWidth: '150px' }}>
                                                    {key}:
                                                </Typography>
                                                <Typography component="span" sx={{ color: '#fff' }}>
                                                    {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                                                </Typography>
                                            </Box>
                                        ))}
                                    </Box>
                                ))}
                            </Box>
                        )}
                    </Box>
                )}

                {/* عرض بيانات Details */}
                {before.details && (
                    <Box>
                        <Typography sx={{ color: '#ffd43b', fontWeight: 600, mb: 1, fontSize: '1rem' }}>
                            📋 تفاصيل التوزيع (Details):
                        </Typography>

                        {/* Before Details */}
                        <Box sx={{ bgcolor: 'rgba(255, 107, 107, 0.15)', p: 1.5, borderRadius: 1, mb: 1, border: '1px solid rgba(255, 107, 107, 0.3)' }}>
                            <Typography sx={{ color: '#ff6b6b', fontWeight: 600, mb: 1 }}>
                                ❌ قبل التعديل:
                            </Typography>
                            {Object.entries(before.details).map(([key, value]) => (
                                <Box key={key} sx={{ ml: 2, mb: 0.5, display: 'flex', gap: 1 }}>
                                    <Typography component="span" sx={{ color: '#ffd43b', minWidth: '150px' }}>
                                        {key}:
                                    </Typography>
                                    <Typography component="span" sx={{ color: '#fff' }}>
                                        {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>

                        {/* After Details */}
                        {after.details && (
                            <Box sx={{ bgcolor: 'rgba(81, 207, 102, 0.15)', p: 1.5, borderRadius: 1, border: '1px solid rgba(81, 207, 102, 0.3)' }}>
                                <Typography sx={{ color: '#51cf66', fontWeight: 600, mb: 1 }}>
                                    ✅ بعد التعديل:
                                </Typography>
                                {(Array.isArray(after.details) ? after.details : [after.details]).map((detailItem, idx) => (
                                    <Box key={idx} sx={{ ml: 2 }}>
                                        {Object.entries(detailItem).map(([key, value]) => (
                                            <Box key={key} sx={{ mb: 0.5, display: 'flex', gap: 1 }}>
                                                <Typography component="span" sx={{ color: '#ffd43b', minWidth: '150px' }}>
                                                    {key}:
                                                </Typography>
                                                <Typography component="span" sx={{ color: '#fff' }}>
                                                    {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                                                </Typography>
                                            </Box>
                                        ))}
                                    </Box>
                                ))}
                            </Box>
                        )}
                    </Box>
                )}
            </Box>
        );
    };

    return (

        <>
            <ButtonTheme variant="contained"
                size="small"
                startIcon={<Visibility />}
                onClick={handleOpen}
            >
                عرض التفاصيل
            </ButtonTheme>
            <Dialog
                open={open}
                onClose={onClose}
                maxWidth="md"
                fullWidth
                dir="rtl"
            >
                <DialogTitle>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h6">
                            تفاصيل سجل التدقيق #{item.id}
                        </Typography>
                        <IconButton onClick={onClose} size="small">
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </DialogTitle>

                <DialogContent>
                    {/* Log Information */}
                    <Box sx={{ mb: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                            <InfoIcon color="primary" />
                            <Typography variant="h6">معلومات السجل</Typography>
                        </Box>
                        <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="caption" color="text.secondary">
                                        العملية
                                    </Typography>
                                    <Typography variant="body2" fontWeight={500}>
                                        {item?.action}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="caption" color="text.secondary">
                                        الجدول
                                    </Typography>
                                    <Typography variant="body2" fontWeight={500}>
                                        {item?.table_name}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="caption" color="text.secondary">
                                        رقم السجل
                                    </Typography>
                                    <Typography variant="body2" fontWeight={500}>
                                        #{item?.record_id}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="caption" color="text.secondary">
                                        التاريخ والوقت
                                    </Typography>
                                    <Typography variant="body2" fontWeight={500}>
                                        {formatDate(item?.created_at)}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Typography variant="caption" color="text.secondary">
                                        المستخدم
                                    </Typography>
                                    <Typography variant="body2" fontWeight={500}>
                                        {item?.user_name || `مستخدم #${item?.user_id}`}
                                    </Typography>
                                </Grid>
                                {item?.admin_id && (
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="caption" color="text.secondary">
                                            المسؤول
                                        </Typography>
                                        <Typography variant="body2" fontWeight={500}>
                                            {item?.admin_name || `مسؤول #${item?.admin_id}`}
                                        </Typography>
                                    </Grid>
                                )}
                            </Grid>
                        </Paper>
                    </Box>

                    {/* Reason */}
                    {item?.reason && (
                        <Box sx={{ mb: 3 }}>
                            <Typography variant="subtitle2" gutterBottom>
                                السبب
                            </Typography>
                            <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                                <Typography variant="body2">
                                    {item?.reason}
                                </Typography>
                            </Paper>
                        </Box>
                    )}

                    {/* Data Comparison */}
                    <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                            <CompareArrowsIcon color="primary" />
                            <Typography variant="h6">مقارنة البيانات</Typography>
                        </Box>
                        {renderDiff()}
                    </Box>
                </DialogContent>
            </Dialog>
        </>

    );
};

export default AuditLogDetail;
