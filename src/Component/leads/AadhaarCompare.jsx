import React, { useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import useStore from "../../Store";
import { useVerifyAadhaarMutation } from "../../Service/Query";
import { useNavigate } from "react-router-dom";
import { compareDates, formatDate } from "../../utils/helper";

const AadhaarCompare = ({ open, setOpen, aadhaarDetails }) => {
  const navigate = useNavigate()
  const { lead } = useStore();
  const [verifyAadhaar, { data, isSuccess, isError, error }] = useVerifyAadhaarMutation()

  // Handle close modal
  const handleClose = () => setOpen(false);


  // Utility function to compare values and return "Matched" or "Unmatched"
  const compareValues = (label, value1, value2) => {


    if (label === "DOB" && value1 && value2) {
      return compareDates(value1, value2) ? "Matched" : "Unmatched";
    }


    if (value1 instanceof Date && value2 instanceof Date) {
      const year1 = value1.getFullYear();
      const month1 = value1.getMonth();
      const day1 = value1.getDate();

      const year2 = value2.getFullYear();
      const month2 = value2.getMonth();
      const day2 = value2.getDate();

      return year1 === year2 && month1 === month2 && day1 === day2 ? "Matched" : "Unmatched";
    }

    if (typeof value1 === "string" && typeof value2 === "string") {
      return value1.trim().toLowerCase() === value2.trim().toLowerCase() ? "Matched" : "Unmatched";
    }

    return value1 === value2 ? "Matched" : "Unmatched";
  };


  // Function to style the comparison text color
  const getTextColor = (result) => (result === "Matched" ? "#00796b" : "#d32f2f");
  const handleSubmit = () => {
    verifyAadhaar({ id: lead._id, details: aadhaarDetails })

  }

  // Fields to be compared
  const getComparisonFields = (lead, aadhaarDetails) => {
    const { house, po, dist, state, country, street, pc } = aadhaarDetails?.address

    const formatAddress = (...parts) => parts.filter(Boolean).join(", "); // Join only non-empty values with commas
    const aadhaarAddress = formatAddress(house, po, dist, street, state, country, pc);
    const leadAddress = formatAddress(lead?.city, lead?.state, lead?.pinCode)

    const comparisonFields = [
      { label: "Name", leadValue: `${lead?.fName.trim()} ${lead?.mName.trim()} ${lead?.lName.trim()}`, aadhaarValue: aadhaarDetails?.name.trim() },
      { label: "DOB", leadValue: lead?.dob && formatDate(lead?.dob), aadhaarValue: aadhaarDetails?.dob },
      { label: "Gender", leadValue: lead?.gender, aadhaarValue: aadhaarDetails?.gender },
      { label: "Masked Aadhaar ", leadValue: `xxxxxxxx${lead?.aadhaar.slice(-4)}`, aadhaarValue: aadhaarDetails?.maskedAdharNumber },
      { label: "Address ", leadValue: leadAddress, aadhaarValue: aadhaarAddress },
    ];
    return comparisonFields
  }

  // Function to render table rows dynamically
  useEffect(() => {
    if (isSuccess)
      setOpen(false)
    navigate(`/lead-profile/${lead._id}`)
  }, [isSuccess])


  const renderRow = ({ label, leadValue, aadhaarValue }) => {
    const result = compareValues(label, leadValue, aadhaarValue);
    const textColor = getTextColor(result);


    return (

      <TableRow
        key={label}
        sx={{
          "&:nth-of-type(odd)": {
            backgroundColor: "#f5f5f5",
          },
        }}
      >
        <TableCell
          sx={{
            padding: "16px 24px",
            fontSize: 14,
            textAlign: "center",
            color: "#424242",
            fontWeight: "500",
          }}
        >
          {label}:
        </TableCell>
        <TableCell
          sx={{
            padding: "16px 24px",
            fontSize: 14,
            textAlign: "center",
            color: "#424242",
          }}
        >
          {leadValue}
        </TableCell>
        <TableCell
          sx={{
            padding: "16px 24px",
            fontSize: 14,
            textAlign: "center",
            color: "#424242",
          }}
        >
          {aadhaarValue}
        </TableCell>
        <TableCell
          sx={{
            color: textColor,
            fontWeight: "bold",
            textAlign: "center",
            fontSize: 14,
            padding: "16px 24px",
          }}
        >
          {result === "Matched" ? (
            <>
              <CheckCircleOutlineIcon fontSize="small" sx={{ mr: 1, color: "#00796b" }} />
              Matched
            </>
          ) : (
            <>
              <HighlightOffIcon fontSize="small" sx={{ mr: 1 }} />
              Unmatched
            </>
          )}
        </TableCell>

      </TableRow>
    );
  };

  return (
    <Dialog open={open} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h6" align="center" sx={{ fontWeight: "bold", mb: 2 }}>
          Compare Lead and Aadhaar details
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ p: 2 }}>
          <TableContainer
            component={Paper}
            elevation={3}
            sx={{
              borderRadius: 2,
              border: "1px solid #e0e0e0",
              backgroundColor: "#fafafa",
            }}
          >
            <Table>
              <TableHead sx={{ backgroundColor: "#eceff1" }}>
                <TableRow>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      fontSize: 15,
                      color: "#37474f",
                      textAlign: "center",
                      padding: "12px",
                    }}
                  >
                    Field
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      fontSize: 15,
                      color: "#37474f",
                      textAlign: "center",
                      padding: "12px",
                    }}
                  >
                    Lead
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      fontSize: 15,
                      color: "#37474f",
                      textAlign: "center",
                      padding: "12px",
                    }}
                  >
                    Aadhaar Details
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "bold",
                      fontSize: 15,
                      color: "#37474f",
                      textAlign: "center",
                      padding: "12px",
                    }}
                  >
                    Comparison
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {getComparisonFields(lead, aadhaarDetails)?.map(({ label, leadValue, aadhaarValue }) => {
                  const result = compareValues(label, leadValue, aadhaarValue);
                  const textColor = getTextColor(result);


                  return (

                    <TableRow
                      key={label}
                      sx={{
                        "&:nth-of-type(odd)": {
                          backgroundColor: "#f5f5f5",
                        },
                      }}
                    >
                      <TableCell
                        sx={{
                          padding: "16px 24px",
                          fontSize: 14,
                          textAlign: "center",
                          color: "#424242",
                          fontWeight: "500",
                        }}
                      >
                        {label}:
                      </TableCell>
                      <TableCell
                        sx={{
                          padding: "16px 24px",
                          fontSize: 14,
                          textAlign: "center",
                          color: "#424242",
                        }}
                      >
                        {leadValue}
                      </TableCell>
                      <TableCell
                        sx={{
                          padding: "16px 24px",
                          fontSize: 14,
                          textAlign: "center",
                          color: "#424242",
                        }}
                      >
                        {aadhaarValue}
                      </TableCell>
                      <TableCell
                        sx={{
                          color: textColor,
                          fontWeight: "bold",
                          textAlign: "center",
                          fontSize: 14,
                          padding: "16px 24px",
                        }}
                      >
                        {result === "Matched" ? (
                          <>
                            <CheckCircleOutlineIcon fontSize="small" sx={{ mr: 1, color: "#00796b" }} />
                            Matched
                          </>
                        ) : (
                          <>
                            <HighlightOffIcon fontSize="small" sx={{ mr: 1 }} />
                            Unmatched
                          </>
                        )}
                      </TableCell>

                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </DialogContent>
      {isError && <p>{error?.data?.message}</p>}
      <DialogActions sx={{ justifyContent: "space-between", px: 3, pb: 3 }}>
        <Button
          onClick={handleClose}
          variant="outlined"
          sx={{
            borderColor: "#00796b",
            color: "#00796b",
            fontWeight: "bold",
            textTransform: "none",
            "&:hover": { backgroundColor: "#e0f7fa", borderColor: "#00796b" },
          }}
        >
          Close
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          sx={{
            backgroundColor: "#00796b",
            fontWeight: "bold",
            textTransform: "none",
            "&:hover": { backgroundColor: "#004d40" },
          }}
        >
          Verify
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AadhaarCompare;
