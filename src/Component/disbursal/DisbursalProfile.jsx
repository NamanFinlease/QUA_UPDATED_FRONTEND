import React, { useEffect, useState } from "react";
import { Paper, Box, Alert } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import ApplicantProfileData from "../applicantProfileData";
import InternalDedupe from "../InternalDedupe";
import ApplicationLogHistory from "../ApplicationLogHistory";
import BarButtons from "../BarButtons";
import LeadDetails from "../LeadDetails";
import PersonalDetails from "../applications/PersonalDetails";
import BankDetails from "../applications/BankDetails";
import VerifyContactDetails from "../leads/DetailsVerification";
import UploadDocuments from "../UploadDocuments";
import Cam from "../applications/Cam";
import { useDisbursalProfileQuery } from "../../Service/applicationQueries";
import useAuthStore from "../store/authStore";
import useStore from "../../Store";
import DisburseLoan from "./DisburseLoan";
import ActionButton from "../ActionButton";

const barButtonOptions = [
    "Application",
    "Documents",
    "Personal",
    "Banking",
    "Verification",
    "Cam",
    "Disbursal",
];

const DisbursalProfile = () => {
    const { id } = useParams();
    const [disbursalData, setDisbursalData] = useState();
    const { empInfo, activeRole } = useAuthStore();
    const { setApplicationProfile } = useStore();
    const navigate = useNavigate();
    const [uploadedDocs, setUploadedDocs] = useState([]);
    const [currentPage, setCurrentPage] = useState("application");
    const [leadEdit, setLeadEdit] = useState(false);

    const { data, isSuccess, isError, error, refetch } =
        useDisbursalProfileQuery(id, { skip: id === null });

    useEffect(() => {
        if (isSuccess && data) {
            setDisbursalData(data?.disbursal);
            setApplicationProfile(data?.disbursal);
        }
        if (isSuccess && data?.sanction?.application?.lead?.document?.length) {
            setUploadedDocs(
                data?.sanction?.application?.lead?.document.map(
                    (doc) => doc.type
                )
            );
        }
    }, [isSuccess, data]);
    // Ensure the API is triggered on every visit or id change
    useEffect(() => {
        if (id !== null) {
            refetch();
        }
    }, [id, refetch]);

    return (
        <div className="crm-container" style={{ padding: "10px" }}>
            <div className="p-3">
                <BarButtons
                    barButtonOptions={barButtonOptions}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                />

                {currentPage === "application" && (
                    <>
                        {disbursalData?.sanction?.application?.lead?._id && (
                            <>
                                <Paper
                                    elevation={3}
                                    sx={{
                                        padding: "20px",
                                        marginTop: "20px",
                                        borderRadius: "10px",
                                    }}
                                >
                                    <ApplicantProfileData
                                        leadData={
                                            disbursalData?.sanction?.application
                                                ?.lead
                                        }
                                    />
                                </Paper>
                                <InternalDedupe
                                    id={
                                        disbursalData?.sanction?.application
                                            ?.lead?._id
                                    }
                                />
                                <ApplicationLogHistory
                                    id={
                                        disbursalData?.sanction?.application
                                            ?.lead?._id
                                    }
                                />
                            </>
                        )}
                    </>
                )}

                {disbursalData && Object.keys(disbursalData).length > 0 && (
                    <>
                        {currentPage === "personal" && (
                            <PersonalDetails
                                id={
                                    disbursalData?.sanction?.application
                                        ?.applicant
                                }
                            />
                        )}
                        {currentPage === "banking" && (
                            <BankDetails
                                id={
                                    disbursalData?.sanction?.application
                                        ?.applicant
                                }
                            />
                        )}

                        {currentPage === "verification" && (
                            <VerifyContactDetails
                                isMobileVerified={
                                    disbursalData?.sanction?.application?.lead
                                        ?.isMobileVerified
                                }
                                isEmailVerified={
                                    disbursalData?.sanction?.application?.lead
                                        ?.isEmailVerified
                                }
                                isAadhaarVerified={
                                    disbursalData?.sanction?.application?.lead
                                        ?.isAadhaarVerified
                                }
                                isAadhaarDetailsSaved={
                                    disbursalData?.sanction?.applicationData
                                        ?.lead?.isAadhaarDetailsSaved
                                }
                                isPanVerified={
                                    disbursalData?.sanction?.application?.lead
                                        ?.isPanVerified
                                }
                                isESignPending={
                                    disbursalData?.sanction?.eSignPending
                                }
                                isESigned={disbursalData?.sanction?.eSigned}
                            />
                        )}
                        {currentPage === "documents" && (
                            <UploadDocuments
                                leadData={
                                    disbursalData?.sanction?.application?.lead
                                }
                                setUploadedDocs={setUploadedDocs}
                                uploadedDocs={uploadedDocs}
                            />
                        )}

                        {currentPage === "cam" && (
                            <Cam
                                id={disbursalData?.sanction?.application?._id}
                            />
                        )}
                        {currentPage === "disbursal" && (
                            <DisburseLoan disburse={disbursalData?.sanction} />
                        )}
                    </>
                )}

                {isError && (
                    <Alert severity="error" style={{ marginTop: "10px" }}>
                        {error?.data?.message}
                    </Alert>
                )}
            </div>
        </div>
    );
};

export default DisbursalProfile;
