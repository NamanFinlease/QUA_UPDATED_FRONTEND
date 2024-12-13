import React, { useState } from 'react';
import { Paper, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Checkbox, TextField } from '@mui/material';
import { styled } from '@mui/system';

const StyledPaper = styled(Paper)({
  padding: '20px',
  margin: '20px auto',
  maxWidth: '800px',
  borderRadius: '15px',
  boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.2)',
  backgroundColor: '#ffffff', // White background
});

const RepaymentDetails = () => {
  const [checkedFields, setCheckedFields] = useState({
    loanNo: false,
    loanAmount: false,
    tenure: false,
    repayAmount: false,
    blacklist: false, // State for the "Add to Blacklist" checkbox
  });

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setCheckedFields((prevCheckedFields) => ({
      ...prevCheckedFields,
      [name]: checked,
    }));
  };

  return (
    <StyledPaper>
      <Typography variant="h5" component="h2" gutterBottom style={{ color: '#000000', fontWeight: 'bold' }}>
        Loan Details
      </Typography>

      {/* Loan Details Table */}
      <TableContainer
        component={Paper}
        style={{
          marginTop: '20px',
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
          backgroundColor: '#333346', // Dark grey background
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ color: '#ffffff' }}>Field</TableCell>
              <TableCell style={{ color: '#ffffff' }}>Value</TableCell>
              <TableCell style={{ color: '#ffffff' }}>Include</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>Loan No.</TableCell>
              <TableCell>NFPLRUP00000000429</TableCell>
              <TableCell>
                <Checkbox
                  name="loanNo"
                  checked={checkedFields.loanNo}
                  onChange={handleCheckboxChange}
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Loan Amount (Rs.)</TableCell>
              <TableCell>8000</TableCell>
              <TableCell>
                <Checkbox
                  name="loanAmount"
                  checked={checkedFields.loanAmount}
                  onChange={handleCheckboxChange}
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Tenure as on 15-11-2024 (Days)</TableCell>
              <TableCell>1</TableCell>
              <TableCell>
                <Checkbox
                  name="tenure"
                  checked={checkedFields.tenure}
                  onChange={handleCheckboxChange}
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Repay Amount as on 15-11-2024 (Rs.)</TableCell>
              <TableCell>8040</TableCell>
              <TableCell>
                <Checkbox
                  name="repayAmount"
                  checked={checkedFields.repayAmount}
                  onChange={handleCheckboxChange}
                />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      {/* Repayment Details Section */}
      <Typography variant="h4" component="h1" style={{ marginTop: '20px', color: '#333346', fontWeight: 'bold' }}>
        Repayment Amount Details
      </Typography>

      <TableContainer
        component={Paper}
        style={{
          marginTop: '20px',
          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
          backgroundColor: '#333346', // Dark grey background
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell style={{ color: '#ffffff' }}>Field</TableCell>
              <TableCell style={{ color: '#ffffff' }}>Value</TableCell>
              <TableCell style={{ color: '#ffffff' }}>Include</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>Interest Amount</TableCell>
              <TableCell>800</TableCell>
              <TableCell>
                <Checkbox
                  name="interestAmount"
                  checked={checkedFields.interestAmount}
                  onChange={handleCheckboxChange}
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Principle Amount</TableCell>
              <TableCell>8000</TableCell>
              <TableCell>
                <Checkbox
                  name="principleAmount"
                  checked={checkedFields.principleAmount}
                  onChange={handleCheckboxChange}
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Penalty Amount</TableCell>
              <TableCell>0</TableCell>
              <TableCell>
                <Checkbox
                  name="penaltyAmount"
                  checked={checkedFields.penaltyAmount}
                  onChange={handleCheckboxChange}
                />
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Grand Total</TableCell>
              <TableCell>8800</TableCell>
              <TableCell>
                <Checkbox
                  name="grandTotal"
                  checked={checkedFields.grandTotal}
                  onChange={handleCheckboxChange}
                />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add to Blacklist Section */}
      <Typography variant="h5" component="h2" gutterBottom style={{ marginTop: '20px', color: '#000000', fontWeight: 'bold' }}>
        Add to Blacklist
      </Typography>

      {/* Blacklist Checkbox */}
      <Checkbox
        name="blacklist"
        checked={checkedFields.blacklist}
        onChange={handleCheckboxChange}
        style={{ marginBottom: '20px' }}
      />
      <Typography variant="body1" style={{ color: '#333346' }}>
        Check the box if you want to add this loan to the blacklist.
      </Typography>

      {/* Additional Field for Blacklist Reason */}
      {checkedFields.blacklist && (
        <TextField
          label="Reason for Blacklist"
          variant="outlined"
          fullWidth
          multiline
          rows={4}
          style={{ marginTop: '20px' }}
        />
      )}

    </StyledPaper>
  );
};

export default RepaymentDetails;
