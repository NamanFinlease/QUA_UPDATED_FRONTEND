import React, { useEffect, useRef, useState } from 'react';
import { tokens } from "../theme";
import {
    Autocomplete,
    Typography,
    Button,
    Box,
    IconButton,
    Checkbox,
    TextField,
    CircularProgress,
    Tooltip,
    useTheme,
    Alert,
    Paper,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    OutlinedInput,
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddIcon from '@mui/icons-material/Add';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { useLazyGetBanksQuery, useUploadDocumentsMutation } from '../Service/Query';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import useAuthStore from './store/authStore';
import DocumentsTable from './DocumentsTable';
import { GridCloseIcon } from '@mui/x-data-grid';
import { Cancel } from '@mui/icons-material';
const UploadDocuments = ({ leadData }) => {
    const { empInfo, activeRole } = useAuthStore();
    const [selectedBSA, setSelectedBSA] = useState([])
    const [uploadedDocs, setUploadedDocs] = useState();
    const [selectedDocuments, setSelectedDocuments] = useState([]);
    const [selectedDocType, setSelectedDocType] = useState(null);
    const [fileInputs, setFileInputs] = useState([{ file: null, remarks: "" }]);
    const [bankInputs, setBankInputs] = useState({
        bankCode: "",
        accountNo: "",
        accountType: "",
    });
    const [banks, setBanks] = useState([]);
    const [selectedBank, setSelectedBank] = useState("");
    const [documents, setDocuments] = useState({
        aadhaarFront: null,
        aadhaarBack: null,
        panCard: null,
        salarySlip: [],
        bankStatement: [],
    });
    const [uploadDocuments, { data, isSuccess: docSuccess, isLoading, isError: isDocError, error: docError }] = useUploadDocumentsMutation();
    const [getBanks, { data: bankList, isSuccess: bankSuccess, isLoading: bankLoading, isError: isBankError, error: bankError }] = useLazyGetBanksQuery();

    const { control } = useForm({
        defaultValues: {
            addRemarks: '',
        }
    })


    // New state for remarks when "others" is selected
    const [otherRemarks, setOtherRemarks] = useState('');

    // Color theme
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    // Handle file selection
    const handleFileChange = (index, event) => {
        const selectedFile = event.target.files[0];

        event.target.value = null;
        setFileInputs((prevFileInputs) => {
            const newFileInputs = [...prevFileInputs];
            newFileInputs[index].file = selectedFile;
            return newFileInputs;
        });
        setSelectedDocuments((prevFileInputs) => ({
            ...prevFileInputs,
            file: selectedFile,
        }));
    };

    // Handle remarks input
    const handleRemarksChange = (index, event) => {
        const { value } = event.target;
        setFileInputs((prevFileInputs) => {
            const newFileInputs = [...prevFileInputs];
            newFileInputs[index].remarks = value;
            return newFileInputs;
        });
        setSelectedDocuments((prevFileInputs) => ({
            ...prevFileInputs,
            remarks: value,
        }));
    };



    const handleBankChange = (e, newValue) => {

        setSelectedBank(newValue.bankName);
        setBankInputs((prev) => ({ ...prev, bankCode: newValue.code }));
    };

    // Add new file input
    const handleAddFileInput = () => {
        const lastInput = fileInputs[fileInputs.length - 1];
        if (!lastInput || !lastInput.file) {
            Swal.fire(
                "Warning!",
                "Please select a file for the current input before adding a new one.",
                "warning"
            );
            return;
        }
        setFileInputs([...fileInputs, { file: null, remarks: "" }]);
    };

    // Remove file input
    const handleRemoveFileInput = (index) => {
        const updatedInputs = fileInputs.filter((_, i) => i !== index);
        setFileInputs(updatedInputs);
    };

    const handleCheckbox = async (e, key) => {
        setSelectedDocType(null);
        setFileInputs([{ file: null, remarks: "" }]);
        if (e.target.checked) {
            console.log("checked");
            setSelectedDocType(key);
        }

        if (key === "bankStatement") {
            // Call API
            await getBanks();
        }
    };

    const removeBSA = (file) => {
        const updatedBSAFiles = selectedBSA.filter(ele => ele !== file)
        console.log('upadte ', updatedBSAFiles)

        setSelectedBSA(updatedBSAFiles)

    }

    const handleAccountNoChange = (e) => {
        setBankInputs((prev) => ({ ...prev, accountNo: e.target.value }));
    };

    const handleAccountTypeChange = (e) => {
        setBankInputs((prev) => ({ ...prev, accountType: e.target.value }));
    };

    const handleSubmit = async () => {
        const hasFileSelected = fileInputs.some((input) => input.file);

        if (!hasFileSelected && selectedBSA.length === 0) {
            Swal.fire(
                "Warning!",
                "Please select at least one file to upload.",
                "warning"
            );
            return;
        }

        const formData = new FormData();

        // Prepare data to be sent to the FormData
        fileInputs.forEach((input, index) => {
            console.log('htehtuhtneu', bankInputs.bankCode);
            if (input.file) {
                formData.append(`${selectedDocType}`, input.file); // Append file to formData
                formData.append(`remarks`, input.remarks); // Append remarks to formData
                if (selectedDocType === "bankStatement") {
                    formData.append(`bankCode`, bankInputs.bankCode);
                    formData.append(`accountNo`, bankInputs.accountNo);
                    formData.append(`accountType`, bankInputs.accountType);
                }
            }
            if (selectedBSA.length > 0) {
                formData.append(`remarks`, input.remarks); // Append remarks to formData

                formData.append(`bankCode`, bankInputs.bankCode);
                formData.append(`accountNo`, bankInputs.accountNo);
                formData.append(`accountType`, bankInputs.accountType);
                formData.append(`bsaList`, selectedBSA);
            }
        });

        try {
            // Call the mutation to upload the documents with formData
            await uploadDocuments({
                id: leadData._id,
                docsData: formData,
            }).unwrap();
            Swal.fire(
                "Success!",
                "Documents uploaded successfully!",
                "success"
            );

            // Reset state after successful upload
            setDocuments({
                aadhaarFront: null,
                aadhaarBack: null,
                panCard: null,
                salarySlip: [],
                bankStatement: [],
            });
            setFileInputs([{ file: null, remarks: '' }]); // Reset file inputs
            setSelectedDocType(null);
            setOtherRemarks('');
            setSelectedBSA([])
            setBankInputs({
                bankCode: "",
                accountNo: "",
                accountType: "",

            })

        } catch (error) {
            Swal.fire(
                "Error!",
                error?.data?.message,
                "error"
            );
        }
    };

    useEffect(() => {
        if (bankSuccess && bankList) {
            setBanks(bankList);
        }
    }, [bankSuccess, bankList]);

    useEffect(() => {
        if (docSuccess) {
            Swal.fire({
                title: "Documents uploaded successfully!",
                icon: "success",
            });
        }
    }, [docSuccess]);
    useEffect(() => {
        if (
            leadData?.documents?.document &&
            Object.keys(leadData?.documents?.document)
        ) {
            const merged = [
                ...(leadData?.documents?.document?.multipleDocuments?.salarySlip ?? []),
                ...(leadData?.documents?.document?.multipleDocuments?.bankStatement ?? []),
                ...(leadData?.documents?.document?.multipleDocuments?.others ?? []),
                ...(leadData?.documents?.document?.multipleDocuments?.statementAnalyser ?? []),
                ...(leadData?.documents?.document?.multipleDocuments?.sanctionLetter ?? []),
                ...(leadData?.documents?.document?.multipleDocuments?.repaymentDocs ?? []),
                ...(leadData?.documents?.document?.singleDocuments ?? [])
            ];

            setUploadedDocs(merged);
        }

    }, [leadData]);

    return (
        <>

            {activeRole === "screener" &&
                <>
                    <Box
                        sx={{
                            maxWidth: '1000px',
                            margin: '0 auto',
                            mt: 3,
                            p: 3,
                            backgroundColor: colors.white[100],
                            color: colors.primary[400],
                            borderRadius: "0px 20px 0px 20px",
                            border: `1px solid ${colors.primary[400]}`,
                            boxShadow: `0px 0px 20px rgb(0,0,0,0.2)`,
                        }}
                    >

                        <Typography variant="h6" style={{ fontWeight: '600', color: colors.primary[400], marginBottom: "10px", textAlign: "center", fontSize: "18px" }}>
                            Upload Documents
                        </Typography>

                        <Box display="flex" flexDirection="column" gap={2}>
                            <Box display="flex" flexWrap="wrap" justifyContent="center" alignItems="center" gap={2}>
                                {['aadhaarFront', 'aadhaarBack', 'panCard', 'salarySlip', 'bankStatement', 'others'].map((key) => (
                                    <Box
                                        key={key}
                                        sx={{
                                            display: 'flex',
                                            flexWrap: "wrap",
                                            alignItems: "center",
                                            gap: "1",
                                        }}
                                    >
                                        <Checkbox
                                            checked={selectedDocType === key}
                                            disabled={selectedBSA.length > 0}
                                            onChange={(e) => handleCheckbox(e, key)}
                                            sx={{
                                                color: colors.primary[400],
                                                '&.Mui-checked': { color: colors.primary[400] },

                                                // Override MUI's default disabled styles
                                                '&.Mui-disabled': {
                                                    color: colors.primary[400], // Keeps the color instead of default gray
                                                    opacity: 0.5,  // Slightly faded
                                                    cursor: 'not-allowed', // Show "not-allowed" cursor
                                                    pointerEvents: 'none', // Prevent interaction
                                                },

                                                // Also apply the same effect on the label (if any)
                                                '&.Mui-disabled + span': {
                                                    opacity: 0.5,
                                                }
                                            }}
                                        />
                                        <Typography variant="subtitle2" style={{ fontWeight: '600', color: colors.black[100], fontSize: '14px' }}>
                                            {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>



                            {(selectedDocType || selectedBSA.length > 0) && (
                                <>
                                    <Box
                                        sx={{
                                            display: "inline-flex", // Ensures the box sizes itself properly
                                            alignItems: "center",
                                            gap: "8px",

                                            padding: "6px 12px",
                                            // boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                                            maxWidth: "100%", // Prevents fixed small width issues
                                            // border: "1px solid #ccc",
                                            overflow: "hidden",
                                            flexWrap: "wrap", // Allows items to wrap properly
                                        }}
                                    >
                                        {selectedBSA.map((file) => (
                                            <Box
                                                key={file}
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    paddingLeft: "5px",
                                                    justifyContent: "space-between",
                                                    gap: "4px",
                                                    backgroundColor: "#f0f0f0",
                                                    borderRadius: "20px",
                                                    flexGrow: 1,
                                                    minWidth: "100px",
                                                    maxWidth: "200px", // Adjust if needed
                                                    overflow: "hidden",
                                                }}
                                            >
                                                <Typography
                                                    sx={{
                                                        flex: 1, // Takes available space
                                                        minWidth: 0, // Required for text truncation
                                                        fontSize: "14px",
                                                        padding: "5px",
                                                        fontWeight: 500,
                                                        color: "#333",
                                                        whiteSpace: "nowrap",
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis",
                                                    }}
                                                >
                                                    {file}
                                                </Typography>
                                                <IconButton
                                                    size="small"
                                                    onClick={() => removeBSA(file)}
                                                    sx={{
                                                        color: colors.redAccent[500],
                                                        padding: "10px",
                                                        transition: "0.2s",
                                                        "&:hover": { color: "#b71c1c", transform: "scale(1.1)" },
                                                    }}
                                                >
                                                    <Cancel fontSize="small" />
                                                </IconButton>
                                            </Box>
                                        ))}
                                    </Box>





                                    {selectedDocType && <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, }}>
                                        {fileInputs.map((input, index) => (
                                            <Box
                                                key={index}
                                                sx={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: 2,
                                                    p: 2,
                                                    borderRadius: "0px 20px 0px 20px",
                                                    backgroundColor: colors.white[100],
                                                    boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.2)',
                                                }}
                                            >
                                                <Button
                                                    variant="outlined"
                                                    component="label"
                                                    // onClick={() => fileInputRef.current.click()}
                                                    sx={{
                                                        minWidth: 120,
                                                        background: colors.primary[400],
                                                        borderColor: colors.primary[400],
                                                        color: colors.white[100],
                                                        borderRadius: "0px 10px 0px 10px",
                                                        '&:hover': {
                                                            background: colors.primary[100],
                                                        },
                                                    }}
                                                >
                                                    Choose File
                                                    <input
                                                        type="file"
                                                        // ref={fileInputRef}
                                                        hidden
                                                        onChange={(event) => handleFileChange(index, event)}
                                                    />
                                                </Button>
                                                {/* Conditional Remarks Input */}
                                                {/* {selectedDocType === 'others' ? (
                                        <FormControl 
                                            fullWidth 
                                            variant="outlined"
                                            sx={{
                                                '& .MuiOutlinedInput-root': {
                                                    color:colors.primary[400],
                                                },
                                                '& .MuiOutlinedInput-notchedOutline': {
                                                    borderColor:colors.primary[400],
                                                },
                                                '& .MuiInputLabel-root': {
                                                    color:colors.primary[400],
                                                },
                                                '& .MuiSelect-icon': {
                                                    color:colors.primary[400],
                                                }
                                            }}
                                        >
                                            <InputLabel id="other-remarks-label">Select Remarks</InputLabel>
                                            <Select
                                                labelId="other-remarks-label"
                                                value={otherRemarks}
                                                onChange={(e) => setOtherRemarks(e.target.value)}
                                                label="Select Remarks"
                                            >
                                                <MenuItem value="" disabled>Select</MenuItem>
                                                <MenuItem value="passport">Passport</MenuItem>
                                                <MenuItem value="voterCard">Voter's Indentity Card</MenuItem>
                                                <MenuItem value="drivingLicense">Driving License</MenuItem>
                                                <MenuItem value="electricityBill">Electricity Bill</MenuItem>
                                                <MenuItem value="rationCard">Ration Card</MenuItem>
                                                <MenuItem value="nregaCard">NREGA Card</MenuItem>
                                            </Select>
                                        </FormControl>
                                    ) : (
                                        <TextField
                                            label="Remarks / Document Credentials"
                                            value={input.remarks}
                                            onChange={(event) => handleRemarksChange(index, event)}
                                            variant="outlined"
                                            size="small"
                                            sx={{
                                                flex: 1,
                                                '& .MuiInputBase-input': { color: colors.primary[400] },
                                                '& .MuiInputLabel-root': { color: colors.primary[400] },
                                                '& .MuiOutlinedInput-root': {
                                                    '& fieldset': { borderColor: colors.primary[400], borderRadius: "0px 10px 0px 10px", },
                                                    '&:hover fieldset': { borderColor: colors.primary[400] },
                                                },
                                            }}
                                        />
                                    )} */}

                                                {/* Remarks Input */}
                                                <TextField
                                                    label="Remarks"
                                                    value={input.remarks}
                                                    onChange={(event) => handleRemarksChange(index, event)}
                                                    variant="outlined"
                                                    size="small"
                                                    sx={{
                                                        flex: 1,
                                                        '& .MuiInputBase-input': { color: colors.primary[400] },
                                                        '& .MuiInputLabel-root': { color: colors.primary[400] },
                                                        '& .MuiOutlinedInput-root': {
                                                            '& fieldset': { borderColor: colors.primary[400], borderRadius: "0px 10px", },
                                                            '&:hover fieldset': { borderColor: colors.primary[400] },
                                                        },
                                                    }}
                                                />

                                                {/* View Button */}
                                                {input.file && (
                                                    <Tooltip title="View File" arrow placement='top'>
                                                        <IconButton
                                                            color="primary"
                                                            component="a"
                                                            href={URL.createObjectURL(input.file)}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            sx={{ color: colors.primary[400] }}
                                                        >
                                                            <VisibilityIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                )}

                                                {/* Remove File Button */}
                                                {index > 0 && (
                                                    <IconButton
                                                        color="secondary"
                                                        onClick={() =>
                                                            handleRemoveFileInput(
                                                                index
                                                            )
                                                        }
                                                        sx={{ color: "#ff4d4f" }}
                                                    >
                                                        <RemoveCircleOutlineIcon />
                                                    </IconButton>
                                                )}

                                                {/* Add New Input Button */}
                                                {index === fileInputs.length - 1 &&
                                                    ![
                                                        "aadhaarFront",
                                                        "aadhaarBack",
                                                        "panCard",
                                                    ].includes(selectedDocType) &&
                                                    fileInputs[
                                                        fileInputs.length - 1
                                                    ].file && (
                                                        <IconButton
                                                            color="primary"
                                                            onClick={
                                                                handleAddFileInput
                                                            }
                                                            sx={{
                                                                backgroundColor:
                                                                    "#007bff",
                                                                color: "white",
                                                                "&:hover": {
                                                                    backgroundColor:
                                                                        "#0056b3",
                                                                },
                                                            }}
                                                        >
                                                            <AddIcon />
                                                        </IconButton>
                                                    )}
                                            </Box>
                                        ))}
                                    </Box>}
                                    {(selectedDocType === "bankStatement" || selectedBSA.length > 0) && (
                                        <>
                                            <Box
                                                display="flex"
                                                component={Paper}
                                                elevation={2}
                                                gap={2}
                                                alignItems="center"
                                                sx={{ 
                                                    flexWrap: "wrap", 
                                                    padding: 2, 
                                                    backgroundColor: colors.white[100], 
                                                    borderRadius: "0px 20px",
                                                    "& .MuiInputBase-input": {
                                                        color: colors.black[100],
                                                    },
                                                    "& .MuiInputLabel-root": {
                                                        color: colors.black[400],
                                                    },
                                                    "& .MuiOutlinedInput-root": {
                                                        "& fieldset": { borderColor: colors.primary[400] },
                                                        "&:hover fieldset": { borderColor: colors.primary[400] },
                                                    },
                                                    "& .MuiButtonBase-root": {
                                                        color:colors.primary[400],
                                                    },
                                                }}
                                            >
                                                {/* Bank Selection */}
                                                <Autocomplete
                                                    disablePortal
                                                    options={banks}
                                                    getOptionLabel={(option) => option.bankName}
                                                    onChange={handleBankChange}
                                                    renderInput={(params) =>
                                                        <TextField
                                                            {...params}
                                                            label="Bank"
                                                        />
                                                    }
                                                    sx={{
                                                        flex: 1,
                                                        cursor: "pointer",
                                                    }}
                                                />

                                                {/* Account Number */}
                                                <TextField
                                                    label="Account No"
                                                    value={bankInputs.accountNo}
                                                    onChange={handleAccountNoChange}
                                                    variant="outlined"
                                                    sx={{
                                                        flex: 1,
                                                    }}
                                                    required
                                                />

                                                {/* Account Type */}
                                                <TextField
                                                    label="Account Type"
                                                    value={bankInputs.accountType}
                                                    onChange={handleAccountTypeChange}
                                                    variant="outlined"
                                                    sx={{
                                                        flex: 1,
                                                    }}
                                                    required
                                                />
                                            </Box>
                                        </>
                                    )}
                                    <Button
                                        onClick={handleSubmit}
                                        disabled={isLoading}
                                        variant="contained"
                                        sx={{
                                            backgroundColor: isLoading ? "#ccc" : colors.white[100],
                                            border: isLoading ? "ccc" : `1px solid ${colors.primary[400]}`,
                                            borderRadius: "0px 10px 0px 10px",
                                            color: isLoading ? "#666" : colors.primary[400],
                                            cursor: isLoading ? "not-allowed" : "pointer",
                                            "&:hover": {
                                                backgroundColor: isLoading ? "#ccc" : colors.primary[400],
                                                color: isLoading ? "#ccc" : colors.white[100],
                                            },
                                        }}
                                    >
                                        {isLoading ? <CircularProgress size={20} color="inherit" /> : selectedBSA.length > 0 ? "Analyse" : "Submit"}
                                    </Button>
                                </>
                            )}
                        </Box>
                    </Box>
                </>
            }


            <Box>
                

                {(
                    uploadedDocs && uploadedDocs.length > 0 &&
                    <DocumentsTable
                        leadData={leadData}
                        uploadedDocs={uploadedDocs}
                        selectedDocType={selectedDocType}
                        setSelectedBSA={setSelectedBSA}
                        selectedBSA={selectedBSA}
                        getBanks={getBanks}
                    />
                )}
            </Box>

        </>
    );
};

export default UploadDocuments;
