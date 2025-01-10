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
import { useVerifyPanMutation } from "../../Service/Query";
import { compareDates, formatDate } from "../../utils/helper";

const PanCompare = ({ open, setOpen, panDetails }) => {
  console.log('pan details',panDetails)

  const { lead } = useStore()

  const [verifyPan, { data, isSuccess, isError, error }] = useVerifyPanMutation()



  const compareValues = (label, value1, value2) => {

    if (label === "DOB" && value1 && value2) {
      return compareDates(value1, value2) ? "Matched" : "Unmatched";
    }

    // if (value1 instanceof Date && value2 instanceof Date) {
    //   const year1 = value1.getFullYear();
    //   const month1 = value1.getMonth();
    //   const day1 = value1.getDate();

    //   const year2 = value2.getFullYear();
    //   const month2 = value2.getMonth();
    //   const day2 = value2.getDate();

    //   return year1 === year2 && month1 === month2 && day1 === day2 ? "Matched" : "Unmatched";
    // }


    if (typeof value1 === "string" && typeof value2 === "string") {
      return value1.trim().toLowerCase() === value2.trim().toLowerCase() ? "Matched" : "Unmatched";
    }

    return value1 === value2 ? "Matched" : "Unmatched";
  };


  const getTextColor = (result) => (result === "Matched" ? "#00796b" : "#d32f2f");

  // Fields to be compared
  const getComparisonFields = (lead,panDetails)=> {
    const {building_name,city,country,street_name,state,pincode} = panDetails?.address

    const formatAddress = (...parts) => parts.filter(Boolean).join(", "); // Join only non-empty values with commas
  
    // Construct the PAN address
    const panAddress = formatAddress(building_name, street_name, city, state, country, pincode);
  
    const leadAddress = formatAddress(lead?.city, lead?.state, lead?.pinCode)

    const comparisonFields = [
      { label: "Name", leadValue: `${lead?.fName}${lead?.mName ? ` ${lead?.mName}` : ""} ${lead?.lName}`, panValue: panDetails?.fullname },
      { label: "DOB", leadValue:lead?.dob && formatDate(lead?.dob), panValue: panDetails?.dob  },
      { label: "Gender", leadValue:lead?.gender , panValue: panDetails?.gender === "male" ? "M" : "F" },
      { label: "Masked Aadhaar", leadValue:`XXXXXXXX${lead?.aadhaar.slice(-4)}` , panValue: panDetails?.aadhaar_number },
      { label: "Address", leadValue:leadAddress , panValue: panAddress },
    ];
    return comparisonFields
  }
  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = () => {
    verifyPan({ id: lead._id, data: panDetails })
  };



  // Function to render table rows dynamically
  useEffect(() => {
    if (isSuccess)
      setOpen(false)
  }, [isSuccess, data])

  return (
    <Dialog open={open} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h6" align="center" sx={{ fontWeight: "bold", mb: 2 }}>
          Compare User Details
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
                    Lead Details
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
                    PAN Details
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
                {getComparisonFields(lead,panDetails).map(({ label, leadValue, panValue }) => {
                  const result = compareValues(label, leadValue, panValue);
                  const textColor = getTextColor(result);


                  return <TableRow
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
                      {panValue}
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
                        </>
                      ) : (
                        <>
                          <HighlightOffIcon fontSize="small" sx={{ mr: 1 }} />
                        </>
                      )}
                    </TableCell>
                    {/* {isError && <p>{error?.data?.message}</p>} */}
                  </TableRow>
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        {isError && <p>{error?.data?.message}</p>}
      </DialogContent>
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

export default PanCompare;
