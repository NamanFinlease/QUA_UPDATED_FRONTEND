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

const OutstandingLoanAmount = ({outstandingDetails}) => {
  // Color theme
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const data = outstandingDetails?.repaymentDetails;

  const interestPayable = data?.interest + data?.interestDiscount + data?.interestReceived;
  const penaltyPayable = data?.penalty + data?.penaltyDiscount + data?.penaltyReceived;
  const grandPayableAmount = interestPayable + penaltyPayable + data?.sanctionedAmount;
  const grandReceivedAmount = data?.interestReceived + data?.penaltyReceived + data?.principalReceived;
  const grandDiscountAmount = data?.interestDiscount + data?.penaltyDiscount + data?.principalDiscount;

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
                  <TableCell style={{fontWeight:"700"}}>{interestPayable}</TableCell>
                  <TableCell style={{color:"green"}}>{data?.interestReceived}</TableCell>
                  <TableCell style={{color:"grey"}}>{data?.interestDiscount}</TableCell>
                  <TableCell style={{color:"red"}}>{data?.interest}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Principal Amount</TableCell>
                  <TableCell style={{fontWeight:"700"}}>{data?.sanctionedAmount}</TableCell>
                  <TableCell style={{color:"green"}}>{data?.principalReceived}</TableCell>
                  <TableCell style={{color:"grey"}}>{data?.principalDiscount}</TableCell>
                  <TableCell style={{color:"red"}}>{data?.principalAmount}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Penalty Amount</TableCell>
                  <TableCell style={{fontWeight:"700"}}>{penaltyPayable}</TableCell>
                  <TableCell style={{color:"green"}}>{data?.penaltyReceived}</TableCell>
                  <TableCell style={{color:"grey"}}>{data?.penaltyDiscount}</TableCell>
                  <TableCell style={{color:"red"}}>{data?.penalty}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Grand Total</TableCell>
                  <TableCell style={{fontWeight:"700"}}>{grandPayableAmount}</TableCell>
                  <TableCell style={{color:"green"}}>{grandReceivedAmount}</TableCell>
                  <TableCell style={{color:"grey"}}>{grandDiscountAmount}</TableCell>
                  <TableCell style={{color:"red"}}>{data?.outstandingAmount}</TableCell>
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
