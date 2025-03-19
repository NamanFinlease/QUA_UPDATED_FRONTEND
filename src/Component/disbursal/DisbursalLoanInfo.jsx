import React, { useEffect, useState } from "react";
import { Button, Box, Typography, TextField, Alert, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import useStore from "../../Store";
import { formatDate } from "../../utils/helper";
import useAuthStore from "../store/authStore";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useRecommendLoanMutation } from "../../Service/applicationQueries";

const DisbursalLoanInfo = ({ disburse }) => {
    const { applicationProfile } = useStore();
    const { activeRole } = useAuthStore();
    const [remarks, setRemarks] = useState(null);
    const [openRemark, setOpenRemark] = useState(false);
    const navigate = useNavigate();

    // Color theme
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    console.log("profile", applicationProfile);

    const {
        sanction,
        sanction: {
            application,
            application: { cam, lead, lead: { fName, mName, lName } = {} } = {},
        } = {},
    } = applicationProfile || {};

    const [recommendLoan, { data, isSuccess, isError, error }] =
        useRecommendLoanMutation();

    const handleCancel = () => {
        // Reset all states to go back to initial state
        setRemarks("");
        setOpenRemark(false);
    };

    const handleSubmit = () => {
        if (!remarks) {
            Swal.fire({
                text: "Add some remarks!",
                icon: "warning",
            });
            return;
        }
        recommendLoan({ id: applicationProfile._id, remarks });
    };

    const info = [
        { label: "Loan No.", value: applicationProfile?.loanNo },
        { label: "Customer Name", value: `${fName}${mName ? ` ${mName}` : ``} ${lName}` },
        { label: "Processed By", value: `${application?.creditManagerId?.fName}${application?.creditManagerId?.mName ? ` ${application?.creditManagerId?.mName}` : ``} ${application?.creditManagerId?.lName}` },
        // { label: "Processed On", value: "-" },
        { label: "Sanctioned By", value: `${sanction?.approvedBy?.fName}${sanction?.approvedBy?.mName ? ` ${sanction?.approvedBy?.mName}` : ``} ${sanction?.approvedBy?.lName}` },
        { label: "Sanctioned On", value: sanction?.sanctionDate && formatDate(sanction?.sanctionDate) },
        { label: "Loan Approved (Rs.)", value: cam?.loanRecommended },
        { label: "ROI % (p.d.) Approved", value: cam?.roi },
        { label: "Processing Fee", value: cam?.netAdminFeeAmount },
        { label: "Tenure", value: cam?.eligibleTenure },
        { label: "Sanctioned Email Sent On", value: sanction?.sanctionDate && formatDate(sanction?.sanctionDate) },
        { label: "Sanctioned Email Sent To", value: lead?.personalEmail },
        // { label: "Sanctioned Email Response Status", value: "ACCEPTED" },
        { label: "Acceptance Email", value: lead?.personalEmail },
        ...(applicationProfile.isDisbursed ? [
            { label: "Disbursed From", value: applicationProfile?.payableAccount },
            { label: "Disbursed On", value: applicationProfile?.disbursedBy && formatDate(applicationProfile?.disbursedAt) },
            { label: "Disbursed By", value: `${applicationProfile?.disbursedBy?.fName}${applicationProfile?.disbursedBy?.mName ? ` ${applicationProfile?.disbursedBy?.mName}` : ``} ${applicationProfile?.disbursedBy?.lName}` },
            { label: "Disbursed Amount", value: applicationProfile?.amount },
        ] : [])
    ];

    useEffect(() => {
        if (isSuccess && data) {
            Swal.fire({
                text: "Loan disbursement approved!",
                icon: "success",
            });
            navigate("/disbursal-process");
        }
    }, [isSuccess, data]);

    return (
        <>
            <Box
                sx={{
                    maxWidth: "1200px",
                    // padding: "20px",
                    borderRadius: "0px 20px",
                    backgroundColor: colors.white[100],
                    fontSize: "12px",
                    lineHeight: "1.5",
                    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                    overflowX: "auto",
                }}
            >
                <table style={{ width: "100%", borderCollapse: "collapse", minWidth: "600px",lineHeight: "2.5" }}>
                    <tbody>
                        {info.map((field, index) => (
                            index % 2 === 0 && (
                                <tr key={index}>
                                    {[0, 1].map((offset) => {
                                        const item = info[index + offset];
                                        if (!item) return null;
                                        return (
                                            <td
                                                key={`${index}-${offset}`}
                                                style={{
                                                    borderBottom: `2px solid ${colors.primary[400]}`,
                                                    padding: "10px",
                                                    whiteSpace: "nowrap",
                                                }}
                                            >
                                                <label style={{ fontWeight: "bold" }}>{item.label} : </label>
                                                <span> {item.value}</span>
                                            </td>
                                        );
                                    })}
                                </tr>
                            )
                        ))}
                    </tbody>
                </table>
            </Box>
            {openRemark && (
                <>
                    <Box
                        sx={{
                            marginTop: 3,
                            padding: 4,
                            backgroundColor: colors.white[100],
                            borderRadius: "0px 20px",
                            boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
                        }}
                    >
                        <Typography variant="h4" gutterBottom>
                            Remarks
                        </Typography>
                        <TextField
                            label="Add your remarks"
                            value={remarks}
                            onChange={(e) => setRemarks(e.target.value)}
                            fullWidth
                            multiline
                            rows={3}
                            sx={{
                                marginBottom: 3,
                                color: colors.black[100],
                                backgroundColor: colors.white[100],
                                borderRadius: 1,
                                "& .MuiOutlinedInput-root": {
                                    "& fieldset": {
                                        borderColor: colors.primary[400],
                                    },
                                    "&:hover fieldset": {
                                        borderColor: colors.primary[400],
                                    },
                                    "&.Mui-focused fieldset": {
                                        borderColor: colors.primary[400],
                                    },
                                },
                            }}
                        />
                    </Box>
                    {isError && (
                        <Alert severity="error" style={{ marginTop: "10px" }}>
                            {error?.data?.message}
                        </Alert>
                    )}

                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            gap: 2,
                            marginTop: 3,
                        }}
                    >
                        <Button
                            variant="outlined"
                            onClick={handleCancel}
                            sx={{
                                padding: "10px 20px",
                                borderRadius: "0px 10px",
                                fontWeight: "bold",
                                border: `2px solid ${colors.redAccent[500]}`,
                                backgroundColor: colors.white[100],
                                color: colors.redAccent[400],
                                ":hover": { backgroundColor: colors.redAccent[500], color: colors.white[100] },
                            }}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handleSubmit}
                            sx={{
                                padding: "10px 20px",
                                borderRadius: "0px 10px",
                                fontWeight: "bold",
                                border: `2px solid ${colors.primary[400]}`,
                                backgroundColor: colors.white[100],
                                color: colors.primary[400],
                                ":hover": { backgroundColor: colors.primary[400], color: colors.white[100] },
                            }}
                        >
                            Submit
                        </Button>
                    </Box>
                </>
            )}
        </>
    );
};

export default DisbursalLoanInfo;
