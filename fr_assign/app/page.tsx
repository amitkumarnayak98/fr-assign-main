"use client"; // <--- CRITICAL: This allows interactivity (onClick, useState)
import Image from "next/image";
import { useState } from "react";
import logoImage from "../public/codenam_logo.png";
import "./page.css";
import { alpha, styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import { RichTreeView } from "@mui/x-tree-view/RichTreeView";
import { TreeViewBaseItem } from "@mui/x-tree-view/models";
import Typography from "@mui/material/Typography";
import { common } from "@mui/material/colors";
// import { useTreeItemState } from "@mui/x-tree-view/TreeItem";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import AddIcon from "@mui/icons-material/AddCircleOutline";
// import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { SimpleTreeView } from "@mui/x-tree-view/SimpleTreeView";
import { TreeItem, treeItemClasses } from "@mui/x-tree-view/TreeItem";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import ControlPointOutlinedIcon from "@mui/icons-material/ControlPointOutlined";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import DownloadForOfflineOutlined from "@mui/icons-material/DownloadForOfflineOutlined";
import Avatar from "@mui/material/Avatar";
import TuneIcon from "@mui/icons-material/Tune";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import UploadOutlined from "@mui/icons-material/UploadOutlined";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch, { SwitchProps } from "@mui/material/Switch";
import Menu from "@mui/icons-material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";
import KeyboardDoubleArrowUpIcon from "@mui/icons-material/KeyboardDoubleArrowUp";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import Fab from "@mui/material/Fab";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  LabelList,
  LabelProps,
  ResponsiveContainer,
} from "recharts";
import FormatAlignLeftSharpIcon from "@mui/icons-material/FormatAlignLeftSharp";

import picImage from "../public/avatar.png";
type SidebarItem = {
  id?: string;
  label?: string;
  badge?: number | string; // For the red notification count
  highlight?: boolean; // For the red text (e.g., "New report")
  // isRoot?: boolean; // 👈 ADD THIS
  rootLevel?: 1 | 2; // 👈 ADD THIS
  children?: SidebarItem[];
};

// // --- Types & Data ---
// type SidebarItem = TreeViewBaseItem & {
//   badge?: number | string;
//   highlight?: boolean;
// };

const SIDEBAR_DATA: SidebarItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    rootLevel: 1,
    children: [
      { id: "codename", label: "Codename" },
      {
        id: "shared",
        label: "Shared with me",
        rootLevel: 2, // 👈 NEW ROOT STARTS HERE
        children: [
          { id: "cargo", label: "Cargo2go" },
          { id: "cloudzer", label: "Cloudz3r", badge: 2 }, // Notification Badge
          { id: "idioma", label: "Idioma" },
          { id: "syllables", label: "Syllables" },
          { id: "x0b", label: "x-0b" },
        ],
      },
    ],
  },
  {
    id: "reports",
    label: "Reports",
    rootLevel: 1,
    children: [
      {
        id: "share-reports",
        label: "Share with me",
        rootLevel: 2, // 👈 NEW ROOT STARTS HERE
        children: [
          { id: "deals-user", label: "Deals by user" },
          { id: "deal-duration", label: "Deal duration" },
        ],
      },
      {
        id: "my-reports",
        label: "My reports",
        rootLevel: 2, // 👈 NEW ROOT STARTS HERE
        children: [
          { id: "emails", label: "Emails received" },
          { id: "rep-duration", label: "Deal duration" },
          { id: "new-report", label: "New report", highlight: true }, // Highlight Red
          { id: "analytics", label: "Analytics", badge: 7 }, // Notification Badge
        ],
      },
    ],
  },
];

const IOSSwitch = styled((props: SwitchProps) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 38,
  height: 20,
  padding: 0,
  "& .MuiSwitch-switchBase": {
    padding: 0,
    margin: 1,
    transitionDuration: "300ms",
    "&.Mui-checked": {
      transform: "translateX(16px)",
      color: "#fff",
      "& + .MuiSwitch-track": {
        backgroundColor: "black",
        opacity: 1,
        border: 0,
        ...theme.applyStyles("dark", {
          backgroundColor: "black",
        }),
      },
      "&.Mui-disabled + .MuiSwitch-track": {
        opacity: 0.5,
      },
    },
    "&.Mui-focusVisible .MuiSwitch-thumb": {
      color: "#33cf4d",
      border: "6px solid #fff",
    },
    "&.Mui-disabled .MuiSwitch-thumb": {
      color: theme.palette.grey[100],
      ...theme.applyStyles("dark", {
        color: theme.palette.grey[600],
      }),
    },
    "&.Mui-disabled + .MuiSwitch-track": {
      opacity: 0.7,
      ...theme.applyStyles("dark", {
        opacity: 0.3,
      }),
    },
  },
  "& .MuiSwitch-thumb": {
    boxSizing: "border-box",
    width: 19,
    height: 19,
  },
  "& .MuiSwitch-track": {
    borderRadius: 26 / 2,
    backgroundColor: "#E9E9EA",
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 500,
    }),
    ...theme.applyStyles("dark", {
      backgroundColor: "#39393D",
    }),
  },
}));

