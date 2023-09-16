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
import axios from 'axios'; // Import Axios
import './AppAlert.css'; // Import CSS file


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
  const [switchData, setSwitchData] = useState([]);

  useEffect(() => {
    // Fetch switch usage data from the server and update the state
    const fetchSwitchUsage = async () => {
      try {
        const response = await axios.get('http://localhost:5500/api/switch-usage'); // Fetch data from the server
        setSwitchData(response.data);
      } catch (error) {
        console.error('Error fetching switch usage:', error);
      }
    };

    fetchSwitchUsage();
  }, []); // Empty dependency array to run the effect only once when the component mounts

  return (
    <Container>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center">Switch ID</TableCell>
              <TableCell align="center">Use Count</TableCell>
              <TableCell align="center">Require Maintenance</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {switchData.map((switchItem) => (
              <TableRow
                key={switchItem.switch_id}
                className={switchItem.usage_count > 400 ? 'maintenance-needed' : ''}
              >
                <TableCell align="center">{switchItem.switch_id}</TableCell>
                <TableCell align="center">{switchItem.usage_count}</TableCell>
                <TableCell align="center">
                  {switchItem.usage_count > 400 ? 'Yes' : 'No'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default AppAlert;
