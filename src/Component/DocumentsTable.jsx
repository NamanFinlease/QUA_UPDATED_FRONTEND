import React, { useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Typography, Button, Box, useTheme } from '@mui/material';
import { tokens } from '../theme';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useLazyGetLeadDocsQuery } from '../Service/Query';
import Swal from 'sweetalert2';

const DocumentsTable = ({ leadData, uploadedDocs, setSelectedBSA, selectedDocType,selectedBSA,getBanks }) => {

    console.log('docs upload', uploadedDocs)


    const [getLeadDocs, { data, isSuccess, isError, error }] = useLazyGetLeadDocsQuery();

    // Color theme
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const viewFile = (doc) => {
        let docType = "";
        if (doc.type) {
            docType = doc.type;
        } else {
            docType = doc.url.split("/")[1];
        }

        getLeadDocs({ id: leadData._id, docType, docId: doc._id });
    };

    const selectFile = (file) => {
        console.log('file',file)

        setSelectedBSA(prev => [...prev,file])
        getBanks()

    }



    useEffect(() => {
        if (isSuccess && data) {
            const fileUrl = data?.url;
            console.log(data);
            if (data.type === "statementAnalyser") {
                console.log("testing");
                // Download the file instead of opening in a new tab
                const link = document.createElement("a");
                link.href = fileUrl;
                link.download = "statementAnalyser.xlsx"; // Change filename if needed
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
            const newTab = window.open(
                fileUrl,
                "_blank",
                "noopener,noreferrer"
            );
            if (newTab) window.focus();
        }
    }, [isSuccess, data]);
    return (
        <TableContainer component={Box} sx={{ marginTop: 6, borderRadius: '0px 20px 0px 20px', border: `1px solid ${colors.primary[400]}`, overflow: 'hidden' }}>
            <Table>
                <TableHead>
                    <TableRow
                        sx={{
                            backgroundColor: colors.primary[400],
                            color: colors.white[100],
                        }}
                    >
                        <TableCell sx={{ fontWeight: 'bold' }}>S.N</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>Remarks / Document Credentials</TableCell>
                        <TableCell sx={{ fontWeight: 'bold' }}>View</TableCell>
                        <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
                        {/* <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>Actions</TableCell> */}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {uploadedDocs?.map((doc, index) => (
                        <TableRow key={doc?._id}>
                            <TableCell sx={{ color: colors.black[100] }}>{index + 1}</TableCell>
                            <TableCell sx={{ color: colors.black[100] }}>{doc?.name}</TableCell>
                            <TableCell sx={{ color: colors.black[100] }}>{doc?.remarks}</TableCell>
                            <TableCell >
                                {/* <IconButton sx={{ color: '#454443'}} onClick={() => handleDownload(doc)}>
                                        <VisibilityIcon />
                                    </IconButton> */}
                                <IconButton
                                    color="primary"
                                    component="a"
                                    onClick={() => viewFile(doc)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    sx={{ color: colors.primary[400] }}
                                >
                                    <VisibilityIcon />
                                </IconButton>
                            </TableCell>
                            {(doc?.type || doc.url.split("/")[1]) === "bankStatement" ?
                                <TableCell >
                                    {/* <IconButton sx={{ color: '#454443'}} onClick={() => handleDownload(doc)}>
                                        <VisibilityIcon />
                                    </IconButton> */}
                                    <Button
                                        variant="contained"
                                        size="small"
                                        onClick={() => selectFile(doc.name)}                                        
                                        disabled={selectedDocType || selectedBSA.includes(doc.name)}
                                        sx={{
                                            borderRadius: '20px',
                                            textTransform: 'none',
                                    
                                            // ✅ Override MUI's default disabled styles
                                            '&.Mui-disabled': {
                                                backgroundColor: colors.primary[400], // Keep primary color instead of default gray
                                                opacity: 0.5,  // Faded effect
                                                cursor: 'not-allowed', // Show "not-allowed" cursor
                                                pointerEvents: 'none', // Prevent interaction
                                            },
                                        }}
                                    >
                                        {/* {label} */}
                                        BSA
                                    </Button>
                                </TableCell> : null}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default DocumentsTable;
