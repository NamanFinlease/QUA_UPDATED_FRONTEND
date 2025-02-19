import React, { useEffect, useState } from "react";
import { tokens } from '../theme';
import { Link, useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import {
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Menu,
    MenuItem,
    Avatar,
    FormControl,
    InputLabel,
    Select,
    Box,
    useTheme,
    useMediaQuery,
} from "@mui/material";
import { Logout, Person } from "@mui/icons-material";
import useStore from "../Store";
import { useLogoutMutation } from "../Service/Query";
import useAuthStore from "../Component/store/authStore";
import Swal from "sweetalert2";

const Navbar = () => {
    const navigate = useNavigate();
    const { setEmployeeDetails } = useStore();
    const { setLogin, setEmpInfo, empInfo, activeRole, setActiveRole } =
        useAuthStore();
    // const [currentActiveRole, setCurrentActiveRole] = useState(activeRole)

    //color theme
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    // Media Queries for responsive design
    const isDesktop = useMediaQuery('(max-width:1024px)');
    const isTablet = useMediaQuery('(max-width:768px)');
    const isMobile = useMediaQuery('(max-width:450px)');

    const [logout, { isSuccess, isError, error }] = useLogoutMutation();
    const [menuAnchorEl, setMenuAnchorEl] = useState(null);

    const handleLogout = async () => {
        try {
            await logout();
        } catch (err) {
            console.error("Logout failed: ", err);
        }
    };

    const handleRoleChange = (e) => {
        const selectedRole = e.target.value;

        Swal.fire({
            title: "Are you sure?",
            text: `Do you want to switch to the ${selectedRole} role?`,
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: colors.primary[400],
            cancelButtonColor: colors.redAccent[500],
            confirmButtonText: "Yes, switch role",
        }).then((result) => {
            if (result.isConfirmed) {
                setActiveRole(selectedRole); // Set the new active role
                navigate("/"); // Navigate to the desired page
            }
        });
    };

    const handleMenuClick = (event) => {
        setMenuAnchorEl(event.currentTarget);
    };

    function splitCamelCase(str) {
        return str
            .replace(/([a-z])([A-Z])/g, "$1 $2") // Insert a space before each uppercase letter
            .replace(/(^\w|\s\w)/g, (match) => match.toUpperCase()); // Capitalize the first letter of each word
    }

    const handleMenuClose = () => {
        setMenuAnchorEl(null);
    };

    useEffect(() => {
        if (isSuccess) {
            setLogin(false);
            setEmpInfo(null);
            setEmployeeDetails(null);
            navigate("/login");
        }

        if (isError) {
            console.error("Error during logout: ", error);
        }
    }, [
        isSuccess,
        isError,
        error,
        setLogin,
        setEmpInfo,
        setEmployeeDetails,
        navigate,
    ]);

    // Function to get initials from the employee's name
    function getInitials(name) {
        return name
            .split(" ")
            .filter((word) => word) // Remove any empty strings caused by extra spaces
            .map((word) => word[0].toUpperCase())
            .join("");
    }

    // Generate initials for the Avatar
    const empInitials = empInfo?.name ? getInitials(empInfo.name) : "AB"; // Default initials if name is unavailable

    const sidebarLinks = [
        { text: "User Profile", path: "/user-profile" },
        { text: "Import CSV", path: "/import-csv" },
        ...(activeRole === "admin"
            ? [
                { text: "View Employees", path: "/employees-list" },
                { text: "Add Employee", path: "/add-employee" },
                { text: "Add Bank Details", path: "/add-bank-details" },
            ]
            : []),
        { text: "Add Holiday Details", path: "/add-holiday-details" },
    ];

    return (
        <Box sx={{background : colors.white[100]}}>
            <AppBar
                position="fixed"
                sx={{
                    // background: colors.white[100],
                    background: `linear-gradient(180deg, ${colors.white[100]} 1%, ${colors.primary[400]} 250%)`,
                    color: colors.black[100],
                    borderBottom: `2px solid ${colors.primary[400]}`,
                    boxShadow: "0px 0px 20px rgba(0, 0, 0, 0.3)",
                    height:70,
                    borderRadius:"0px 20px",
                    '& .MuiToolbar-root':{
                        display:"flex",
                        justifyContent:"space-between",
                    }
                }}
            >
                <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Typography
                        variant="h6"
                        component={Link}
                        to="/"
                        sx={{ 
                            marginLeft: isMobile ? 0 : "5px" ,
                            position: isMobile ? "relative" : "none",
                            left: isMobile ? "-10px" : "none",
                        }}
                    >
                        {/* Qualoan */}
                        <Box 
                            component="img" 
                            src="https://globals3diigitaloceanbucket.blr1.cdn.digitaloceanspaces.com/QUAASSESTS/Qua_logo.png"
                            // src="../src/assets/image/Qua_logo.png"
                            background="transparent"
                            sx={{ width: 100, height: 30, margin: "10px" }} 
                        />
                    </Typography>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 2,}}>
                        <FormControl
                            variant="outlined"
                            sx={{ 
                                m: 1, 
                                minWidth: 160,
                                background:colors.primary[400], 
                                borderRadius: "0px 20px",
                                boxShadow:"0px 0px 20px rgb(0,0,0,0.2)",
                                '& .MuiOutlinedInput-notchedOutline': {
                                    border: 0,
                                },
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': {
                                        border: 0,
                                    },
                                    '&:hover fieldset': {
                                        border: 0,
                                    },
                                    '&.Mui-focused fieldset': {
                                        border: 0,
                                    },
                                },
                            }}
                        >
                            <Select
                                labelId="demo-simple-select-standard-label"
                                id="demo-simple-select-standard"
                                value={activeRole}
                                onChange={(e) => handleRoleChange(e)}
                                sx={{
                                    fontWeight:700,
                                }}
                                MenuProps={{
                                    PaperProps: {
                                        sx: {
                                            backgroundColor: colors.white[100],
                                            borderRadius:"20px 0px",
                                        },
                                    },
                                }}
                            >   
                                {empInfo.empRole &&
                                    empInfo.empRole.map((role, i) => (
                                        <MenuItem 
                                            key={i} 
                                            value={role}
                                            sx={{
                                                background: colors.white[100],
                                                color:colors.primary[400],
                                                borderRadius:"10px 0px",
                                                '&:hover':{
                                                    background:`${colors.primary[400]}`,
                                                    color:`${colors.white[100]}`,
                                                },
                                                '&:active':{
                                                    color:colors.primary[400],
                                                    background:colors.white[100],
                                                },
                                                "&.Mui-selected": {
                                                    background: `${colors.primary[400]}`,
                                                    color: `${colors.white[100]}`,
                                                },
                                                "&.Mui-selected:hover": {
                                                    background: `${colors.primary[400]}`,
                                                    color: `${colors.white[100]}`,
                                                },
                                            }}
                                        >
                                            {splitCamelCase(role)}
                                        </MenuItem>
                                    ))}
                            </Select>
                        </FormControl>

                        <IconButton color="inherit" onClick={handleMenuClick}>
                            <Avatar
                                sx={{ 
                                    background:colors.white[100], 
                                    color: colors.primary[400], 
                                    border:`3px solid ${colors.primary[400]}`,
                                    padding:3,
                                }}
                            >
                                {empInitials} {/* Replace with dynamic initials */}
                            </Avatar>
                        </IconButton>
                        <Menu
                            anchorEl={menuAnchorEl}
                            open={Boolean(menuAnchorEl)}
                            onClose={handleMenuClose}
                            sx={{
                                ".MuiPaper-root": {
                                    background: colors.white[100],
                                    color: colors.primary[400],
                                    borderRadius: "20px 0px",
                                },
                            }}
                        >
                            {sidebarLinks.map((link) => (
                                <MenuItem
                                    component={Link}
                                    to={link.path}
                                    key={link.text}
                                    sx={{
                                        color: colors.primary[400],
                                        "&:hover": { background: colors.primary[400], color: colors.white[100] },
                                    }}
                                >
                                    {link.text}
                                </MenuItem>
                            ))}
                            <MenuItem
                                onClick={handleLogout}
                                sx={{ color: "red", fontWeight: "bold", "&:hover": { background:"red", color: colors.white[100] } }}
                            >
                                Logout
                            </MenuItem>
                        </Menu>
                    </Box>
                </Toolbar>
            </AppBar>
        </Box>
    );
};

export default Navbar;
