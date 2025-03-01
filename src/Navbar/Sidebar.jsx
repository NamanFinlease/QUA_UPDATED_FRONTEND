import React, { useState, useEffect } from "react";
import { tokens } from "../theme";
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
  Tooltip,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { NavLink, Link } from "react-router-dom";
import useAuthStore from "../Component/store/authStore";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
// import { KeyboardDoubleArrowLeftIcon, KeyboardDoubleArrowRightIcon, RecordVoiceOverRoundedIcon, WebAssetRoundedIcon, GavelRoundedIcon, PublicRoundedIcon, RuleFolderRoundedIcon, CollectionsBookmarkRoundedIcon, ManageAccountsRoundedIcon, FolderSpecialRoundedIcon } from '@mui/icons-material';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import RecordVoiceOverRoundedIcon from '@mui/icons-material/RecordVoiceOverRounded';
import WebAssetRoundedIcon from '@mui/icons-material/WebAssetRounded';
import GavelRoundedIcon from '@mui/icons-material/GavelRounded';
import PublicRoundedIcon from '@mui/icons-material/PublicRounded';
import RuleFolderRoundedIcon from '@mui/icons-material/RuleFolderRounded';
import CollectionsBookmarkRoundedIcon from '@mui/icons-material/CollectionsBookmarkRounded';
import ManageAccountsRoundedIcon from '@mui/icons-material/ManageAccountsRounded';
import FolderSpecialRoundedIcon from '@mui/icons-material/FolderSpecialRounded';
import TapAndPlayIcon from '@mui/icons-material/TapAndPlay';

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
const { empInfo, activeRole } = useAuthStore();

// Define accordion items based on active role
const accordionItems = [
  {
    id: "lead",
    title: "Lead",
    icon: <RecordVoiceOverRoundedIcon/>,
    items: [
      { text: "New Lead", link: "/lead-new" },
      { text: "Leads-Inprocess", link: "/lead-process" },
      { text: "Hold Lead", link: "/lead-hold" },
      { text: "Rejected Lead", link: "/rejected-leads" },
    ],
    roles: ["screener", "admin", "sanctionHead"],
  },
  {
    id: "partialLead",
    title: "Partial Lead",
    icon: <TapAndPlayIcon/>,
    items: [
      { text: "New Partial Lead", link: "/new-partialLeads" },
      { text: "Allocated Leads", link: "/partialAllocatedLeads" },
      { text: "Completed", link: "/partial-completedLeads" },
      { text: "Rejected Partial Lead", link: "/partial-rejectedLeads" },
    ],
    roles: ["screener","sanctionHead", "admin"],
  },
  {
    id: "application",
    title: "Application",
    icon: <WebAssetRoundedIcon/>,
    items: [
      { text: "New", link: "/new-applications" },
      { text: "Inprocess", link: "/application-process" },
    ],
    roles: ["creditManager", "sanctionHead", "admin"],
  },
  {
    id: "globalApplication",
    title: "Global Application",
    icon: <PublicRoundedIcon/>,
    items: [
      { text: "E-Sign Pending", link: "/eSign-pending" },
      { text: "Hold", link: "/application-hold" },
      { text: "Rejected Applications", link: "/rejected-applications" },
    ],
    roles: ["creditManager", "sanctionHead", "admin"],
  },
  {
    id: "sanction",
    title: "Sanction",
    icon: <GavelRoundedIcon/>,
    items: [
      { text: "Pending Sanctions", link: "/pending-sanctions" },
      { text: "Sanctioned", link: "/sanctioned" },
    ],
    roles: ["sanctionHead", "admin"],
  },
  {
    id: "disbursal",
    title: "Disbursal",
    icon: <RuleFolderRoundedIcon/>,
    items: [
      { text: "New", link: "/disbursal-new" },
      { text: "Disbursals In Process", link: "/disbursal-process" },
      { text: "Hold", link: "/disbursal-hold" },
      { text: "Rejected", link: "/rejected-disbursals" },
      ...(["disbursalHead","admin"].includes(activeRole) ?[{ text: "Pending Disbursals", link: "/disbursal-pending" },
      { text: "Disbursed", link: "/disbursed" }]:[])
    ],
    roles: ["disbursalManager", "disbursalHead", "admin"],
  },
  {
    id: "preCollection",
    title: "Pre-Collection",
    icon: <FolderSpecialRoundedIcon/>,
    items: [
      { text: "Active Leads", link: "/preCollectionActiveLeads" },
      { text: "Allocated Leads", link: "/allocatedPreCollectionLeads" },
      { text: "Verification Pending", link: "/pending-verification" },
      { text: "Closed Leads", link: "/closed-leads" },
    ],
    roles: ["collectionExecutive", "collectionHead", "admin"],
  },
  {
    id: "collection",
    title: "Collection",
    icon: <CollectionsBookmarkRoundedIcon/>,
    items: [
      { text: "Active Leads", link: "/activeLeads" },
      { text: "Allocated Leads", link: "/allocatedCollectionLeads" },
      { text: "Verification Pending", link: "/pending-verification" },
      { text: "Closed Leads", link: "/closed-leads" },
    ],
    roles: ["collectionExecutive", "collectionHead", "admin"],
  },
  {
    id: "accounts",
    title: "Accounts",
    icon: <ManageAccountsRoundedIcon/>,
    items: [
      { text: "Pending Verification", link: "/pending-verification" },
      { text: "Closed Leads", link: "/closed-leads" },
    ],
    roles: ["accountExecutive", "accountHead", "admin"],
  },
];

// Color theme
const theme = useTheme();
const colors = tokens(theme.palette.mode);

