import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
} from "@mui/material";

const KeyFactStatement = ({
  fullname,
  loanAmount,
  roi,
  totalInterest,
  processingFee,
  disbursalAmount,
  repaymentAmount,
  annualPercentage,
  tenure,
}) => {
  return (
    <Box
      sx={{
        fontFamily: "Arial, Helvetica, sans-serif",
        lineHeight: "25px",
        fontSize: "14px",
        border: "1px solid #ddd",
        padding: "16px",
        width: "90%",
        margin: "auto",
        backgroundColor: "#f9f9f9",
      }}
    >
      <Typography
        variant="h6"
        textAlign="center"
        sx={{ fontWeight: "bold", marginBottom: 2 }}
      >
        Key Fact Statement
      </Typography>
      <TableContainer component={Paper}>
        <Table sx={{ border: "1px solid #000" }} aria-label="key fact statement">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold", textAlign: "center" }} colSpan={3}>
                Key Fact Statement
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold" }}>S.No.</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Parameters</TableCell>
              <TableCell sx={{ fontWeight: "bold" }}>Details</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {[
              { label: "Name", value: fullname },
              { label: "Loan Amount", value: `₹ ${loanAmount}` },
              { label: "ROI (in % per day)", value: roi },
              { label: "Total interest charge during the entire Tenure of the loan", value: `₹ ${totalInterest}` },
              { label: "Processing Fee (Including 18% GST)", value: `₹ ${processingFee}` },
              { label: "Insurance charges, if any (in ₹)", value: "Nil" },
              { label: "Others (if any) (in ₹)", value: "Nil" },
              { label: "Net disbursed amount", value: `₹ ${disbursalAmount}` },
              { label: "Total Repayment Amount", value: `₹ ${repaymentAmount}` },
              { label: "Annual Percentage Rate - Effective annualized interest rate (in %)", value: annualPercentage },
              { label: "Tenure of the Loan (days)", value: `${tenure} Days` },
              { label: "Repayment frequency by the borrower", value: "One Time Only" },
              { label: "Number of installments of repayment", value: "1" },
              { label: "Amount of each installment of repayment (in ₹)", value: `₹ ${repaymentAmount}` },
            ].map((row, index) => (
              <TableRow key={index}>
                <TableCell>{`(${index + 1})`}</TableCell>
                <TableCell>{row.label}</TableCell>
                <TableCell>{row.value}</TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={3} sx={{ fontWeight: "bold", textAlign: "center" }}>
                Details about Contingent Charges
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>(XV)</TableCell>
              <TableCell>
                Rate of annualized penal charges in case of delayed payments (if any)
              </TableCell>
              <TableCell>Double the ROI</TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={3} sx={{ fontWeight: "bold", textAlign: "center" }}>
                Other Details
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>(XVI)</TableCell>
              <TableCell>
                Cooling off/look-up period during which borrower shall not be charged any penalty
                on prepayment of loan
              </TableCell>
              <TableCell>3 Days</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>(XVII)</TableCell>
              <TableCell>
                Name, designation, Address and phone number of nodal grievance redressal officer
              </TableCell>
              <TableCell>
                Nitin Vaid<br />
                Mobile: +91-9355016290<br />
                Address: S-370, Panchsheel Park, New Delhi - 110017
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default KeyFactStatement;

