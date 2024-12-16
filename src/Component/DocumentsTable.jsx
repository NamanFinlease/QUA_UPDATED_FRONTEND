import React, { useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Typography, Button, Box } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useLazyGetLeadDocsQuery } from '../Service/Query';
import Swal from 'sweetalert2';

const DocumentsTable = ({ leadData, uploadedDocs }) => {


    const [getLeadDocs, { data, isSuccess, isError, error }] = useLazyGetLeadDocsQuery();


    const viewFile = (doc) => {
        let docType = ''
        if (doc.type) {
            docType = doc.type
        } else {
            docType = doc.url.split("/")[1]
        }

        getLeadDocs({ id: leadData._id, docType, docId: doc._id })

    }

    useEffect(() => {
        if (isSuccess && data) {
            const fileUrl = data?.url;
            const newTab = window.open(fileUrl, '_blank', 'noopener,noreferrer');
            if(newTab) window.focus()


        }

    }, [isSuccess, data])
    return (
        <TableContainer component={Box} sx={{ marginTop: 6, borderRadius: '8px', border: '1px solid #007bb2', overflow: 'hidden' }}>
            <Table>
                <TableHead>
                    <TableRow sx={{ backgroundColor: '#007bb2', color: '#ffffff' }}>
                        <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>S.N</TableCell>
                        <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>Name</TableCell>
                        <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>Remark</TableCell>
                        <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>View</TableCell>
                        {/* <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>Actions</TableCell> */}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {uploadedDocs?.map((doc, index) => (
                        <TableRow key={doc?._id}>
                            <TableCell sx={{ color: '#454443' }}>{index + 1}</TableCell>
                            <TableCell sx={{ color: '#454443' }}>{doc?.name}</TableCell>
                            <TableCell sx={{ color: '#454443' }}>{doc?.remarks}</TableCell>
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
                                    sx={{ color: '#007bff' }}
                                >
                                    <VisibilityIcon />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default DocumentsTable;