// Media Queries for responsive design
const isDesktop = useMediaQuery('(max-width:1024px)');
const isTablet = useMediaQuery('(max-width:768px)');
const isMobile = useMediaQuery('(max-width:450px)');

// Find the first accordion item that matches the active role
const firstAccordionForRole = accordionItems.find((item) =>
  item.roles.includes(activeRole)
);

// State to control the expanded accordions
const [expanded, setExpanded] = useState(firstAccordionForRole);

// Automatically close sidebar on mobile devices
useEffect(() => {
  if (isMobile) {
    setIsSidebarOpen(false); // Start closed on mobile
  }
}, [isMobile, setIsSidebarOpen]);

const toggleSidebar = () => {
  setIsSidebarOpen(!isSidebarOpen);
};

// Function to handle accordion toggle
const handleAccordionToggle = (panel) => (event, isExpanded) => {
  setExpanded(isExpanded ? panel : false);
};

  return (
    <>
    <div sx={{background: colors.white[100]}}>
      {/* Backdrop for mobile */}
      {isMobile && isSidebarOpen && (
        <Box
          onClick={() => setIsSidebarOpen(false)}
          sx={{
            position: "fixed",
            // top: 40,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            zIndex: 1000,
          }}
        />
      )}
        <Box
            sx={{
                width: isSidebarOpen ? 265 : 0 ,
                height: "100%",
                color: colors.white[100],
                position: "fixed",
                // top: 70,
                // left: 0,
                transition: "width 0.3s ease",
                overflowY: "auto",
                boxShadow: isSidebarOpen
                    ? `0px 10px 10px ${colors.primary[400]}`
                    : "none",
                zIndex: 1001,
                background: `linear-gradient(90deg, ${colors.white[100]}  1%, ${colors.primary[400]} 250%), ${colors.white[100]}`,
                borderRadius : "0px 15px",
                borderRight: `3px solid ${colors.primary[400]}`,
                "& .css-oztf1a-MuiPaper-root-MuiAccordion-root:first-of-type":{
                    borderTopRightRadius:"20px !important",
                },
                "& .css-oztf1a-MuiPaper-root-MuiAccordion-root:last-of-type":{
                    borderBottomRightRadius:"15px !important",
                },
        }}
        >
        <IconButton
          onClick={toggleSidebar}
          sx={{
            position: "fixed",
            top: isMobile ? "100px" : "50%",
            left: isSidebarOpen ? 245 : 10,
            transform: "translateY(-50%)",
            color: colors.black[100],
            background: colors.white[100],
            border: `3px solid ${colors.primary[400]}`,
            borderRadius: "15px",
            transition: "background-color 0.3s, color 0.3s, left 0.3s",
            zIndex: 1002,
            ":hover": {
              background: colors.primary[400],
            },
          }}
        >
            {isSidebarOpen ? <KeyboardDoubleArrowLeftIcon /> : <KeyboardDoubleArrowRightIcon />}
        </IconButton>

            <List>
            {accordionItems.map((item) => {
                if (item.roles.includes(activeRole)) {
                return (
                    <Accordion
                    key={item.id}
                    expanded={expanded === item.id}
                    onChange={handleAccordionToggle(item.id)}
                    disableGutters
                    elevation={0}
                    sx={{
                        margin:"5px 20px",
                        color: colors.white[100],
                        background:colors.white[100],
                        borderRadius:"20px",
                    }}
                    >
                    <AccordionSummary 
                        expandIcon={<ExpandMoreIcon />}
                        sx={{
                            background: colors.primary[400],
                            borderRadius:"0px 20px",
                            boxShadow:`0px 0px 20px ${colors.primary[400]}`,
                            "&:hover": {
                                background:colors.white[100],
                                color:colors.primary[400],
                                transform:"scale(1.02)",
                            }
                        }}
                    >
                        <Box sx={{display:"flex", alignItems:"center"}}>
                        {item.icon}
                        <Typography sx={{marginLeft:"10px"}}>{item.title}</Typography>
                        </Box>
                    </AccordionSummary>
                    <AccordionDetails
                        sx={{
                            boxShadow:`0px 0px 10px 1px ${colors.primary[400]}`,
                            borderRadius:"15px 0px 15px 15px",
                        }}>
                        <List>
                        {item.items.map((subItem) => (
                            <ListItem button 
                                component={NavLink} 
                                to={subItem.link} 
                                key={subItem.text}
                                sx={{
                                    color: colors.primary[400],
                                    textDecoration: "none",
                                    padding: "10px 15px",
                                    borderTopRightRadius:"10px",
                                    borderBottomLeftRadius:"10px",
                                    border:`2px solid ${colors.white[100]}`,
                                    "&.active":{
                                        background:`linear-gradient(90deg, ${colors.white[400]} 50%, ${colors.primary[400]} 250%)`,
                                        fontWeight: "bold",
                                        border:`2px solid ${colors.primary[400]}`,  
                                        "&::after":{
                                            content : '""',
                                            position : "absolute",
                                            right:"20px",
                                            top:"20px",
                                            width:"10px",
                                            height:"10px",
                                            borderRadius:"50%",
                                            background: colors.primary[400],
                                            animation:"blink 1s infinite",
                                        },
                                    },
                                    "&:hover": {
                                        border:`2px solid ${colors.primary[400]}`,
                                        color: colors.white[100],
                                    },
                                    '@keyframes blink':{
                                        "0%":{background:colors.white[100]},
                                        "100%":{background:colors.primary[400]},
                                    }
                                }}
                            >
                            <ListItemText sx={{color:colors.primary[400],}} primary={subItem.text} />
                            </ListItem>
                        ))}
                        </List>
                    </AccordionDetails>
                    </Accordion>
                );
                }
                return null;
            })}
            </List>
        </Box>
      </div>
    </>
  );
};

export default Sidebar