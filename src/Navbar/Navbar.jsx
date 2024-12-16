import React, { useEffect, useState } from "react";
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
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
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
        <AppBar
            position="static"
            sx={{
                backgroundColor: "#001f3f",
                color: "#fff",
                boxShadow: "none",
            }}
        >
            <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography
                    variant="h6"
                    component={Link}
                    to="/"
                    sx={{
                        textDecoration: "none",
                        color: "inherit",
                        ml: 5,
                        fontWeight: "bold",
                        "&:hover": { color: "#f0f0f0" },
                    }}
                >
                    Qualoan
                </Typography>

                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <FormControl
                        variant="standard"
                        sx={{ m: 1, minWidth: 120 }}
                    >
                        {/* <InputLabel id="demo-simple-select-standard-label">Age</InputLabel> */}
                        <Select
                            labelId="demo-simple-select-standard-label"
                            id="demo-simple-select-standard"
                            value={activeRole}
                            onChange={(e) => handleRoleChange(e)}
                        // label="Age"
                        >
                            {empInfo.empRole &&
                                empInfo.empRole.map((role, i) => (
                                    <MenuItem key={i} value={role}>
                                        {splitCamelCase(role)}
                                    </MenuItem>
                                ))}
                        </Select>
                    </FormControl>

                    <IconButton color="inherit" onClick={handleMenuClick}>
                        <Avatar
                            sx={{ backgroundColor: "#fff", color: "#001f3f" }}
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
                                backgroundColor: "#001f3f",
                                color: "#fff",
                            },
                        }}
                    >
                        {sidebarLinks.map((link) => (
                            <MenuItem
                                component={Link}
                                to={link.path}
                                key={link.text}
                                sx={{
                                    color: "#fff",
                                    "&:hover": { backgroundColor: "#002f6c" },
                                }}
                            >
                                {link.text}
                            </MenuItem>
                        ))}
                        <MenuItem
                            onClick={handleLogout}
                            sx={{ color: "#ff4d4d", fontWeight: "bold" }}
                        >
                            Logout
                        </MenuItem>
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
