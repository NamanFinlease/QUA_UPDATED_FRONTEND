import React, { useState } from "react";
import {
    Box,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    List,
    ListItem,
    ListItemText,
    IconButton,
} from "@mui/material";
import { NavLink, Link } from "react-router-dom";
import useAuthStore from "../Component/store/authStore";
import { FaBars } from "react-icons/fa";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { CSSTransition } from "react-transition-group";

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
    const { empInfo, activeRole } = useAuthStore();

    // State to control the expanded accordions
    const [expanded, setExpanded] = useState(null);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    // Function to handle accordion toggle
    const handleAccordionToggle = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    return (
        <Box
            sx={{
                width: isSidebarOpen ? 250 : 0,
                height: "100vh",
                color: "#fff",
                position: "fixed",
                top: 0,
                left: 0,
                display: "flex",
                flexDirection: "column",
                transition: "width 0.3s ease",
                overflowY: "auto",
                boxShadow: isSidebarOpen
                    ? "2px 0 5px rgba(0, 0, 0, 0.1)"
                    : "none",
                zIndex: 0,
                backgroundColor: "#001f3f",
            }}
        >
            {/* Heading for the sidebar */}
            <Box
                sx={{
                    backgroundColor: "#001f3f",
                    padding: 2,
                    textAlign: "left",
                }}
            >
                <Typography
                    component={Link}
                    to="/"
                    variant="h6"
                    sx={{
                        textDecoration: "none",
                        color: "#fff",
                        fontWeight: "bold",
                        marginTop: "5px",
                        marginLeft: "20px",
                    }}
                >
                    Qualoan
                </Typography>
            </Box>

            <Box sx={{ marginTop: "0px", padding: isSidebarOpen ? 2 : 0 }}>
                <List sx={{ padding: 0, margin: 0 }}>
                    {(activeRole === "screener" ||
                        activeRole === "admin" ||
                        activeRole === "sanctionHead") && (
                        <Accordion
                            expanded={expanded === "lead"}
                            onChange={handleAccordionToggle("lead")}
                            sx={{
                                "&:before": {
                                    display: "none",
                                },
                                transition:
                                    "background-color 0.3s ease, transform 0.3s ease",
                                "&:hover": {
                                    backgroundColor: "#002b5c",
                                    transform: "scale(1.03)",
                                },
                            }}
                        >
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                sx={{
                                    backgroundColor: "#001f3f",
                                    color: "#fff",
                                }}
                            >
                                <Typography variant="subtitle1">
                                    <i
                                        className="bi bi-person"
                                        style={{ marginRight: "8px" }}
                                    ></i>{" "}
                                    Lead
                                </Typography>
                            </AccordionSummary>
                            <CSSTransition
                                in={expanded === "lead"}
                                timeout={300}
                                classNames={{
                                    enter: "accordion-enter",
                                    enterActive: "accordion-enter-active",
                                    exit: "accordion-exit",
                                    exitActive: "accordion-exit-active",
                                }}
                                unmountOnExit
                            >
                                <AccordionDetails
                                    sx={{
                                        backgroundColor: "#001f3f",
                                        padding: 0,
                                    }}
                                >
                                    <List>
                                        <ListItem
                                            component={NavLink}
                                            to="/lead-new"
                                            sx={{
                                                color: "#fff",
                                                textDecoration: "none",
                                                padding: "10px 15px",
                                            }}
                                        >
                                            <ListItemText
                                                primary="New Lead"
                                                sx={{ color: "#fff" }}
                                            />
                                        </ListItem>
                                        <ListItem
                                            component={NavLink}
                                            to="/lead-process"
                                            sx={{
                                                color: "#fff",
                                                textDecoration: "none",
                                                padding: "10px 15px",
                                            }}
                                        >
                                            <ListItemText
                                                primary="Lead-Inprocess"
                                                sx={{ color: "#fff" }}
                                            />
                                        </ListItem>
                                        <ListItem
                                            component={NavLink}
                                            to="/lead-hold"
                                            sx={{
                                                color: "#fff",
                                                textDecoration: "none",
                                                padding: "10px 15px",
                                            }}
                                        >
                                            <ListItemText
                                                primary="Hold Lead"
                                                sx={{ color: "#fff" }}
                                            />
                                        </ListItem>
                                        <ListItem
                                            component={NavLink}
                                            to="/rejected-leads"
                                            sx={{
                                                color: "#fff",
                                                textDecoration: "none",
                                                padding: "10px 15px",
                                            }}
                                        >
                                            <ListItemText
                                                primary="Rejected Lead"
                                                sx={{ color: "#fff" }}
                                            />
                                        </ListItem>
                                    </List>
                                </AccordionDetails>
                            </CSSTransition>
                        </Accordion>
                    )}

                    {(activeRole === "creditManager" ||
                        activeRole === "sanctionHead" ||
                        activeRole === "admin") && (
                        <Accordion
                            expanded={expanded === "application"}
                            onChange={handleAccordionToggle("application")}
                        >
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                sx={{
                                    backgroundColor: "transparent",
                                    color: "#fff",
                                }}
                            >
                                <Typography variant="subtitle1">
                                    Application
                                </Typography>
                            </AccordionSummary>
                            <CSSTransition
                                in={expanded === "application"}
                                timeout={300}
                                classNames={{
                                    enter: "accordion-enter",
                                    enterActive: "accordion-enter-active",
                                    exit: "accordion-exit",
                                    exitActive: "accordion-exit-active",
                                }}
                                unmountOnExit
                            >
                                <AccordionDetails
                                    sx={{
                                        backgroundColor: "transparent",
                                        padding: 0,
                                    }}
                                >
                                    <List>
                                        {[
                                            {
                                                text: "New",
                                                link: "/new-applications",
                                            },
                                            {
                                                text: "Inprocess",
                                                link: "/application-process",
                                            },
                                        ].map((item, index) => (
                                            <ListItem
                                                key={index}
                                                component={Link}
                                                to={item.link}
                                                sx={{
                                                    color: "#fff",
                                                    textDecoration: "none",
                                                    padding: "10px 15px",
                                                }}
                                            >
                                                <ListItemText
                                                    primary={item.text}
                                                    sx={{ color: "#fff" }}
                                                />
                                            </ListItem>
                                        ))}
                                    </List>
                                </AccordionDetails>
                            </CSSTransition>
                        </Accordion>
                    )}

                    {(activeRole === "sanctionHead" ||
                        activeRole === "admin") && (
                        <Accordion
                            expanded={expanded === "sanction"}
                            onChange={handleAccordionToggle("sanction")}
                        >
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                sx={{
                                    backgroundColor: "transparent",
                                    color: "#fff",
                                }}
                            >
                                <Typography variant="subtitle1">
                                    
                                    Sanction
                                </Typography>
                            </AccordionSummary>
                            <CSSTransition
                                in={expanded === "sanction"}
                                timeout={300}
                                classNames={{
                                    enter: "accordion-enter",
                                    enterActive: "accordion-enter-active",
                                    exit: "accordion-exit",
                                    exitActive: "accordion-exit-active",
                                }}
                                unmountOnExit
                            >
                                <AccordionDetails
                                    sx={{
                                        backgroundColor: "transparent",
                                        padding: 0,
                                    }}
                                >
                                    <List>
                                        {[
                                            {
                                                text: "Pending Sanctions",
                                                link: "/pending-sanctions",
                                            },
                                            {
                                                text: "Sanctioned",
                                                link: "/sanctioned",
                                            },
                                            // {
                                            //     text: "eSignPending",
                                            //     link: "/eSign-pending",
                                            // },
                                        ].map((item, index) => (
                                            <ListItem
                                                key={index}
                                                component={Link}
                                                to={item.link}
                                                sx={{
                                                    color: "#fff",
                                                    textDecoration: "none",
                                                    padding: "10px 15px",
                                                }}
                                            >
                                                <ListItemText
                                                    primary={item.text}
                                                    sx={{ color: "#fff" }}
                                                />
                                            </ListItem>
                                        ))}
                                    </List>
                                </AccordionDetails>
                            </CSSTransition>
                        </Accordion>
                    )}
                    {(activeRole === "creditManager" ||
                        activeRole === "sanctionHead" ||
                        activeRole === "admin") && (
                        <Accordion
                            expanded={expanded === "globalApplication"}
                            onChange={handleAccordionToggle(
                                "globalApplication"
                            )}
                        >
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                sx={{
                                    backgroundColor: "transparent",
                                    color: "#fff",
                                }}
                            >
                                <Typography variant="subtitle1">
                                    Global Application
                                </Typography>
                            </AccordionSummary>
                            <CSSTransition
                                in={expanded === "globalApplication"}
                                timeout={300}
                                classNames={{
                                    enter: "accordion-enter",
                                    enterActive: "accordion-enter-active",
                                    exit: "accordion-exit",
                                    exitActive: "accordion-exit-active",
                                }}
                                unmountOnExit
                            >
                                <AccordionDetails
                                    sx={{
                                        backgroundColor: "transparent",
                                        padding: 0,
                                    }}
                                >
                                    <List>
                                        {[
                                            {
                                                text: "E-Sign Pending",
                                                link: "/eSign-pending",
                                            },
                                            {
                                                text: "Hold",
                                                link: "/application-hold",
                                            },
                                            {
                                                text: "Rejected Applications",
                                                link: "/rejected-applications",
                                            },
                                        ].map((item, index) => (
                                            <ListItem
                                                key={index}
                                                component={Link}
                                                to={item.link}
                                                sx={{
                                                    color: "#fff",
                                                    textDecoration: "none",
                                                    padding: "10px 15px",
                                                }}
                                            >
                                                <ListItemText
                                                    primary={item.text}
                                                    sx={{ color: "#fff" }}
                                                />
                                            </ListItem>
                                        ))}
                                    </List>
                                </AccordionDetails>
                            </CSSTransition>
                        </Accordion>
                    )}
                    {(activeRole === "disbursalManager" ||
                        activeRole === "disbursalHead" ||
                        activeRole === "admin") && (
                        <Accordion
                            expanded={expanded === "disbursal"}
                            onChange={handleAccordionToggle("disbursal")}
                        >
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                sx={{
                                    backgroundColor: "transparent",
                                    color: "#fff",
                                }}
                            >
                                <Typography variant="subtitle1">
                                    <i
                                        className="bi bi-check"
                                        style={{ marginRight: "8px" }}
                                    ></i>{" "}
                                    Disbursal
                                </Typography>
                            </AccordionSummary>
                            <CSSTransition
                                in={expanded === "disbursal"}
                                timeout={300}
                                classNames={{
                                    enter: "accordion-enter",
                                    enterActive: "accordion-enter-active",
                                    exit: "accordion-exit",
                                    exitActive: "accordion-exit-active",
                                }}
                                unmountOnExit
                            >
                                <AccordionDetails
                                    sx={{
                                        backgroundColor: "transparent",
                                        padding: 0,
                                    }}
                                >
                                    <List>
                                        <ListItem
                                            component={Link}
                                            to="/disbursal-new"
                                            sx={{
                                                color: "#fff",
                                                textDecoration: "none",
                                                padding: "10px 15px",
                                            }}
                                        >
                                            <ListItemText
                                                primary="New"
                                                sx={{ color: "#fff" }}
                                            />
                                        </ListItem>
                                        <ListItem
                                            component={Link}
                                            to="/disbursal-process"
                                            sx={{
                                                color: "#fff",
                                                textDecoration: "none",
                                                padding: "10px 15px",
                                            }}
                                        >
                                            <ListItemText
                                                primary="Processing"
                                                sx={{ color: "#fff" }}
                                            />
                                        </ListItem>
                                        <ListItem
                                            component={Link}
                                            to="/disbursal-hold"
                                            sx={{
                                                color: "#fff",
                                                textDecoration: "none",
                                                padding: "10px 15px",
                                            }}
                                        >
                                            <ListItemText
                                                primary="Hold"
                                                sx={{ color: "#fff" }}
                                            />
                                        </ListItem>
                                        <ListItem
                                            component={Link}
                                            to="/rejected-disbursals"
                                            sx={{
                                                color: "#fff",
                                                textDecoration: "none",
                                                padding: "10px 15px",
                                            }}
                                        >
                                            <ListItemText
                                                primary="Rejected"
                                                sx={{ color: "#fff" }}
                                            />
                                        </ListItem>
                                        {(activeRole === "disbursalHead" ||
                                            activeRole === "admin") && (
                                            <>
                                                <ListItem
                                                    component={Link}
                                                    to="/disbursal-pending"
                                                    sx={{
                                                        color: "#fff",
                                                        textDecoration: "none",
                                                        padding: "10px 15px",
                                                    }}
                                                >
                                                    <ListItemText
                                                        primary="Disburse Pending"
                                                        sx={{ color: "#fff" }}
                                                    />
                                                </ListItem>
                                                <ListItem
                                                    component={Link}
                                                    to="/disbursed"
                                                    sx={{
                                                        color: "#fff",
                                                        textDecoration: "none",
                                                        padding: "10px 15px",
                                                    }}
                                                >
                                                    <ListItemText
                                                        primary="Disbursed"
                                                        sx={{ color: "#fff" }}
                                                    />
                                                </ListItem>
                                            </>
                                        )}
                                    </List>
                                </AccordionDetails>
                            </CSSTransition>
                        </Accordion>
                    )}
                    {(activeRole === "collectionExecutive" ||
                        activeRole === "collectionHead" ||
                        activeRole === "admin") && (
                        <Accordion
                            expanded={expanded === "collection"}
                            onChange={handleAccordionToggle("collection")}
                        >
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                sx={{
                                    backgroundColor: "transparent",
                                    color: "#fff",
                                }}
                            >
                                <Typography variant="subtitle1">
                                    Collection
                                </Typography>
                            </AccordionSummary>
                            <CSSTransition
                                in={expanded === "collection"}
                                timeout={300}
                                classNames={{
                                    enter: "accordion-enter",
                                    enterActive: "accordion-enter-active",
                                    exit: "accordion-exit",
                                    exitActive: "accordion-exit-active",
                                }}
                                unmountOnExit
                            >
                                <AccordionDetails
                                    sx={{
                                        backgroundColor: "transparent",
                                        padding: 0,
                                    }}
                                >
                                    <List>
                                        {(activeRole ===
                                            "collectionExecutive" ||
                                            activeRole === "admin") && (
                                            <>
                                                <ListItem
                                                    component={Link}
                                                    to="/activeLeads"
                                                    sx={{
                                                        color: "#fff",
                                                        textDecoration: "none",
                                                        padding: "10px 15px",
                                                    }}
                                                >
                                                    <ListItemText
                                                        primary="Active Leads"
                                                        sx={{ color: "#fff" }}
                                                    />
                                                </ListItem>
                                            </>
                                        )}
                                        {[
                                            // { text: 'Active Leads', link: '/activeLeads' },
                                            {
                                                text: "Verification Pending",
                                                link: "/pending-verification",
                                            },
                                            {
                                                text: "Closed Leads",
                                                link: "/closed-leads",
                                            },
                                        ].map((item, index) => (
                                            <ListItem
                                                key={index}
                                                component={Link}
                                                to={item.link}
                                                sx={{
                                                    color: "#fff",
                                                    textDecoration: "none",
                                                    padding: "10px 15px",
                                                }}
                                            >
                                                <ListItemText
                                                    primary={item.text}
                                                    sx={{ color: "#fff" }}
                                                />
                                            </ListItem>
                                        ))}
                                    </List>
                                </AccordionDetails>
                            </CSSTransition>
                        </Accordion>
                    )}
                    {(activeRole === "accountExecutive" ||
                        activeRole === "accountHead" ||
                        activeRole === "admin") && (
                        <Accordion
                            expanded={expanded === "accounts"}
                            onChange={handleAccordionToggle("accounts")}
                        >
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                sx={{
                                    backgroundColor: "transparent",
                                    color: "#fff",
                                }}
                            >
                                <Typography variant="subtitle1">
                                    Accounts
                                </Typography>
                            </AccordionSummary>
                            <CSSTransition
                                in={expanded === "accounts"}
                                timeout={300}
                                classNames={{
                                    enter: "accordion-enter",
                                    enterActive: "accordion-enter-active",
                                    exit: "accordion-exit",
                                    exitActive: "accordion-exit-active",
                                }}
                                unmountOnExit
                            >
                                <AccordionDetails
                                    sx={{
                                        backgroundColor: "transparent",
                                        padding: 0,
                                    }}
                                >
                                    <List>
                                        {(activeRole === "accountExecutive" ||
                                            activeRole === "admin") && (
                                            <>
                                                <ListItem
                                                    component={Link}
                                                    to="/pending-verification"
                                                    sx={{
                                                        color: "#fff",
                                                        textDecoration: "none",
                                                        padding: "10px 15px",
                                                    }}
                                                >
                                                    <ListItemText
                                                        primary="Pending Verification"
                                                        sx={{ color: "#fff" }}
                                                    />
                                                </ListItem>
                                            </>
                                        )}
                                        {[
                                            {
                                                text: "Closed Leads",
                                                link: "/closed-leads",
                                            },
                                        ].map((item, index) => (
                                            <ListItem
                                                key={index}
                                                component={Link}
                                                to={item.link}
                                                sx={{
                                                    color: "#fff",
                                                    textDecoration: "none",
                                                    padding: "10px 15px",
                                                }}
                                            >
                                                <ListItemText
                                                    primary={item.text}
                                                    sx={{ color: "#fff" }}
                                                />
                                            </ListItem>
                                        ))}
                                    </List>
                                </AccordionDetails>
                            </CSSTransition>
                        </Accordion>
                    )}
                </List>
            </Box>

            <IconButton
                sx={{
                    position: "fixed",
                    top: 13,
                    left: isSidebarOpen ? 220 : 10,
                    color: "#fff",
                    borderRadius: 1,
                    transition: "background-color 0.3s, color 0.3s, left 0.3s",
                    zIndex: 1001,
                }}
                onClick={toggleSidebar}
            >
                <FaBars />
            </IconButton>

            <style jsx>{`
                .accordion-enter {
                    opacity: 0;
                    transform: translateY(-10px);
                }

                .accordion-enter-active {
                    opacity: 1;
                    transform: translateY(0);
                    transition: opacity 300ms, transform 300ms;
                }

                .accordion-exit {
                    opacity: 1;
                    transform: translateY(0);
                }

                .accordion-exit-active {
                    opacity: 0;
                    transform: translateY(-10px);
                    transition: opacity 300ms, transform 300ms;
                }
            `}</style>
        </Box>
    );
};

export default Sidebar;
