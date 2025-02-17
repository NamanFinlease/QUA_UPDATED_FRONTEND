import React, { useEffect } from "react";
import { tokens } from "../../theme";
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
  useTheme,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import useStore from "../../Store";
import { useVerifyPanMutation } from "../../Service/Query";
import { compareDates, formatDate, formatFullName } from "../../utils/helper";

const PanCompare = ({ open, setOpen, panDetails }) => {

  const { lead } = useStore()
  console.log(lead)

  // Color theme
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [verifyPan, { data, isSuccess, isError, error }] = useVerifyPanMutation()
  console.log("pan data",data)


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
    console.log(lead, panDetails)
    const {building_name,city,country,street_name,state,pincode} = panDetails?.address

    const formatAddress = (...parts) => parts.filter(Boolean).join(", "); // Join only non-empty values with commas
  
    // Construct the PAN address
    const panAddress = formatAddress(building_name, street_name, city, state, country, pincode);
  
    const leadAddress = formatAddress(lead?.city, lead?.state, lead?.pincode)

    const comparisonFields = [
      { label: "Name", leadValue: formatFullName(lead?.fName, lead?.mName,lead?.lName), panValue: panDetails?.fullname },
      // { label: "Name", leadValue: `${lead?.fName}${lead?.mName ? ` ${lead?.mName}` : ""} ${lead?.lName}`, panValue: panDetails?.fullname },
      { label: "DOB", leadValue:lead?.dob && formatDate(lead?.dob), panValue: panDetails?.dob  },
      { label: "Gender", leadValue:lead?.gender , panValue: panDetails?.gender === "male" ? "M" : "F" },
      { label: "PAN", leadValue:lead?.pan , panValue: panDetails?.pan },
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
    <Dialog 
      open={open} 
      maxWidth="lg" 
      fullWidth
      sx={{
        '& .MuiDialog-paper':{
          background:colors.white[100],
          borderRadius:"0px 20px",
          color:colors.primary[400],
        },
      }}
    >
      <DialogTitle>
        <Typography variant="h4" align="center" sx={{ fontWeight: "bold", m: 2 }}>
          Compare User Details
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ p: 2 }}>
          <TableContainer
            component={Paper}
            elevation={3}
            sx={{
              borderRadius: "0px 20px",
              backgroundColor: colors.white[100],
              '& .MuiTableCell-root': {
                borderBottom: `2px solid ${colors.primary[400]}`,
                padding: "16px 24px",
                fontSize: 14,
                fontWeight: "500",
              },
              '& .MuiTableHead-root': {
                background: colors.primary[400],
                color: colors.white[100],
              },
              '& .MuiTableCell-head': {
                color: colors.white[100],
                fontWeight: 600,
                textAlign: "center",  
                fontSize: "15px",
                padding: "12px", 
              },
            }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    Field
                  </TableCell>
                  <TableCell>
                    Lead Details
                  </TableCell>
                  <TableCell>
                    PAN Details
                  </TableCell>
                  <TableCell>
                    Comparison
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {getComparisonFields(lead,panDetails).map(({ label, leadValue, panValue }) => {
                  const result = compareValues(label, leadValue, panValue);
                  const textColor = getTextColor(result);


                  return (
                  <TableRow key={label}>
                    <TableCell
                      sx={{
                        padding: "16px 24px",
                        fontSize: 14,
                        textAlign: "center",
                        color: colors.black[100],
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
                        color: colors.black[100],
                      }}
                    >
                      {leadValue}
                    </TableCell>
                    <TableCell
                      sx={{
                        padding: "16px 24px",
                        fontSize: 14,
                        textAlign: "center",
                        color: colors.black[100],
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
                          <CheckCircleOutlineIcon fontSize="small" sx={{ mr: 1, color: "#00796b" }} /> Matched
                        </>
                      ) : (
                        <>
                          <HighlightOffIcon fontSize="small" sx={{ mr: 1 }} /> Unmatched
                        </>
                      )}
                    </TableCell>
                    {/* {isError && <p>{error?.data?.message}</p>} */}
                  </TableRow>
                  );
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
          variant="contained"
          sx={{
            background:colors.white[100],
            color: colors.redAccent[500],
            border: `1px solid ${colors.redAccent[500]}`,
            fontWeight: "bold",
            borderRadius:"0px 10px",
            '&:hover':{
              backgroundColor:colors.redAccent[500],
              color:colors.white[100],
            }
          }}
        >
          Close
        </Button>
        {/* <Button
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
        </Button> */}
      </DialogActions>
    </Dialog>
  );
};

export default PanCompare;
