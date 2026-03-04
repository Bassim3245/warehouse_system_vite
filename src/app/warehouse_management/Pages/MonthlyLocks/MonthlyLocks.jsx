import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import PersonIcon from '@mui/icons-material/Person';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import useGetAllWarehouse from '../../../../hooks/ManageWarehouseSetting/useGetAllWarehouse';
import MonthlyLockForm from './MonthLockForm';
import UserGuid from './userGuid';
import { useDispatch, useSelector } from 'react-redux';
import { getAllMonthlyLocksEntityId } from '../../../../redux/MonthLockState/monthLock';
import { getUserInformation } from '../../../../utils/handelCookie';
import { ButtonTheme } from '../../../../style/ButtomStyle';
import Loader from '../../../../components/reusableComponent/Loader';
import Header from '../../../../components/reusableComponent/HeaderComponent';
import { axiosInstance } from '../../../../redux/api/axiosConfig';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import AssessmentIcon from '@mui/icons-material/Assessment';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import InfoIcon from '@mui/icons-material/Info';
import ArchiveIcon from '@mui/icons-material/Archive';
import { useTheme } from '@mui/material/styles';
import { Alert } from '@mui/material';

const MonthlyLocks = () => {
    const [selectedWarehouse, setSelectedWarehouse] = useState(null);
    const { wareHouseData } = useGetAllWarehouse();
    const { lockData, isLoading } = useSelector((state) => state?.monthLock);
    const userInformation = getUserInformation();
    const dispatch = useDispatch();
    const theme = useTheme();

    const fetchInformation = useCallback(() => {
        const entity_id = userInformation?.entity_id;
        dispatch(getAllMonthlyLocksEntityId(entity_id));
    }, [dispatch, userInformation?.entity_id]);

    useEffect(() => {
        fetchInformation();
    }, [fetchInformation]);

    const handleUnlockMonth = async (lockId) => {
        if (!window.confirm('هل أنت متأكد من فتح هذا الشهر؟')) {
            return;
        }

        try {
            await axiosInstance.delete(`/api/warehouse/deleteMonthlyLockById/${lockId}`);
            toast.success('تم فتح الشهر بنجاح');
            fetchInformation();
        } catch (error) {
            console.error('Error unlocking month:', error);
            toast.error('فشل في فتح الشهر');
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('ar-EG', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Filter locks based on selected warehouse
    const filteredLocks = lockData?.filter(lock => {
        if (selectedWarehouse && lock.warehouse_id !== selectedWarehouse) return false;
        return true;
    }) || [];

    return (
        <Box sx={{ p: 3 }} dir="rtl">
            {/* Loading Overlay */}
            {isLoading && <Loader />}

            {/* Header */}
            <Header
                title="إغلاق الأشهر "
                dir="rtl"
            />

            <UserGuid />

            {/* Monthly Lock Form */}
            <Box sx={{ mb: 3 }}>
                <MonthlyLockForm
                    wareHouseData={wareHouseData}
                    dispatch={dispatch}
                    userInformation={userInformation}
                />
            </Box>

            {/* Warehouse Filter */}
            <Paper sx={{ p: 3, mb: 3 }}>
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <FormControl fullWidth>
                            <InputLabel>تصفية حسب المخزن</InputLabel>
                            <Select
                                value={selectedWarehouse || ''}
                                onChange={(e) => setSelectedWarehouse(e.target.value || null)}
                                label="تصفية حسب المخزن"
                            >
                                <MenuItem value="">
                                    <em>جميع المخازن</em>
                                </MenuItem>
                                {wareHouseData?.map((warehouse) => (
                                    <MenuItem key={warehouse.id} value={warehouse.id}>
                                        {warehouse.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </Paper>

            {/* Months Grid */}
            {!isLoading && filteredLocks.length > 0 && (
                <Grid container spacing={3}>
                    {filteredLocks.map((lockItem) => (
                        <Grid size={{ xs: 12, sm: 6, md: 6, lg: 4 }} key={lockItem.id}>
                            <Card
                                sx={{
                                    height: '100%',
                                    borderRight: 4,
                                    borderColor: lockItem?.is_locked ? 'error.main' : 'success.main',
                                    transition: 'all 0.3s',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: 4
                                    }
                                }}
                            >
                                <CardContent>
                                    {/* Month and Status */}
                                    <Box sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        mb: 2
                                    }}>
                                        <Typography variant="h6" fontWeight={600}>
                                            {lockItem?.month}
                                        </Typography>
                                        <Chip
                                            icon={lockItem?.is_locked ? <LockIcon /> : <LockOpenIcon />}
                                            label={lockItem?.is_locked ? 'مغلق' : 'مفتوح'}
                                            color={lockItem?.is_locked ? 'error' : 'success'}
                                            size="small"
                                        />
                                    </Box>

                                    {/* Warehouse Info */}
                                    <Box sx={{
                                        mb: 2,
                                        p: 1.5,
                                        bgcolor: 'background.default',
                                        borderRadius: 1
                                    }}>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                                            المخزن
                                        </Typography>
                                        <Typography variant="body1" fontWeight={600}>
                                            {lockItem?.warehouse_name || 'غير محدد'}
                                        </Typography>
                                    </Box>

                                    {/* Lock Details */}
                                    {lockItem?.is_locked && (
                                        <Box sx={{ mb: 2 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                                <PersonIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                                <Typography variant="body2" color="text.secondary">
                                                    {lockItem?.locked_by_name || 'غير محدد'}
                                                </Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <AccessTimeIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                                <Typography variant="body2" color="text.secondary">
                                                    {formatDate(lockItem?.locked_at)}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    )}
                                </CardContent>

                                <CardActions sx={{ p: 2, pt: 0 }}>
                                    <ButtonTheme
                                        fullWidth
                                        endIcon={<LockOpenIcon />}
                                        onClick={() => handleUnlockMonth(lockItem?.id)}
                                        disabled={!lockItem?.is_locked}
                                    >
                                        فتح الشهر
                                    </ButtonTheme>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* Empty State */}
            {!isLoading && filteredLocks.length === 0 && (
                <Paper sx={{ p: 6, textAlign: 'center' }}>
                    <LockIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                        لا توجد أشهر محاسبية
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {selectedWarehouse
                            ? 'لا توجد أشهر محاسبية للمخزن المحدد'
                            : 'لم يتم إضافة أي أشهر محاسبية بعد'}
                    </Typography>
                </Paper>
            )}

            {/* Loading State */}
            {isLoading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
                    <CircularProgress size={60} />
                </Box>
            )}
        </Box>
    );
};

export default MonthlyLocks;