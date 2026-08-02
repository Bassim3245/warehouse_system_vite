import  { useState } from 'react';

import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import Alert from '@mui/material/Alert';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import CloseIcon from '@mui/icons-material/Close';

const EXPIRATION_OPTIONS = [
    { label: 'ساعة واحدة', value: 1 },
    { label: '4 ساعات', value: 4 },
    { label: '8 ساعات', value: 8 },
    { label: 'يوم واحد', value: 24 },
    { label: 'يومين', value: 48 },
    { label: 'أسبوع', value: 168 },
];

const ApprovalPanel = ({ request, onClose, onComplete }) => {
    const [action, setAction] = useState(null);
    const [selectedExpiration, setSelectedExpiration] = useState(4);
    const [customExpiration, setCustomExpiration] = useState('');
    const [rejectionNote, setRejectionNote] = useState('');
    const [loading, setLoading] = useState(false);

    const handleApprove = async () => {
        // const expirationHours = customExpiration || selectedExpiration;

        // if (!expirationHours || expirationHours <= 0) {
        //     toast.error('الرجاء تحديد مدة صلاحية الموافقة');
        //     return;
        // }

        // try {
        //     setLoading(true);
        //     const expiresAt = new Date();
        //     expiresAt.setHours(expiresAt.getHours() + Number(expirationHours));

        //     await approveUnlockRequest(request.id, {
        //         expires_at: expiresAt.toISOString(),
        //         note: `موافقة لمدة ${expirationHours} ساعة`
        //     });

        //     toast.success('تمت الموافقة على الطلب بنجاح');
        //     onComplete();
        // } catch (error) {
        //     console.error('Error approving request:', error);
        //     toast.error('فشل في الموافقة على الطلب');
        // } finally {
        //     setLoading(false);
        // }
    };

    const handleReject = async () => {
        // if (!rejectionNote.trim()) {
        //     toast.error('الرجاء إدخال سبب الرفض');
        //     return;
        // }

        // try {
        //     setLoading(true);
        //     await rejectUnlockRequest(request.id, {
        //         note: rejectionNote
        //     });

        //     toast.success('تم رفض الطلب');
        //     onComplete();
        // } catch (error) {
        //     console.error('Error rejecting request:', error);
        //     toast.error('فشل في رفض الطلب');
        // } finally {
        //     setLoading(false);
        // }
    };

    return (
        <Dialog
            open={true}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            dir="rtl"
        >
            <DialogTitle>
                معالجة طلب التعديل #{request.id}
            </DialogTitle>

            <DialogContent>
                <Box sx={{ pt: 2 }}>
                    {/* Request Details */}
                    <Paper sx={{ p: 2, mb: 3, bgcolor: 'grey.50' }}>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                            تفاصيل الطلب
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Typography variant="body2">
                                    <strong>المستند:</strong> {request.document_id ? `مستند #${request.document_id}` : `صرف #${request.export_id}`}
                                </Typography>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <Typography variant="body2">
                                    <strong>المستخدم:</strong> {request.requested_by_name || `مستخدم #${request.requested_by}`}
                                </Typography>
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <Typography variant="body2">
                                    <strong>السبب:</strong> {request.reason}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Paper>

                    {!action && (
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Button
                                fullWidth
                                variant="contained"
                                color="success"
                                size="large"
                                startIcon={<CheckCircleIcon />}
                                onClick={() => setAction('approve')}
                            >
                                موافقة
                            </Button>
                            <Button
                                fullWidth
                                variant="contained"
                                color="error"
                                size="large"
                                startIcon={<CancelIcon />}
                                onClick={() => setAction('reject')}
                            >
                                رفض
                            </Button>
                        </Box>
                    )}

                    {action === 'approve' && (
                        <Box>
                            <Typography variant="h6" gutterBottom>
                                مدة صلاحية الموافقة
                            </Typography>

                            <ToggleButtonGroup
                                value={selectedExpiration}
                                exclusive
                                onChange={(e, newValue) => {
                                    if (newValue !== null) {
                                        setSelectedExpiration(newValue);
                                        setCustomExpiration('');
                                    }
                                }}
                                fullWidth
                                sx={{ mb: 2 }}
                            >
                                {EXPIRATION_OPTIONS.map(option => (
                                    <ToggleButton key={option.value} value={option.value}>
                                        {option.label}
                                    </ToggleButton>
                                ))}
                            </ToggleButtonGroup>

                            <TextField
                                fullWidth
                                type="number"
                                label="أو أدخل مدة مخصصة (بالساعات)"
                                value={customExpiration}
                                onChange={(e) => {
                                    setCustomExpiration(e.target.value);
                                    setSelectedExpiration(null);
                                }}
                                placeholder="عدد الساعات"
                                inputProps={{ min: 1 }}
                                sx={{ mb: 2 }}
                            />

                            <Alert severity="success">
                                <Typography variant="body2">
                                    <strong>✓ تأكيد:</strong> سيتمكن المستخدم من تعديل المستند لمدة {customExpiration || selectedExpiration} ساعة من الآن.
                                </Typography>
                            </Alert>
                        </Box>
                    )}

                    {action === 'reject' && (
                        <Box>
                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                label="سبب الرفض"
                                value={rejectionNote}
                                onChange={(e) => setRejectionNote(e.target.value)}
                                placeholder="اشرح سبب رفض هذا الطلب..."
                                required
                            />
                        </Box>
                    )}
                </Box>
            </DialogContent>

            <DialogActions sx={{ p: 2 }}>
                <Button
                    onClick={() => action ? setAction(null) : onClose()}
                    disabled={loading}
                    startIcon={<CloseIcon />}
                >
                    {action ? 'رجوع' : 'إلغاء'}
                </Button>

                {action === 'approve' && (
                    <Button
                        variant="contained"
                        color="success"
                        onClick={handleApprove}
                        disabled={loading}
                        startIcon={<CheckCircleIcon />}
                    >
                        {loading ? 'جاري الموافقة...' : 'تأكيد الموافقة'}
                    </Button>
                )}

                {action === 'reject' && (
                    <Button
                        variant="contained"
                        color="error"
                        onClick={handleReject}
                        disabled={loading}
                        startIcon={<CancelIcon />}
                    >
                        {loading ? 'جاري الرفض...' : 'تأكيد الرفض'}
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default ApprovalPanel;
