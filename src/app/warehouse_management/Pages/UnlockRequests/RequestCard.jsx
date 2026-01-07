import React from 'react';
import {
    Card,
    CardContent,
    CardActions,
    Box,
    Typography,
    Chip,
    Button,
    Grid
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DescriptionIcon from '@mui/icons-material/Description';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';

const RequestCard = ({ request, onCancel, onApprove, showActions }) => {
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

    const getStatusConfig = (status) => {
        switch (status) {
            case 'approved':
                return { icon: <CheckCircleIcon />, label: 'موافق عليه', color: 'success' };
            case 'rejected':
                return { icon: <CancelIcon />, label: 'مرفوض', color: 'error' };
            default:
                return { icon: <HourglassEmptyIcon />, label: 'قيد الانتظار', color: 'warning' };
        }
    };

    const statusConfig = getStatusConfig(request.status);

    return (
        <Card
            sx={{
                borderRight: 4,
                borderColor: `${statusConfig.color}.main`,
                transition: 'all 0.3s',
                '&:hover': {
                    boxShadow: 4
                }
            }}
        >
            <CardContent>
                {/* Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box>
                        <Typography variant="caption" color="text.secondary">
                            طلب #{request.id}
                        </Typography>
                        <Typography variant="h6" fontWeight={600}>
                            {request.document_id ? `مستند #${request.document_id}` : `صرف #${request.export_id}`}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <PersonIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                <Typography variant="body2" color="text.secondary">
                                    {request.requested_by_name || `مستخدم #${request.requested_by}`}
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <AccessTimeIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                <Typography variant="body2" color="text.secondary">
                                    {formatDate(request.requested_at)}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                    <Chip
                        icon={statusConfig.icon}
                        label={statusConfig.label}
                        color={statusConfig.color}
                        size="small"
                    />
                </Box>

                {/* Reason */}
                <Box sx={{ bgcolor: 'grey.50', p: 2, borderRadius: 1, mb: 2 }}>
                    <Typography variant="caption" color="text.secondary" fontWeight={600}>
                        سبب الطلب
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 0.5 }}>
                        {request.reason}
                    </Typography>
                </Box>

                {/* Approval Details */}
                {request.status === 'approved' && (
                    <Grid container spacing={2}>
                        <Grid size={{ xs: 12, sm: 4 }}>
                            <Typography variant="caption" color="text.secondary">
                                وافق عليه
                            </Typography>
                            <Typography variant="body2" fontWeight={500}>
                                {request.approved_by_name || `مسؤول #${request.approved_by}`}
                            </Typography>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 4 }}>
                            <Typography variant="caption" color="text.secondary">
                                تاريخ الموافقة
                            </Typography>
                            <Typography variant="body2" fontWeight={500}>
                                {formatDate(request.approved_at)}
                            </Typography>
                        </Grid>
                        {request.expires_at && (
                            <Grid size={{ xs: 12, sm: 4 }}>
                                <Typography variant="caption" color="text.secondary">
                                    ينتهي في
                                </Typography>
                                <Typography variant="body2" fontWeight={500}>
                                    {formatDate(request.expires_at)}
                                </Typography>
                            </Grid>
                        )}
                    </Grid>
                )}

                {/* Rejection Note */}
                {request.status === 'rejected' && request.note && (
                    <Box sx={{ bgcolor: 'error.lighter', p: 2, borderRadius: 1 }}>
                        <Typography variant="caption" color="error.dark" fontWeight={600}>
                            سبب الرفض
                        </Typography>
                        <Typography variant="body2" color="error.dark" sx={{ mt: 0.5 }}>
                            {request.note}
                        </Typography>
                    </Box>
                )}
            </CardContent>

            {/* Actions */}
            {showActions && request.status === 'pending' && (
                <CardActions sx={{ p: 2, pt: 0 }}>
                    <Button
                        fullWidth
                        variant="contained"
                        color="success"
                        startIcon={<CheckCircleIcon />}
                        onClick={() => onApprove(request)}
                    >
                        موافقة
                    </Button>
                    <Button
                        fullWidth
                        variant="contained"
                        color="error"
                        startIcon={<CancelIcon />}
                        onClick={() => onApprove(request)}
                    >
                        رفض
                    </Button>
                </CardActions>
            )}

            {!showActions && request.status === 'pending' && (
                <CardActions sx={{ p: 2, pt: 0 }}>
                    <Button
                        fullWidth
                        variant="outlined"
                        color="error"
                        startIcon={<CancelIcon />}
                        onClick={() => onCancel(request.id)}
                    >
                        إلغاء الطلب
                    </Button>
                </CardActions>
            )}
        </Card>
    );
};

export default RequestCard;
