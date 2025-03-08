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
import useStore from "../../Store";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import dayjs from 'dayjs';


const BreDetails = ({ open, setOpen, breDetails }) => {
    const navigate = useNavigate()
    const { activeRole } = useAuthStore()
    const { lead } = useStore();
    const [errorMessage, setErrorMessage] = useState("");

    // Handle close modal
    const handleClose = () => {
        setOpen(false);
        setErrorMessage('');
    };

    // Color theme
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    // Function to render table rows dynamically
    useEffect(() => {
        if (breDetails)
            setOpen(false)
    }, [breDetails, setOpen])

    console.log(breDetails)

    return (
        <>
            <Dialog
                open={open}
                maxWidth="lg"
                fullWidth
                sx={{
                    '& .MuiDialog-paper': {
                        background: colors.white[100],
                        borderRadius: "0px 20px",
                        color: colors.primary[400],
                    },
                }}
            >
                <DialogTitle>
                    <Typography variant="h4" align="center" sx={{ fontWeight: "bold", m: 2 }}>
                        BRE Details
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ p: 2, }}>
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
                                    color:colors.black[100],
                                },
                            }}
                        >
                            <Table>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>File Name</TableCell>
                                        <TableCell>:</TableCell>
                                        <TableCell>{breDetails?.fileName}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Date Pulled</TableCell>
                                        <TableCell>:</TableCell>
                                        <TableCell>{breDetails?.datePulled && dayjs(breDetails?.datePulled).format('DD-MM-YYYY')}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Failed Accounts</TableCell>
                                        <TableCell>:</TableCell>
                                        <TableCell>{breDetails?.failedAccounts}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Max Laon Amount</TableCell>
                                        <TableCell>:</TableCell>
                                        <TableCell>{breDetails?.maxLoanAmount}</TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell>Final Decision</TableCell>
                                        <TableCell>:</TableCell>
                                        <TableCell>{breDetails?.finalDecision}</TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                </DialogContent>
                {/* {isError && <p>{error?.data?.message}</p>}
                {errorMessage && (
                    <Typography color="error" variant="body1" sx={{ mb: 2, textAlign: "center" }}>
                        {errorMessage}
                    </Typography>
                )} */}
                <DialogActions sx={{ justifyContent: "space-between", px: 3, pb: 3 }}>
                    <Button
                        onClick={handleClose}
                        variant="contained"
                        sx={{
                            background: colors.white[100],
                            color: colors.redAccent[500],
                            border: `1px solid ${colors.redAccent[500]}`,
                            fontWeight: "bold",
                            borderRadius: "0px 10px",
                            '&:hover': {
                                backgroundColor: colors.redAccent[500],
                                color: colors.white[100],
                            }
                        }}
                    >
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default BreDetails;