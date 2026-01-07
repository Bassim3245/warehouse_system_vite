import  { useEffect, useState } from 'react';
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import Button from "@mui/material/Button";
import axios from 'axios';
import { BackendUrl } from '../../../../redux/api/axios';
import { getToken } from '../../../../utils/handelCookie';
import AddIcon from '@mui/icons-material/Add';
const LaboratoriesList = () => {
  const [laboratories, setLaboratories] = useState([]);
  const token = getToken();
  const fetchLaboratories = async () => {
    try {
      const response = await axios.get(`${BackendUrl}/api/laboratories`, {
        headers: { Authorization: token }
      });
      setLaboratories(response.data);
    } catch (error) {
      console.error('Error fetching laboratories:', error);
    }
  };
  useEffect(() => {
    fetchLaboratories();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" component="h2" align="right">
          إدارة المعامل
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
        >
          إضافة معمل جديد
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="right">اسم المعمل</TableCell>
              <TableCell align="right">التخصص</TableCell>
              <TableCell align="right">عدد الموظفين</TableCell>
              <TableCell align="right">الحالة</TableCell>
              <TableCell align="right">الإجراءات</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {laboratories.map((lab) => (
              <TableRow key={lab.id}>
                <TableCell align="right">{lab.name}</TableCell>
                <TableCell align="right">{lab.specialization}</TableCell>
                <TableCell align="right">{lab.employeeCount}</TableCell>
                <TableCell align="right">{lab.status}</TableCell>
                <TableCell align="right">
                  <Button color="primary" size="small">تعديل</Button>
                  <Button color="secondary" size="small">عرض</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default LaboratoriesList;
