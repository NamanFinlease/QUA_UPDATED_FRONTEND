import React, { useEffect, useState } from "react";
import { tokens } from '../../theme'
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
import { useVerifyAadhaarMutation, useLazyGetLeadDocsQuery } from "../../Service/Query";
import { useNavigate } from "react-router-dom";
import { compareDates, formatDate, formatFullName } from "../../utils/helper";
import useAuthStore from "../store/authStore";


const AadhaarCompare = ({ open, setOpen, aadhaarDetails }) => {
  const navigate = useNavigate()
  const {activeRole} = useAuthStore()
  const { lead } = useStore();
  const [verifyAadhaar, { data, isSuccess, isError, error }] = useVerifyAadhaarMutation()
  const [getLeadDocs, { data: leadDocs, isSuccess: isLeadDocsSuccess, isError: isLeadDocsError, error: leadDocsError }] = useLazyGetLeadDocsQuery();
  const [showDocumentDialog, setShowDocumentDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Handle close modal
  const handleClose = () => {
    setOpen(false);console.log('handle close') 
    setErrorMessage('');
  };

  // Color theme
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

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

            return year1 === year2 && month1 === month2 && day1 === day2
                ? "Matched"
                : "Unmatched";
        }

        if (typeof value1 === "string" && typeof value2 === "string") {
            return value1.trim().toLowerCase() === value2.trim().toLowerCase()
                ? "Matched"
                : "Unmatched";
        }

    return value1 === value2 ? "Matched" : "Unmatched";
  };

  const DocumentDialog = ({ open, onClose }) => {
    return (
      <Dialog
        open={open} 
        onClose={onClose}
        sx={{
          '& .MuiDialog-paper':{
            width:"700px",
            background:colors.white[100],
            borderRadius:"0px 20px",
            color:colors.primary[400],
          },
        }}
      >
        <DialogTitle>Document</DialogTitle>
        <DialogContent>
          <Typography>This is where the document will be displayed.</Typography>   
        </DialogContent>
        <DialogActions>
          <Button 
            variant="contained"
            onClick={onClose}
            sx={{
              color:colors.redAccent[500],
              background:colors.white[100],
              border:`1px solid ${colors.redAccent[500]}`,
              fontWeight:"bold",
              borderRadius:"0px 10px",
              ':hover':{
                background:colors.redAccent[500],
                color:colors.white[100],
              }
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  };
  // Function to style the comparison text color
  const getTextColor = (result) => (result === "Matched" ? "#00796b" : "#d32f2f");
  const handleSubmit = () => {
    // getLeadDocs({ id: lead._id, docType:"aadhaarFront", docId: lead?.documents?.document?.singleDocuments.url })
    // console.log(getLeadDocs)
    setShowDocumentDialog(true);
  }

  const handleVerify = () => {
    const formattedLeadDob = lead?.dob ? formatDate(lead.dob) : null;
    const comparisonFields = getComparisonFields(lead, aadhaarDetails);

    const mismatches = comparisonFields.filter(({ label }) => {
      if (["Name", "DOB", "Gender", "Masked Aadhaar"].includes(label)) {
        const leadValue = label === "DOB" ? formattedLeadDob : lead[label.toLowerCase()];
        return compareValues(label, leadValue, aadhaarDetails[label.toLowerCase()]) === "Unmatched";
      }
      return false;
    });

    if (mismatches.length > 0) {
      setErrorMessage("Some fields are not matched: " + mismatches.map(m => m.label).join(", "));
    } else {
      setErrorMessage("Verified");
    }
  };

  // Fields to be compared
  const getComparisonFields = (lead, aadhaarDetails) => {

    console.log('aadhaar detail',aadhaarDetails)
    console.log('lead detail',lead)

    const { house, po, dist, state, country, street, pc } = aadhaarDetails?.address

        const formatAddress = (...parts) => parts.filter(Boolean).join(", "); // Join only non-empty values with commas
        const aadhaarAddress = formatAddress(
            house,
            po,
            dist,
            street,
            state,
            country,
            pc
        );
        const leadAddress = formatAddress(
            lead?.city,
            lead?.state,
            lead?.pinCode
        );

    const comparisonFields = [
      { label: "Name", leadValue: formatFullName(lead?.fName, lead?.mName,lead?.lName), aadhaarValue: aadhaarDetails?.name.trim() },
      { label: "DOB", leadValue: lead?.dob && formatDate(lead?.dob), aadhaarValue: aadhaarDetails?.dob },
      { label: "Gender", leadValue: lead?.gender, aadhaarValue: aadhaarDetails?.gender },
      { label: "Masked Aadhaar ", leadValue: `xxxxxxxx${lead?.aadhaar.slice(-4)}`, aadhaarValue: aadhaarDetails?.maskedAdharNumber },
      { label: "Address ", leadValue: leadAddress, aadhaarValue: aadhaarAddress },
    ];
    return comparisonFields
  }

  console.log('lead',lead,open)

  // Function to render table rows dynamically
  useEffect(() => {
    console.log('useEffect',isSuccess)
    if (isSuccess) 
      setOpen(false)
    // navigate(`/lead-profile/${lead._id}`)
  }, [isSuccess])


  return (
    <>
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
          Compare Lead and Aadhaar details
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ p: 2,  }}>
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
                    Lead
                  </TableCell>
                  <TableCell>
                    Aadhaar Details
                  </TableCell>
                  <TableCell>
                    Comparison
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {getComparisonFields(lead, aadhaarDetails)?.map(({ label, leadValue, aadhaarValue }) => {
                  const result = compareValues(label, leadValue, aadhaarValue);
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
      {errorMessage && (
        <Typography color="error" variant="body1" sx={{ mb: 2, textAlign: "center" }}>
          {errorMessage}
        </Typography>
      )}
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
        <Button
          onClick={handleVerify}
          variant="contained"
          sx={{
            background:colors.white[100],
            color: colors.greenAccent[700],
            border: `1px solid ${colors.greenAccent[700]}`,
            fontWeight: "bold",
            borderRadius:"0px 10px",
            '&:hover':{
              backgroundColor:colors.greenAccent[700],
              color:colors.white[100],
            }
          }}
        >
          Verify
        </Button>
        {/* <Button
          onClick={handleSubmit}
          variant="contained"
          sx={{
            background:colors.white[100],
            color: colors.primary[400],
            border: `1px solid ${colors.primary[400]}`,
            fontWeight: "bold",
            borderRadius:"0px 10px",
            '&:hover':{
              backgroundColor:colors.primary[400],
              color:colors.white[100],
            }
          }}
        >
          Show Document
        </Button> */}
      </DialogActions>
    </Dialog>

    <DocumentDialog
    open={showDocumentDialog} 
    onClose={() => setShowDocumentDialog(false)} 
    />
    </>
  );
};

export default AadhaarCompare;


// import React, { useEffect, useState } from "react";
// import { tokens } from '../../theme'
// import {
//   Button,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Typography,
//   Box,
//   useTheme,
// } from "@mui/material";
// import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
// import HighlightOffIcon from "@mui/icons-material/HighlightOff";
// import useStore from "../../Store";
// import { useVerifyAadhaarMutation, useLazyGetLeadDocsQuery } from "../../Service/Query";
// import { useNavigate } from "react-router-dom";
// import { compareDates, formatDate, formatFullName } from "../../utils/helper";
// import useAuthStore from "../store/authStore";

// const AadhaarCompare = ({ open, setOpen, aadhaarDetails }) => {
//   const navigate = useNavigate()
//   const {activeRole} = useAuthStore()
//   const { lead } = useStore();
//   const [verifyAadhaar, { data, isSuccess, isError, error }] = useVerifyAadhaarMutation()
//   const [getLeadDocs, { data: leadDocs, isSuccess: isLeadDocsSuccess, isError: isLeadDocsError, error: leadDocsError }] = useLazyGetLeadDocsQuery();

//   // Handle close modal
//   const handleClose = () => {setOpen(false);console.log('handle close') };

//   console.log("Aaadhar data",data)

//   // Color theme
//   const theme = useTheme();
//   const colors = tokens(theme.palette.mode);

//   // Utility function to compare values and return "Matched" or "Unmatched"
//   const compareValues = (label, value1, value2) => {


//     if (label === "DOB" && value1 && value2) {
//       return compareDates(value1, value2) ? "Matched" : "Unmatched";
//     }


//     if (value1 instanceof Date && value2 instanceof Date) {
//       const year1 = value1.getFullYear();
//       const month1 = value1.getMonth();
//       const day1 = value1.getDate();

//       const year2 = value2.getFullYear();
//       const month2 = value2.getMonth();
//       const day2 = value2.getDate();

//       return year1 === year2 && month1 === month2 && day1 === day2 ? "Matched" : "Unmatched";
//     }

//     if (typeof value1 === "string" && typeof value2 === "string") {
//       return value1.trim().toLowerCase() === value2.trim().toLowerCase() ? "Matched" : "Unmatched";
//     }

//     return value1 === value2 ? "Matched" : "Unmatched";
//   };


//   // Function to style the comparison text color
//   const getTextColor = (result) => (result === "Matched" ? "#00796b" : "#d32f2f");
//   const handleSubmit = () => {
//     // verifyAadhaar({ id: lead._id, details: aadhaarDetails })
    
//   }

//   // Fields to be compared
//   const getComparisonFields = (lead, aadhaarDetails) => {

//     console.log('aadhaar detail',aadhaarDetails)
//     console.log('lead detail',lead)

//     const { house, po, dist, state, country, street, pc } = aadhaarDetails?.address

//     const formatAddress = (...parts) => parts.filter(Boolean).join(", "); // Join only non-empty values with commas
//     const aadhaarAddress = formatAddress(house, po, dist, street, state, country, pc);
//     const leadAddress = formatAddress(lead?.city, lead?.state, lead?.pinCode)

//     const comparisonFields = [
//       { label: "Name", leadValue: formatFullName(lead?.fName, lead?.mName,lead?.lName), aadhaarValue: aadhaarDetails?.name.trim() },
//       { label: "DOB", leadValue: lead?.dob && formatDate(lead?.dob), aadhaarValue: aadhaarDetails?.dob },
//       { label: "Gender", leadValue: lead?.gender, aadhaarValue: aadhaarDetails?.gender },
//       { label: "Masked Aadhaar ", leadValue: `xxxxxxxx${lead?.aadhaar.slice(-4)}`, aadhaarValue: aadhaarDetails?.maskedAdharNumber },
//       { label: "Address ", leadValue: leadAddress, aadhaarValue: aadhaarAddress },
//     ];
//     return comparisonFields
//   }

//   console.log('lead',lead,open)

//   // Function to render table rows dynamically
//   useEffect(() => {
//     console.log('useEffect',isSuccess)
//     if (isSuccess) 
//       setOpen(false)
//     // navigate(`/lead-profile/${lead._id}`)
//   }, [isSuccess])


//   return (
//     <Dialog 
//       open={open} 
//       maxWidth="lg" 
//       fullWidth 
//       sx={{
//         '& .MuiDialog-paper':{
//           background:colors.white[100],
//           borderRadius:"0px 20px",
//           color:colors.primary[400],
//         },
//       }}
//     >
//       <DialogTitle>
//         <Typography variant="h4" align="center" sx={{ fontWeight: "bold", m: 2 }}>
//           Compare Lead and Aadhaar details
//         </Typography>
//       </DialogTitle>
//       <DialogContent>
//         <Box sx={{ p: 2,  }}>
//           <TableContainer
//             component={Paper}
//             elevation={3}
//             sx={{
//               borderRadius: "0px 20px",
//               backgroundColor: colors.white[100],
//               '& .MuiTableCell-root': {
//                 borderBottom: `2px solid ${colors.primary[400]}`,
//                 padding: "16px 24px",
//                 fontSize: 14,
//                 fontWeight: "500",
//               },
//               '& .MuiTableHead-root': {
//                 background: colors.primary[400],
//                 color: colors.white[100],
//               },
//               '& .MuiTableCell-head': {
//                 color: colors.white[100],
//                 fontWeight: 600,
//                 textAlign: "center",  
//                 fontSize: "15px",
//                 padding: "12px", 
//               },
//             }}
//           >
//             <Table>
//               <TableHead>
//                 <TableRow>
//                   <TableCell>
//                     Field
//                   </TableCell>
//                   <TableCell>
//                     Lead
//                   </TableCell>
//                   <TableCell>
//                     Aadhaar Details
//                   </TableCell>
//                   <TableCell>
//                     Comparison
//                   </TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {getComparisonFields(lead, aadhaarDetails)?.map(({ label, leadValue, aadhaarValue }) => {
//                   const result = compareValues(label, leadValue, aadhaarValue);
//                   const textColor = getTextColor(result);


//                   return (

//                     <TableRow key={label}>
//                       <TableCell
//                         sx={{
//                           padding: "16px 24px",
//                           fontSize: 14,
//                           textAlign: "center",
//                           color: colors.black[100],
//                           fontWeight: "500",
//                         }}
//                       >
//                         {label}:
//                       </TableCell>
//                       <TableCell
//                         sx={{
//                           padding: "16px 24px",
//                           fontSize: 14,
//                           textAlign: "center",
//                           color: colors.black[100],
//                         }}
//                       >
//                         {leadValue}
//                       </TableCell>
//                       <TableCell
//                         sx={{
//                           padding: "16px 24px",
//                           fontSize: 14,
//                           textAlign: "center",
//                           color: colors.black[100],
//                         }}
//                       >
//                         {aadhaarValue}
//                       </TableCell>
//                       <TableCell
//                         sx={{
//                           color: textColor,
//                           fontWeight: "bold",
//                           textAlign: "center",
//                           fontSize: 14,
//                           padding: "16px 24px",
//                         }}
//                       >
//                         {result === "Matched" ? (
//                           <>
//                             <CheckCircleOutlineIcon fontSize="small" sx={{ mr: 1, color: "#00796b" }} />
//                             Matched
//                           </>
//                         ) : (
//                           <>
//                             <HighlightOffIcon fontSize="small" sx={{ mr: 1 }} />
//                             Unmatched
//                           </>
//                         )}
//                       </TableCell>

//                     </TableRow>
//                   );
//                 })}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         </Box>
//       </DialogContent>
//       {isError && <p>{error?.data?.message}</p>}
//       <DialogActions sx={{ justifyContent: "space-between", px: 3, pb: 3 }}>
//         <Button
//           onClick={handleClose}
//           variant="contained"
//           sx={{
//             background:colors.white[100],
//             color: colors.redAccent[500],
//             border: `1px solid ${colors.redAccent[500]}`,
//             fontWeight: "bold",
//             borderRadius:"0px 10px",
//             '&:hover':{
//               backgroundColor:colors.redAccent[500],
//               color:colors.white[100],
//             }
//           }}
//         >
//           Close
//         </Button>
//         <Button
//           onClick={handleSubmit}
//           variant="contained"
//           sx={{
//             background:colors.white[100],
//             color: colors.primary[400],
//             border: `1px solid ${colors.primary[400]}`,
//             fontWeight: "bold",
//             borderRadius:"0px 10px",
//             '&:hover':{
//               backgroundColor:colors.primary[400],
//               color:colors.white[100],
//             }
//           }}
//         >
//           Show Document
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// };

// export default AadhaarCompare;