// Helper to find item data for rendering badges
const findItem = (
  items: SidebarItem[],
  id: string
): SidebarItem | undefined => {
  for (const item of items) {
    if (item.id === id) return item;
    if (item.children) {
      const found = findItem(item.children, id);
      if (found) return found;
    }
  }
  return undefined;
};

// --- 3. Custom Label Component ---
// This renders the text and the badge/color logic
function CustomLabel({ children, className, ...other }: any) {
  // We need to access the item's data to check for 'badge' or 'highlight'
  // But standard Label slot props are limited.
  // A simple hack in RichTreeView is to parse the label or pass data differently,
  // but here we will render the props passed down if we use the slot correctly.

  // NOTE: In the current version of RichTreeView, passing custom props to the Label slot
  // is tricky without a custom TreeItem.
  // Below is the layout logic:
  return (
    <div
      className={className}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
      }}
    >
      <Typography variant="body2">{children}</Typography>
      {/* Note: complex rendering usually requires a custom TreeItem, 
           see the full component below for the 'slot' strategy */}
    </div>
  );
}

// --- Icons (Simple SVG components to avoid dependencies) ---
const StarIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
  </svg>
);
const ClockIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);
const PlusIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);
const ChevronDown = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);
const ChevronUp = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="18 15 12 9 6 15"></polyline>
  </svg>
);
const FolderIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
  </svg>
);

