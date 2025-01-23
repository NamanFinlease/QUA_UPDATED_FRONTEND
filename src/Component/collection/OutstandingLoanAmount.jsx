import React from 'react';
import {
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Box,
  useTheme,
} from '@mui/material';
import { tokens } from '../../theme';

const OutstandingLoanAmount = () => {
  // Color theme
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Paper
      elevation={3}
      sx={{
        margin: '20px auto',
        maxWidth: '800px',
        padding: '10px 20px',
        background: colors.white[100],
        borderRadius: '0px 20px',
      }}
    >
      <Box sx={{ width: '100%', margin: '20px 0px' }}>
        <Typography
          variant="h4"
          sx={{
            color: colors.primary[400],
            textAlign: 'center',
            paddingBottom: '20px',
          }}
        >
          Outstanding Loan Amount
        </Typography>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            background: colors.white[100],
            color: colors.primary[400],
            margin: '0 auto',
            borderRadius: '0px 20px',
            boxShadow: '0px 0px 10px rgb(0,0,0,0.2)',
          }}
        >
          <TableContainer
            sx={{
              borderRadius: '0px 20px',
              '& .MuiTableCell-root': {
                borderBottom: `2px solid ${colors.primary[400]}`,
                color: colors.black[100],
              },
            }}
          >
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell>Payable Amount</TableCell>
                  <TableCell>Received Amount</TableCell>
                  <TableCell>Discount Amount</TableCell>
                  <TableCell>Outstanding Amount</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Interest Amount</TableCell>
                  <TableCell>0</TableCell>
                  <TableCell>0</TableCell>
                  <TableCell>0</TableCell>
                  <TableCell>0</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Principle Amount</TableCell>
                  <TableCell>0</TableCell>
                  <TableCell>0</TableCell>
                  <TableCell>0</TableCell>
                  <TableCell>0</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Penalty Amount</TableCell>
                  <TableCell>0</TableCell>
                  <TableCell>0</TableCell>
                  <TableCell>0</TableCell>
                  <TableCell>0</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Grand Total</TableCell>
                  <TableCell>0</TableCell>
                  <TableCell>0</TableCell>
                  <TableCell>0</TableCell>
                  <TableCell>0</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </Paper>
  );
};

export default OutstandingLoanAmount;
