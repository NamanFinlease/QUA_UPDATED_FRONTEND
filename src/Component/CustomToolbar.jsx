import { GridToolbarContainer, GridToolbarExport } from '@mui/x-data-grid';
import {Button} from '@mui/material'
import FileDownloadIcon from '@mui/icons-material/FileDownload';

const CustomToolbar = ({onExportClick}) => {
    return (
        <GridToolbarContainer>
             <Button
                variant="contained"
                color="primary"
                onClick={onExportClick}
                sx={{
                    fontSize: '12px',
                    padding: '6px 12px',
                    marginBottom:'2px'
                }}
            >
              <FileDownloadIcon />  CSV
            </Button>
        </GridToolbarContainer>
    );
};

export default CustomToolbar