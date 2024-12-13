import { Box, Typography, useTheme } from "@mui/material";
// import { tokens } from "../theme";
import ProgressCircle from "./ProgressCircle";
import { tokens } from "../theme";

const GlobalBox = ({ title, subtitle, icon, progress, increase }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box width="100%" height="80%" m="0 10px" >
      <Box height="100%" display="flex" justifyContent="space-around">
        <Box >
          {icon}
          <Typography className="mt-3"
            variant="h4"
            fontWeight="bold"
            sx={{ color: colors.grey[100] }}
          >
            {title}
          </Typography>
        </Box>
        <Box className="mt-3" sx={{color: 'white', textAlign: 'center'}}>
          <ProgressCircle progress={progress}/>
          <Typography fontWeight="bold" sx={{marginTop: '12px'}}>{increase}</Typography>
        </Box>
      </Box>
      {/* <Box display="flex" justifyContent="space-between" mt="2px">
        <Typography variant="h5" sx={{ color: '#1F2A40', border: '1px solid white' }}>
          {subtitle}
        </Typography> 
        <Typography
          variant="h5"
          fontStyle="italic"
          sx={{ color: 'white' }}
        >
          
        </Typography>
      </Box> */}
    </Box>
  );
};

export default GlobalBox;
