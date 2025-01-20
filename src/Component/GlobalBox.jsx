import { Box, Typography, useTheme } from "@mui/material";
import ProgressCircle from "./ProgressCircle";
import { tokens } from "../theme";

const GlobalBox = ({ title, subtitle, icon, progress, increase }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box
      sx={{
        display:"flex",
        justifyContent:"center",
        alignItems:"center",
        width:"100%",
        height:"80%",
        margin:"0px 10px",
      }}
    >
      <Box sx={{textAlign:"center",}}>
        {icon}
        <Typography className="m-3"
          variant="h4"
          fontWeight="bold"
          sx={{ color: colors.primary[400] }}
        >
          {title}
        </Typography>
      </Box>
      <Box className="mt-3" sx={{color:colors.primary[400], textAlign: 'center'}}>
        <ProgressCircle progress={progress}/>
        <Typography fontWeight="bold" sx={{marginTop: '12px'}}>{increase}</Typography>
      </Box>
    </Box>
  );
};

export default GlobalBox;