export default function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const [isOpenMenuItem, setIsOpenMenuItem] = useState(false);
  const [graphFilterIcon, setGraphFilterIcon] = useState(false);
  const handleMenuClick = () => {
    console.log("Hamburger menu clicked! Toggle sidebar here.");
  };

  const handleProfileClick = () => {
    console.log("Profile icon clicked! Toggle dropdown menu here.");
  };

  // 1. State to track if the icon is active (clicked) or not
  const [isActive, setIsActive] = useState(false);

  // 2. Function to handle the toggle
  const handleClick = () => {
    setIsActive(!isActive);
  };
  const handleClickChips = () => {
    console.info("You clicked the Chip.");
  };

  // 3. Define colors based on state
  const circleFill = isActive ? "red" : "white";
  const circleStroke = "white"; // Always black border so it's visible when white
  const plusColor = isActive ? "white" : "black";

  const [selectedIcon, setSelectedIcon] = useState("analytics");

  // 2. Helper function to determine styles dynamically
  const getIconStyle = (iconId: any) => {
    const isSelected = selectedIcon === iconId;
    return {
      cursor: "pointer",
      borderRadius: "50%", // Makes the container a circle
      padding: "4px", // Spacing between SVG and circle border
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "all 0.3s ease",
      // Conditional colors based on selection state
      backgroundColor: isSelected ? "#E93D5A" : "white",
      // 'currentColor' in the SVG will inherit this color value:
      color: isSelected ? "white" : "black",
    };
  };

  const UploadIcon = FileUploadIcon;

  // The sx prop is used to apply custom styles to make it square
  const squareStyles = {
    width: 48, // Adjust size as needed
    height: 48, // Must be equal to width for a perfect square
    minWidth: 0, // Ensures no extra padding/width from default button styles
    padding: 0, // Optional: remove default padding if you want the icon to fill the space
  };

  // --- THE FIX: Custom Styled Tree Item ---
  const CustomTreeItem = styled(TreeItem)(({ theme }: any) => ({
    position: "relative",

    // 2. The Horizontal Connector Line
    [`& .${treeItemClasses.content}`]: {
      flexDirection: "row-reverse", // Icons on right
      padding: theme.spacing(0.5, 0.5, 0.5, 0), // Adjust padding
      borderRadius: "4px",
      marginBottom: "2px",
      position: "relative",
      overflow: "visible !important", // CRITICAL
      zIndex: 1, // Keep content above lines

      // The Line Pseudo-element
      "&::before": {
        content: '""',
        position: "absolute",
        display: "block",
        left: -19, // Reaches out to the vertical line
        top: "50%",
        width: 19,
        height: 1,
        borderTop: `1px dashed #c7c7c7`, // Horizontal Line
        marginLeft: 20,
      },
    },

    [`&[data-root-level="1"]`]: {
      [`& > .${treeItemClasses.content}::before`]: {
        display: "none",
        borderTop: "1px dashed rgba(0, 0, 0, 0.4)",
      },
      [`& > .${treeItemClasses.group}`]: {
        borderLeft: "none",
        marginLeft: 0,
        paddingLeft: 0,
      },
      "& .MuiCollapse-root": {
        borderLeft: "1px dashed rgba(0, 0, 0, 0.4)",
        marginLeft: 15,
      },
      "& .MuiTreeItem-label": {
        marginLeft: 11,
      },
    },
    // // Break vertical line BEFORE level-2 root
    [`&[data-root-level="2"]`]: {
      [`& > .${treeItemClasses.content}::before`]: {
        display: "none",
      },
      [`& > .${treeItemClasses.group}`]: {
        borderLeft: "none",
        marginLeft: 0,
        paddingLeft: 0,
      },
      "& .MuiCollapse-root": {
        borderLeft: "1px dashed rgba(0, 0, 0, 0.4)",
        marginLeft: 15,
      },
      "& .MuiTreeItem-label": {
        marginLeft: 15,
      },
      [`&[aria-level="1"] .${treeItemClasses.label}`]: {
        marginLeft: 0,
      },
    },
    [`&[aria-level="1"]`]: {
      [`& > .${treeItemClasses.content}::before`]: {
        display: "none",
      },

      // Remove the 15px margin for root label
      [`& > .${treeItemClasses.content} .${treeItemClasses.label}`]: {
        marginLeft: 0,
      },
    },
  }));

  const renderTree = (nodes: SidebarItem[]) =>
    nodes.map((node) => (
      <CustomTreeItem
        key={node.id}
        itemId={node.id}
        data-root-level={node.rootLevel ?? 0} // 👈 ADD THIS
        label={
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              py: 0.5,
            }}
          >
            <Typography
              variant="body2"
              sx={{
                fontSize: "14px",
                color: node.highlight ? "#e93d5a" : "#333",
                fontWeight: node.highlight ? 600 : 400,
                fontFamily: "inherit",
              }}
            >
              {node.label}
            </Typography>

            {node.badge && (
              <Box
                sx={{
                  bgcolor: "#e93d5a",
                  color: "white",
                  borderRadius: "10px",
                  fontSize: "11px",
                  fontWeight: "bold",
                  px: 0.8,
                  minWidth: "20px",
                  textAlign: "center",
                  height: "18px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {node.badge}
              </Box>
            )}
          </Box>
        }
      >
        {Array.isArray(node.children) ? renderTree(node.children) : null}
      </CustomTreeItem>
    ));

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClickMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const data = [
    {
      value: 120,
      logo: "/behance.png",
      striped: false,
    },
    {
      value: 160,
      logo: "/icon.png",
      striped: false,
    },
    {
      value: 90,
      logo: "/google.png",
      striped: false,
    },
    {
      value: 60,
      logo: "/instagram.png",
      striped: false,
    },
    {
      value: 80,
      logo: "/shopclues.png",
      striped: true,
    },
  ];

  // ============== CUSTOM BAR ==============
  const CustomBar = ({ x, y, width, height, payload }: any) => {
    const isStriped = payload.striped; // true / false
    return (
      <g>
        {/* Bar background */}
        <defs>
          <pattern
            id={`stripes-${payload.logo}`}
            patternUnits="userSpaceOnUse"
            width="8"
            height="8"
            patternTransform="rotate(45)"
          >
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="8"
              stroke="#e5e7eb"
              strokeWidth="5"
            />
          </pattern>
        </defs>

        <rect
          x={x}
          y={y}
          width={width}
          height={height}
          rx={10}
          fill="#ffffff"
          stroke="#e5e7eb"
        />

        {isStriped && (
          <rect
            x={x}
            y={y}
            width={width}
            height={height}
            rx={10}
            fill={`url(#stripes-${payload.logo})`}
          />
        )}

        {/* Logo inside bar */}
        <image
          href={payload.logo}
          x={x + width / 2 - 14}
          y={y + 10}
          width={28}
          height={28}
          preserveAspectRatio="xMidYMid meet"
        />
      </g>
    );
  };

  const BarChartWithMinHeight = () => {
    return (
      <div
        style={{
          width: "100%",
          height: 240,
          background: "#f6f6f6",
          borderRadius: 16,
          padding: 16,
        }}
      >
        <div
          style={{
            fontSize: 14,
            fontWeight: 600,
            marginBottom: 0,
            color: "#111",
          }}
        >
          <div
            className="app_header_title flex align-center"
            onClick={() => setGraphFilterIcon(!graphFilterIcon)}
          >
            <span>
              <FormatAlignLeftSharpIcon />
            </span>

            <svg
              style={{
                transform: graphFilterIcon ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.4s ease",
              }}
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>
          {/* Deals amount{" "}
          <span style={{ fontWeight: 400 }}>by referrer category</span> */}
        </div>

        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            barCategoryGap={0}
            barGap={0}
            margin={{ top: 10, right: 20, left: 20, bottom: 10 }}
          >
            {/* AXES HIDDEN */}
            <XAxis hide />
            <YAxis hide />

            <Bar dataKey="value" shape={<CustomBar />} barSize={46} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };

  return (
    <div className="app">
      <div className="app_header">
        <div className="app_header-logo">
          <Image
            src={logoImage}
            alt="Logo"
            width={40}
            height={40}
            className="db-logo"
          />
        </div>

        <div className="app_header_dropdown_container">
          <div
            className="app_header_title flex align-center"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span>Codename.com</span>

            <svg
              style={{
                transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.4s ease",
              }}
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>

          {isOpen && (
            <ul className="dropdown_menu">
              <li>Codename.com</li>
            </ul>
          )}
        </div>
        <div className="flex space-between details-container">
          <div className="search-bar flex align-center">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ color: "#8D8D99", margin: "0px 0px 0px 9px" }}
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input placeholder={`Try searching "insights"`} />
          </div>
          <div
            className="flex align-center"
            style={{ gap: "15px", width: "10%" }}
          >
            <div className="top-bar-container flex space-btween align-center">
              {/* --- LEFT SIDE: HAMBURGER ICON --- */}
              <button
                className="icon-button"
                onClick={handleMenuClick}
                aria-label="Open Menu"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ margin: "0px 0px 0px 6px" }}
                >
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
              </button>

              {/* --- RIGHT SIDE: PROFILE ICON --- */}
              <button
                className="icon-button profile-trigger"
                onClick={handleProfileClick}
                aria-label="Open Profile Menu"
              >
                {/* OPTION 1: Standard User SVG Icon */}
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="white"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ margin: "0px 11px 0px 0px" }}
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </button>
            </div>
            <div
              onClick={handleClick}
              style={{ cursor: "pointer", display: "inline-block" }}
            >
              <svg
                width="33"
                height="33"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ transition: "all 0.3s ease" }} // Smooth transition animation
              >
                {/* Circle Background */}
                <circle
                  cx="12"
                  cy="12"
                  r="11.5"
                  fill={circleFill}
                  stroke={circleStroke}
                  strokeWidth="1"
                  style={{ transition: "fill 0.3s ease" }}
                />

                {/* Plus Sign */}
                <path
                  d="M12 7V17M7 12H17"
                  stroke={plusColor}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ transition: "stroke 0.3s ease" }}
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="app_body flex">
        <div
          className="app_body-icons flex flex-column space-between align-center"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            alignItems: "center",
          }}
        >
          <div className="event-icons flex flex-column">
            {/* --- Icon 1: Data Analytics --- */}
            <div
              style={getIconStyle("analytics")}
              onClick={() => setSelectedIcon("analytics")}
            >
              <svg
                width="33"
                height="33"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Note: changed stroke to currentColor */}
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M7 13L10 10L14 14L17 9"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Note: changed fill to currentColor */}
                <circle cx="7" cy="13" r="1.5" fill="currentColor" />
                <circle cx="10" cy="10" r="1.5" fill="currentColor" />
                <circle cx="14" cy="14" r="1.5" fill="currentColor" />
                <circle cx="17" cy="9" r="1.5" fill="currentColor" />
              </svg>
            </div>

            {/* --- Icon 2: Account Tree (New Created SVG) --- */}
            <div
              style={getIconStyle("tree")}
              onClick={() => setSelectedIcon("tree")}
            >
              <svg
                width="33"
                height="33"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Note: Using currentColor for strokes so it changes to white on selection */}
                <path
                  d="M2 12H6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <path
                  d="M6 8V16"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <path
                  d="M6 8H10"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <path
                  d="M6 16H10"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <rect
                  x="10"
                  y="5"
                  width="10"
                  height="6"
                  rx="1"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <rect
                  x="10"
                  y="13"
                  width="10"
                  height="6"
                  rx="1"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
            </div>
            <div
              style={getIconStyle("document")}
              onClick={() => setSelectedIcon("document")}
            >
              <svg
                width="33"
                height="33"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M14 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V8L14 2Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M14 2V8H20"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8 13H16"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8 17H16"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8 9H10"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* --- Icon 4: Command / System --- */}
            {/* --- Icon 4: Command / System (Fixed Redraw) --- */}
            <div
              style={getIconStyle("command")}
              onClick={() => setSelectedIcon("command")}
            >
              <svg
                width="33"
                height="33"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Cleaner Command Icon Path */}
                <path
                  d="M7.5 19C5.567 19 4 17.433 4 15.5C4 13.567 5.567 12 7.5 12H9V15H7.5V19ZM16.5 19C18.433 19 20 17.433 20 15.5C20 13.567 18.433 12 16.5 12H15V15H16.5V19ZM7.5 5C5.567 5 4 6.567 4 8.5C4 10.433 5.567 12 7.5 12H9V8.5H7.5V5ZM16.5 5C18.433 5 20 6.567 20 8.5C20 10.433 18.433 12 16.5 12H15V8.5H16.5V5Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Center Cross Lines */}
                <path
                  d="M9 12V9H15V12M9 12V15H15V12"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* --- Icon 5: Layers / App Switcher (Fixed Hatching Direction) --- */}
            <div
              style={getIconStyle("layers")}
              onClick={() => setSelectedIcon("layers")}
            >
              <svg
                width="33"
                height="33"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Back Square (Top-Left) with Hatching */}
                <g>
                  <rect
                    x="2.75"
                    y="2.75"
                    width="12.5"
                    height="12.5"
                    rx="3"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  {/* Diagonal Lines (Corrected Direction / ) */}
                  <path
                    d="M6 3L3 6"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M10 3L3 10"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M14 3L3 14"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M15.25 5.75L5.75 15.25"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </g>

                {/* Front Square (Bottom-Right) - Overlapping */}
                {/* The fill color dynamically changes to hide the lines behind it */}
                <rect
                  x="8.75"
                  y="8.75"
                  width="12.5"
                  height="12.5"
                  rx="3"
                  fill={selectedIcon === "layers" ? "#E93D5A" : "white"}
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
              </svg>
            </div>
          </div>
          <div className="settings-icons flex flex-column content-end">
            <div
              style={getIconStyle("chat")}
              onClick={() => setSelectedIcon("chat")}
            >
              <svg
                width="33"
                height="33"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 13.5997 2.37562 15.1116 3.04346 16.4525C3.22094 16.8088 3.28001 17.2161 3.17712 17.6006L2.58151 19.8267C2.32295 20.793 3.20701 21.677 4.17335 21.4185L6.39939 20.8229C6.78393 20.72 7.19121 20.7791 7.54753 20.9565C8.88837 21.6244 10.4003 22 12 22Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8 10.5C8 11.3284 8.67157 12 9.5 12C10.3284 12 11 11.3284 11 10.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M13 10.5C13 11.3284 13.6716 12 14.5 12C15.3284 12 16 11.3284 16 10.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M9 15C9 15 10 16.5 12 16.5C14 16.5 15 15 15 15"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div
              style={getIconStyle("settings")}
              onClick={() => setSelectedIcon("settings")}
            >
              <svg
                width="33"
                height="33"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Center Circle */}
                <circle
                  cx="12"
                  cy="12"
                  r="3"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {/* Gear Teeth */}
                <path
                  d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>
        <div className="app_body-hierarchy">
          <div className="sidebar">
            <Box
              sx={{
                width: "inherit",
                // minHeight: "100vh",
                bgcolor: "transparent",
                p: 2,
                display: "flex",
                flexDirection: "column",
                fontFamily: "sans-serif",
              }}
            >
              {/* Top Section */}
              <Box
                sx={{
                  mb: 2,
                  display: "flex",
                  flexDirection: "column",
                  gap: 1.5,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    color: "#555",
                    cursor: "pointer",
                  }}
                >
                  <StarBorderIcon fontSize="small" />
                  <Typography variant="body2" fontWeight={500}>
                    Starred
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    color: "#555",
                    cursor: "pointer",
                  }}
                >
                  <AccessTimeIcon fontSize="small" />
                  <Typography variant="body2" fontWeight={500}>
                    Recent
                  </Typography>
                </Box>
              </Box>

              {/* Headers */}
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: "bold", mb: 1, color: "#333" }}
              >
                Sales list
              </Typography>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: "bold", mb: 1, color: "#333" }}
              >
                Goals
              </Typography>

              {/* --- Tree View with Dotted Lines CSS --- */}
              <Box sx={{ flexGrow: 1 }}>
                <SimpleTreeView
                  defaultExpandedItems={[
                    "dashboard",
                    "shared",
                    "reports",
                    "my-reports",
                  ]}
                  slots={{
                    expandIcon: AddIcon,
                    collapseIcon: KeyboardArrowUpIcon,
                  }}
                  sx={{
                    // 1. Basic Item Styling
                    "& .MuiTreeItem-root": {
                      position: "relative",
                      overflow: "visible !important", // Keeps lines visible
                    },

                    // 2. Row Content (Right-aligned Icons)
                    "& .MuiTreeItem-content": {
                      flexDirection: "row-reverse",
                      borderRadius: "4px",
                      padding: "0px 0px",
                      marginBottom: "2px",
                      position: "relative",
                      zIndex: 1,
                      overflow: "visible !important",
                    },

                    // 3. Label container
                    "& .MuiTreeItem-label": {
                      width: "100%",
                      paddingLeft: "8px",
                    },
                    "& .MuiTreeItem-iconContainer": {
                      color: "#888",
                      marginRight: 0,
                    },

                    // --- 4. Vertical Dotted Line ---
                    "& .MuiTreeItem-group": {
                      marginLeft: "15px !important",
                      paddingLeft: "18px !important",
                      borderLeft: "1px solid #c7c7c7", // DEBUG: If you see this, the selector works
                    },

                    // --- 5. Horizontal Dotted Line ---
                    "& .MuiTreeItem-group .MuiTreeItem-content::before": {
                      content: '""',
                      position: "absolute",
                      display: "block",
                      left: "-19px", // Matches padding + border
                      top: "50%",
                      width: "18px",
                      height: "1px",
                      borderTop: "1px dashed #c7c7c7",
                    },
                  }}
                >
                  {renderTree(SIDEBAR_DATA)}
                </SimpleTreeView>
              </Box>

              {/* Footer */}
              <Box
                sx={{
                  pt: 2,
                  mt: "auto",
                  borderTop: "1px solid #e0e0e0",
                  display: "flex",
                  gap: 1,
                  color: "#666",
                  cursor: "pointer",
                }}
              >
                <FolderOpenIcon fontSize="small" />
                <Typography variant="body2" fontWeight={500}>
                  Manage folders
                </Typography>
              </Box>
            </Box>
          </div>
        </div>
        <div className="app_body-details">
          <div className="body-container flex align-center space-between">
            <div className="chips-container flex align-center">
              <span
                style={{ paddingLeft: 30 }}
                onClick={() => setSelectedIcon("addplus_icon")}
              >
                <ControlPointOutlinedIcon fontSize="medium" />
              </span>
              <Stack direction="row" spacing={1} gap={0.7}>
                <Chip
                  avatar={<Avatar alt="Armin" src="/avatar.png" />}
                  label="Armin A"
                  variant="outlined"
                />
                <Chip
                  avatar={<Avatar alt="Eren" src="/avatar.png" />}
                  label="Eren Y"
                  variant="outlined"
                />
                <Chip
                  avatar={<Avatar alt="Mikasa" src="/avatar.png" />}
                  label="Mikasa A"
                  variant="outlined"
                />
              </Stack>
            </div>
            <div
              className="flex settings-icons align-center"
              style={{ paddingRight: 30 }}
            >
              <div
                style={getIconStyle("settings")}
                onClick={() => setSelectedIcon("settings")}
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="white"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Top Slider - Knob Right */}
                  <line
                    x1="4"
                    y1="8"
                    x2="14"
                    y2="8"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <circle
                    cx="17"
                    cy="8"
                    r="3"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />

                  {/* Bottom Slider - Knob Left */}
                  <line
                    x1="20"
                    y1="16"
                    x2="10"
                    y2="16"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <circle
                    cx="7"
                    cy="16"
                    r="3"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                </svg>
              </div>
              <span
                style={getIconStyle("download_outline")}
                onClick={() => setSelectedIcon("download_outline")}
              >
                <DownloadForOfflineOutlined fontSize="medium" />
              </span>
              <span
                style={getIconStyle("upload_outline")}
                onClick={() => setSelectedIcon("upload_outline")}
              >
                <UploadOutlined />
              </span>
            </div>
          </div>

          <div
            className="body-container flex align-center space-between"
            style={{ paddingRight: 30 }}
          >
            <Typography
              variant="h4"
              color="#80808091"
              style={{ paddingLeft: 33 }}
              fontWeight={600}
            >
              New Report
            </Typography>
            {/* <h1
              style={{
                fontSize: "xx-large",
                fontWeight: 600,
                color: "#80808091",
                paddingLeft: 33,
              }}
            >
              New Report
            </h1> */}
            <div className="flex">
              <FormGroup>
                <FormControlLabel
                  control={<IOSSwitch sx={{ m: 1 }} defaultChecked />}
                  label="Timeframe"
                  style={{ fontSize: 14 }}
                />
              </FormGroup>
              <div
                className="app_header_dropdown_container flex align-center"
                style={{
                  width: "100%!important",
                  display: "flex!important",
                  fontSize: "14px!important",
                  border: "1px solid #80808026!important",
                  background: "#80808026!important",
                  borderRadius: "25px!important",
                }}
              >
                <div
                  className="app_header_title flex align-center"
                  onClick={() => setIsOpenMenu(!isOpenMenu)}
                >
                  <span>Sep 1 - Nov 30, 2023</span>

                  <svg
                    style={{
                      transform: isOpenMenu ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.4s ease",
                    }}
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>

                {isOpenMenu && (
                  <ul className="dropdown_menu">
                    <li>Sep 1 - Nov 30, 2023</li>
                  </ul>
                )}
              </div>
              {/* <Menu
                id="fade-menu"
                slotProps={{
                  list: {
                    "aria-labelledby": "fade-button",
                  },
                }}
                slots={{ transition: Fade }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClickMenu}
              >
                <MenuItem onClick={handleCloseMenu}>Profile</MenuItem>
                <MenuItem onClick={handleCloseMenu}>My account</MenuItem>
                <MenuItem onClick={handleCloseMenu}>Logout</MenuItem>
              </Menu> */}
            </div>
          </div>

          <div
            className="body-container flex align-center space-between"
            style={{ paddingRight: 30, height: 130 }}
          >
            <span
              className="flex flex-column"
              style={{ paddingLeft: 33, gap: 7 }}
            >
              <Typography variant="h6">Revenue</Typography>
              <span className="flex settings-icons align-center">
                <Typography variant="h4" fontWeight={600}>
                  $528,976.82
                </Typography>
                <Stack direction="row" spacing={1} gap={0.7}>
                  <Chip
                    // avatar={<Avatar alt="Armin" src="../public/avatar.png" />}
                    icon={
                      <KeyboardDoubleArrowUpIcon
                        style={{ color: "white", fontSize: 14 }}
                      />
                    }
                    label="$7.9%"
                    variant="filled"
                    color="error"
                    style={{ height: 27 }}
                  />
                  <Chip
                    // avatar={<Avatar alt="Eren" src="../public/avatar.png" />}
                    label="$27,335.09"
                    variant="filled"
                    color="error"
                    style={{ height: 27 }}
                  />
                </Stack>
              </span>
              <div
                className="app_header_dropdown_container flex align-center"
                style={{
                  width: "100%!important",
                  display: "flex!important",
                  fontSize: "14px!important",

                  borderRadius: "25px!important",
                }}
              >
                <div
                  className="app_header_title flex align-center"
                  onClick={() => setIsOpenMenuItem(!isOpenMenuItem)}
                >
                  <span>vs prev.$501,641.73 Jun 1 - Aug 31,2023</span>

                  <svg
                    style={{
                      transform: isOpenMenuItem
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                      transition: "transform 0.4s ease",
                    }}
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </div>

                {isOpenMenuItem && (
                  <ul className="dropdown_menu">
                    <li>vs prev.$501,641.73 Jun 1 - Aug 31,2023</li>
                  </ul>
                )}
              </div>
            </span>
            <div
              className="cards flex"
              style={{
                paddingLeft: 19,
                width: "29%",
              }}
            >
              <div
                className="card flex flex-column"
                style={{
                  width: "47%",
                  padding: 10,
                  boxShadow:
                    "rgba(0, 0, 0, 0.2) 0px 0px 0px 0px, rgba(0, 0, 0, 0.14) 1px -10px 1.5px -4px, rgba(0, 0, 0, 0.12) 1px 11.5px 1px -5px",
                }}
              >
                <p style={{ fontSize: 14, color: "gray", fontWeight: "500" }}>
                  Top Sales
                </p>
                <p style={{ fontSize: 20, fontWeight: "bold" }}>72</p>
                <span
                  className="flex align-center space-between"
                  style={{ gap: 6 }}
                >
                  <span className="flex align-center" style={{ gap: 6 }}>
                    <Avatar
                      alt="Armin"
                      src="/avatar.png"
                      sx={{ width: 17, height: 17 }}
                    />
                    <p style={{ fontSize: 14 }}>Mikasa</p>
                  </span>
                  <ChevronRightIcon
                    sx={{ backgroundColor: "#80808021", borderRadius: 2 }}
                  />
                </span>
              </div>
              <div
                className="card flex flex-column"
                style={{
                  width: "47%",
                  backgroundColor: "#000",
                  padding: 10,
                  color: "#fff",
                  boxShadow:
                    "rgba(0, 0, 0, 0.2) 0px 0px 0px 0px, rgba(0, 0, 0, 0.14) 1px -10px 1.5px -4px, rgba(0, 0, 0, 0.12) 1px 11.5px 1px -5px",
                }}
              >
                <p style={{ fontSize: 14, color: "gray" }}>Best Deal</p>
                <p style={{ fontSize: 20, fontWeight: "bold" }}>$42,300</p>
                <span
                  className="flex align-center space-between"
                  style={{ gap: 6 }}
                >
                  <p style={{ fontSize: 14 }}>Rolf Inc.</p>
                  <ChevronRightIcon
                    sx={{
                      backgroundColor: "white",
                      color: "black",
                      borderRadius: 2,
                    }}
                  />
                </span>
              </div>
            </div>
            <div className="cards flex">
              <div
                className="card flex flex-column align-center"
                style={{
                  boxShadow:
                    "0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12);",
                }}
              >
                <p style={{ fontSize: 14 }}>Deals</p>
                <Chip
                  // avatar={<Avatar alt="Armin" src="../public/avatar.png" />}

                  label="256"
                  variant="filled"
                  color="default"
                  style={{
                    height: 27,
                    color: "white",
                    backgroundColor: "rgb(128 128 128 / 33%)",
                  }}
                />
                <p style={{ fontSize: 14 }}>
                  <KeyboardDoubleArrowDownIcon
                    style={{ color: "black", fontSize: 14 }}
                  />
                  5
                </p>
              </div>
              <div
                className="card flex flex-column align-center"
                style={{
                  boxShadow:
                    "0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12);",
                }}
              >
                <p style={{ fontSize: 14 }}>Value</p>
                <Chip
                  // avatar={<Avatar alt="Armin" src="../public/avatar.png" />}

                  label="528K"
                  variant="filled"
                  color="error"
                  style={{ height: 27 }}
                />
                <p style={{ fontSize: 14 }}>
                  <KeyboardDoubleArrowUpIcon
                    style={{ color: "black", fontSize: 14 }}
                  />
                  7.9
                </p>
              </div>
              <div
                className="card flex flex-column align-center"
                style={{
                  boxShadow:
                    "0px 2px 1px -1px rgba(0, 0, 0, 0.2), 0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12);",
                }}
              >
                <p style={{ fontSize: 14 }}>Win Rate</p>
                <Chip
                  // avatar={<Avatar alt="Armin" src="../public/avatar.png" />}

                  label="44%"
                  variant="filled"
                  color="default"
                  style={{
                    height: 27,
                    color: "white",
                    backgroundColor: "rgb(128 128 128 / 33%)",
                  }}
                />
                <p style={{ fontSize: 14 }}>
                  <KeyboardDoubleArrowUpIcon
                    style={{ color: "black", fontSize: 14 }}
                  />
                  1.2
                </p>
              </div>
            </div>
          </div>
          <div
            className="body-container flex align-center space-between"
            style={{ padding: "0px 20px" }}
          >
            <div
              className="flex align-center"
              style={{
                width: "90%",
                borderRadius: 15,
                backgroundColor: "#80808026",
                height: "90%",
                gap: 6,
              }}
            >
              <div
                className="flex space-between align-center"
                style={{
                  height: "80%",
                  width: "25%",
                  backgroundColor: "white",
                  borderRadius: 20,
                  padding: 10,
                }}
              >
                <span
                  className="flex align-center"
                  style={{
                    gap: 6,

                    marginLeft: 2,
                  }}
                >
                  <Avatar
                    alt="Armin"
                    src="/avatar.png"
                    sx={{ width: 18, height: 18 }}
                  />
                  <p style={{ fontSize: 14 }}>$156,841</p>
                </span>
                <p style={{ fontSize: 14, color: "gray" }}>29.65%</p>
              </div>
              <div
                className="flex space-between align-center"
                style={{
                  height: "80%",
                  width: "25%",
                  backgroundColor: "white",
                  borderRadius: 20,
                  padding: 10,
                }}
              >
                <span
                  className="flex align-center"
                  style={{
                    gap: 6,

                    marginLeft: 2,
                  }}
                >
                  <Avatar
                    alt="Armin"
                    src="/avatar.png"
                    sx={{ width: 18, height: 18 }}
                  />
                  <p style={{ fontSize: 14 }}>$209,633</p>
                </span>
                <p style={{ fontSize: 14, color: "gray" }}>39.63%</p>
              </div>
              <div
                className="flex space-between align-center"
                style={{
                  height: "80%",
                  width: "25%",
                  backgroundColor: "white",
                  borderRadius: 20,
                  padding: 10,
                }}
              >
                <span
                  className="flex align-center"
                  style={{
                    gap: 6,

                    marginLeft: 2,
                  }}
                >
                  <Avatar
                    alt="Armin"
                    src="/avatar.png"
                    sx={{ width: 18, height: 18 }}
                  />
                  <p style={{ fontSize: 14 }}>$117,115</p>
                </span>
                <p style={{ fontSize: 14, color: "gray" }}>22.14%</p>
              </div>
              <div
                className="flex space-between align-center"
                style={{
                  height: "80%",
                  width: "20%",
                  backgroundColor: "transparent",
                  border: "none",
                  borderRadius: 20,
                  padding: 10,
                }}
              >
                <span
                  className="flex align-center"
                  style={{
                    gap: 6,
                    marginLeft: 2,
                  }}
                >
                  <Avatar
                    alt="Armin"
                    src="/codenam_logo.png"
                    sx={{ width: 18, height: 18 }}
                  />
                  <p style={{ fontSize: 14 }}>$45,386</p>
                </span>
                <p style={{ fontSize: 14, color: "gray" }}>8.58%</p>
              </div>
            </div>
            <Fab
              variant="extended"
              size="small"
              sx={{
                backgroundColor: "black",
                color: "white",
                padding: "10 10",
                fontSize: 14,
              }}
            >
              <p style={{ fontSize: 12 }}>Details</p>
            </Fab>
          </div>
          <div
            className="flex "
            style={{ border: "1px solid red", width: "100%", marginTop: 20 }}
          >
            <div
              className="flex settings-icons"
              style={{ width: "50%", height: 100 }}
            >
              <div style={{ width: "50%" }}>
                <BarChartWithMinHeight />{" "}
              </div>
              <div style={{ width: "50%" }}>
                <BarChartWithMinHeight />{" "}
              </div>
            </div>
            <div></div>
          </div>
        </div>
      </div>
    </div>
  );
}
