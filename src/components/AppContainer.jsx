import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
// import MuiAppBar from '@mui/material/AppBar';
// import Toolbar from '@mui/material/Toolbar';
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
// import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/People";
import MailIcon from "@mui/icons-material/PeopleAlt";
import axios from "axios";
import FamilyPortrait from "./FamilyPortrait";
import FamilyInfo from "./FamilyInfo";
import Button from "@mui/material/Button";
const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(9)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

// const AppBar = styled(MuiAppBar, {
//   shouldForwardProp: (prop) => prop !== 'open',
// })(({ theme, open }) => ({
//   zIndex: theme.zIndex.drawer + 1,
//   transition: theme.transitions.create(['width', 'margin'], {
//     easing: theme.transitions.easing.sharp,
//     duration: theme.transitions.duration.leavingScreen,
//   }),
//   ...(open && {
//     marginLeft: drawerWidth,
//     width: `calc(100% - ${drawerWidth}px)`,
//     transition: theme.transitions.create(['width', 'margin'], {
//       easing: theme.transitions.easing.sharp,
//       duration: theme.transitions.duration.enteringScreen,
//     }),
//   }),
// }));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function AppContainer(props) {
  // const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [families, setfamilies] = React.useState([]);
  const [renderPortrait, setRenderPortrait] = React.useState(false);
  const [family, setFamily] = React.useState(null);

  React.useEffect(() => {
    axios.get("http://127.0.0.1:8888/api/users.json").then((res) => {
      console.log(res.data.shift());
      setfamilies(res.data);
      setFamily(res.data[0]);
    });
  }, []);

  // const handleDrawerOpen = () => {
  //   setOpen(true);
  // };

  const handleDrawerClose = () => {
    setOpen(!open);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <Typography>{open ? "Registered Families" : ""}</Typography>
          <IconButton onClick={handleDrawerClose}>
            {!open ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {families.map((home, index) => (
            <ListItem button key={index} onClick={() => setFamily(home)}>
              <ListItemIcon
                sx={{
                  color: family && family.id === home.id ? "#A05AB0" : "black",
                }}
              >
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText
                primary={home.name}
                primaryTypographyProps={{
                  color:
                    family && family.id === home.id ? "secondary" : "black",
                }}
              />
            </ListItem>
          ))}
        </List>
        <Divider />
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1 }}>
        {/* <DrawerHeader /> */}
        {renderPortrait ? (
          <FamilyPortrait family={family} />
        ) : (
          <FamilyInfo family={family} />
        )}
        <div
          style={{
            width: "100%",
            height: "100px",
            display: "flex",
            justifyContent: "space-evenly",
            alignItems: "center",
          }}
        >
          <Button
            variant="contained"
            color="secondary"
            onClick={() => setRenderPortrait(true)}
          >
            Family Portrait
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setRenderPortrait(false)}
          >
            Family Info
          </Button>
        </div>
      </Box>
    </Box>
  );
}
