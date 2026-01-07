import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    Button,
    CircularProgress,
    Pagination,
    useTheme
} from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';
import FilterListIcon from '@mui/icons-material/FilterList';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import RefreshIcon from '@mui/icons-material/Refresh';
import AuditLogTable from './AuditLogTable';
import AuditLogDetail from './AuditLogDetail';
import { axiosInstance } from '../../../../redux/api/axiosConfig';
import { getUserInformation } from '../../../../utils/handelCookie';
import { BackendUrl } from '../../../../redux/api/axios';

const AuditLog = () => {
    const theme = useTheme();
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedLog, setSelectedLog] = useState(null);
    const [showDetail, setShowDetail] = useState(false);
    const [pagination, setPagination] = useState({
        totalPages: 1,
        totalItems: 1,
        page: 1,
        limit: 20,

    })
    const dataUserById = getUserInformation()
    const [filters, setFilters] = useState({
        action: '',
        table_name: '',
        user_id: '',
        start_date: '',
        end_date: '',
        limit: 20
    });

    useEffect(() => {
        fetchLogs();
    }, [pagination.limit, pagination.page]);

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(`${BackendUrl}/api/warehouse/transactions_log`, {
                params: {
                    entity_id: dataUserById?.entity_id,
                    page: pagination?.page,
                    limit: pagination?.limit,
                },
            });
            const data = await response?.data;
            setLogs(data?.data);
            setPagination({
                totalPages: data?.pagination?.totalPages,
                totalItems: data?.pagination?.total,
                page: data?.pagination?.page,
                limit: data?.pagination?.limit,
            })
        } catch (error) {
            console.error('Error fetching logs:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilter = () => {
        setPagination({
            ...pagination,
            page: 1,
        })
        fetchLogs();
    };

    const handleReset = () => {
        setFilters({
            action: '',
            table_name: '',
            user_id: '',
            start_date: '',
            end_date: '',
            limit: 20
        });
        setPagination({
            ...pagination,
            page: 1,
        })
    };

    const handleExport = async () => {
        // try {
        //     await exportAuditLogs(filters);
        //     toast.success('تم تصدير السجلات بنجاح');
        // } catch (error) {
        //     console.error('Error exporting logs:', error);
        //     toast.error('فشل في تصدير السجلات');
        // }
    };

    const handleViewDetail = (log) => {
        setSelectedLog(log);
        setShowDetail(true);
    };

    return (
        <Box sx={{ p: 3 }} dir="rtl">
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <HistoryIcon sx={{ fontSize: 32, color: 'primary.main' }} />
                    <Typography variant="h4" fontWeight={600}>
                        سجل التدقيق
                    </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                    تتبع جميع العمليات والتغييرات في النظام
                </Typography>
            </Box>

            {/* Filters */}
            <Paper
                sx={{
                    p: 3,
                    mb: 3,
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                    color: 'white'
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <FilterListIcon />
                    <Typography variant="h6" fontWeight={600}>
                        تصفية السجلات
                    </Typography>
                </Box>

                <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={12} md={3}>
                        <FormControl fullWidth>
                            <InputLabel sx={{ color: 'white' }}>نوع العملية</InputLabel>
                            <Select
                                value={filters.action}
                                onChange={(e) => setFilters({ ...filters, action: e.target.value })}
                                label="نوع العملية"
                                sx={{ bgcolor: 'rgba(255,255,255,0.9)' }}
                            >
                                <MenuItem value="">الكل</MenuItem>
                                <MenuItem value="create">إنشاء</MenuItem>
                                <MenuItem value="update">تحديث</MenuItem>
                                <MenuItem value="delete">حذف</MenuItem>
                                <MenuItem value="approve">موافقة</MenuItem>
                                <MenuItem value="reject">رفض</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <FormControl fullWidth>
                            <InputLabel sx={{ color: 'white' }}>الجدول</InputLabel>
                            <Select
                                value={filters.table_name}
                                onChange={(e) => setFilters({ ...filters, table_name: e.target.value })}
                                label="الجدول"
                                sx={{ bgcolor: 'rgba(255,255,255,0.9)' }}
                            >
                                <MenuItem value="">الكل</MenuItem>
                                <MenuItem value="documents">المستندات</MenuItem>
                                <MenuItem value="exports">الصرف</MenuItem>
                                <MenuItem value="monthly_locks">إغلاق الأشهر</MenuItem>
                                <MenuItem value="unlock_requests">طلبات التعديل</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <TextField
                            fullWidth
                            type="date"
                            label="من تاريخ"
                            value={filters.start_date}
                            onChange={(e) => setFilters({ ...filters, start_date: e.target.value })}
                            InputLabelProps={{ shrink: true, sx: { color: 'white' } }}
                            sx={{ bgcolor: 'rgba(255,255,255,0.9)', borderRadius: 1 }}
                        />
                    </Grid>

                    <Grid item xs={12} md={3}>
                        <TextField
                            fullWidth
                            type="date"
                            label="إلى تاريخ"
                            value={filters.end_date}
                            onChange={(e) => setFilters({ ...filters, end_date: e.target.value })}
                            InputLabelProps={{ shrink: true, sx: { color: 'white' } }}
                            sx={{ bgcolor: 'rgba(255,255,255,0.9)', borderRadius: 1 }}
                        />
                    </Grid>
                </Grid>

                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                        variant="contained"
                        startIcon={<FileDownloadIcon />}
                        onClick={handleExport}
                        sx={{ bgcolor: 'success.main', '&:hover': { bgcolor: 'success.dark' } }}
                    >
                        تصدير إلى Excel
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<FilterListIcon />}
                        onClick={handleFilter}
                        sx={{ bgcolor: 'white', color: 'primary.main', '&:hover': { bgcolor: 'grey.100' } }}
                    >
                        تطبيق التصفية
                    </Button>
                    <Button
                        variant="outlined"
                        startIcon={<RefreshIcon />}
                        onClick={handleReset}
                        sx={{ borderColor: 'white', color: 'white', '&:hover': { borderColor: 'grey.300', bgcolor: 'rgba(255,255,255,0.1)' } }}
                    >
                        إعادة تعيين
                    </Button>
                </Box>
            </Paper>

            {/* Content */}
            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                    <CircularProgress />
                </Box>
            ) : logs?.length === 0 ? (
                <Paper sx={{ p: 8, textAlign: 'center' }}>
                    <HistoryIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                        لا توجد سجلات
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        لم يتم العثور على سجلات تدقيق بناءً على التصفية المحددة
                    </Typography>
                </Paper>
            ) : (
                <>
                    <AuditLogTable
                        logs={logs}
                        onViewDetail={handleViewDetail}
                    />

                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                        <Pagination
                            count={pagination?.totalPages}
                            page={pagination?.page}
                            onChange={(e, page) => setPagination({ ...pagination, page })}
                            color="primary"
                            size="large"
                        />
                    </Box>
                </>
            )}

            {showDetail && selectedLog && (
                <AuditLogDetail
                    log={selectedLog}
                    onClose={() => setShowDetail(false)}
                />
            )}
        </Box>
    );
};

export default AuditLog;
