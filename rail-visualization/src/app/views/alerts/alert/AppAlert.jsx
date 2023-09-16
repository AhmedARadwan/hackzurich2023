import React, { useEffect, useState } from 'react';
import {
  Box,
  styled,
  useTheme,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import AlertModel from './alertModel'; // Import the Mongoose model

const Container = styled('div')(({ theme }) => ({
  margin: '30px',
  [theme.breakpoints.down('sm')]: {
    margin: '16px',
  },
  '& .breadcrumb': {
    marginBottom: '30px',
    [theme.breakpoints.down('sm')]: {
      marginBottom: '16px',
    },
  },
}));

const AppAlert = () => {
  const theme = useTheme();
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    // Fetch alerts from the database and update the state
    const fetchAlerts = async () => {
      try {
        const response = await AlertModel.find().exec();
        setAlerts(response);
      } catch (error) {
        console.error('Error fetching alerts:', error);
      }
    };

    fetchAlerts();
  }, []); // Empty dependency array to run the effect only once when the component mounts

  return (
    <Container>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">Timestamp</TableCell>
              <TableCell align="center">Switch</TableCell>
              <TableCell align="center">Use Count</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {alerts.map((alert) => (
              <TableRow key={alert._id}>
                <TableCell>{alert.timestamp.toLocaleString()}</TableCell>
                <TableCell>{alert.switchid}</TableCell>
                <TableCell>{alert.usecount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default AppAlert;
