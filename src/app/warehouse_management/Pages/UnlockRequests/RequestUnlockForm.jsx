import React, { useState } from 'react';
import { toast } from 'react-toastify';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Alert,
    Box,
    Typography
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';

const RequestUnlockForm = ({ onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        document_id: '',
        export_id: '',
        reason: ''
    });
    const [loading, setLoading] = useState(false);
    const [requestType, setRequestType] = useState('document');

    const handleSubmit = async () => {
        if (!formData.reason.trim()) {
            toast.error('الرجاء إدخال سبب الطلب');
            return;
        }

        if (requestType === 'document' && !formData.document_id) {
            toast.error('الرجاء إدخال رقم المستند');
            return;
        }

        if (requestType === 'export' && !formData.export_id) {
            toast.error('الرجاء إدخال رقم الصرف');
            return;
        }

        try {
            setLoading(true);
            const requestData = {
                document_id: requestType === 'document' ? formData.document_id : null,
                export_id: requestType === 'export' ? formData.export_id : null,
                reason: formData.reason
            };

            toast.success('تم إرسال الطلب بنجاح');
            onSuccess();
        } catch (error) {
            console.error('Error creating unlock request:', error);
            toast.error(error.response?.data?.message || 'فشل في إرسال الطلب');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog
            open={true}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            dir="rtl"
        >
            <DialogTitle>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AddIcon color="primary" />
                    <Typography variant="h6">
                        طلب موافقة على التعديل
                    </Typography>
                </Box>
            </DialogTitle>

            <DialogContent>
                <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <FormControl fullWidth>
                        <InputLabel>نوع الطلب</InputLabel>
                        <Select
                            value={requestType}
                            onChange={(e) => setRequestType(e.target.value)}
                            label="نوع الطلب"
                        >
                            <MenuItem value="document">مستند وارد</MenuItem>
                            <MenuItem value="export">صرف</MenuItem>
                        </Select>
                    </FormControl>

                    {requestType === 'document' ? (
                        <TextField
                            fullWidth
                            type="number"
                            label="رقم المستند"
                            value={formData.document_id}
                            onChange={(e) => setFormData({ ...formData, document_id: e.target.value })}
                            placeholder="أدخل رقم المستند"
                            required
                        />
                    ) : (
                        <TextField
                            fullWidth
                            type="number"
                            label="رقم الصرف"
                            value={formData.export_id}
                            onChange={(e) => setFormData({ ...formData, export_id: e.target.value })}
                            placeholder="أدخل رقم الصرف"
                            required
                        />
                    )}

                    <TextField
                        fullWidth
                        multiline
                        rows={5}
                        label="سبب الطلب"
                        value={formData.reason}
                        onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                        placeholder="اشرح سبب حاجتك لتعديل هذا المستند..."
                        required
                    />

                    <Alert severity="info">
                        <Typography variant="body2">
                            <strong>ℹ️ ملاحظة:</strong> سيتم إرسال طلبك إلى المسؤول للموافقة عليه. ستتلقى إشعاراً عند الموافقة أو الرفض.
                        </Typography>
                    </Alert>
                </Box>
            </DialogContent>

            <DialogActions sx={{ p: 2 }}>
                <Button
                    onClick={onClose}
                    disabled={loading}
                    startIcon={<CloseIcon />}
                >
                    إلغاء
                </Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={loading}
                    startIcon={<AddIcon />}
                >
                    {loading ? 'جاري الإرسال...' : 'إرسال الطلب'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default RequestUnlockForm;
