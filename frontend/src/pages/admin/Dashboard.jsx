import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import { logout, reset } from '../../features/user/userSlice';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import DiscountIcon from '@mui/icons-material/Discount';
import LogoutIcon from '@mui/icons-material/Logout';
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import CachedIcon from '@mui/icons-material/Cached';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import SettingsIcon from '@mui/icons-material/Settings';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import StickyNote2Icon from '@mui/icons-material/StickyNote2';
import Users from './Users';
import Corporates from './Corporates';
import CourseRequests from './CourseRequests';
import RefundRequests from './RefundRequests';
import Promotions from './Promotions';
import Problems from './Problems';

const drawerWidth = 240;

const marketingTabs = [
  {
    label: 'Dashboard',
    icon: <DashboardIcon sx={{ fontSize: 'inherit' }} />,
  },
  {
    label: 'Users',
    icon: <PeopleAltIcon sx={{ fontSize: 'inherit' }} />,
  },
  {
    label: 'Promotions',
    icon: <DiscountIcon sx={{ fontSize: 'inherit' }} />,
  },
];
const corporateTabs = [
  {
    label: 'Corporates',
    icon: <CorporateFareIcon sx={{ fontSize: 'inherit' }} />,
  },
  {
    label: 'Course Requests',
    icon: <StickyNote2Icon sx={{ fontSize: 'inherit' }} />,
  },
];
const supportTabs = [
  {
    label: 'Problems',
    icon: <ReportProblemIcon sx={{ fontSize: 'inherit' }} />,
  },
  {
    label: 'Refund Requests',
    icon: <CachedIcon sx={{ fontSize: 'inherit' }} />,
  },
];
const systemTabs = [
  {
    label: 'Settings',
    icon: <SettingsIcon sx={{ fontSize: 'inherit' }} />,
  },
  {
    label: 'Alerts',
    icon: <NotificationsActiveIcon sx={{ fontSize: 'inherit' }} />,
  },
];

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  })
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));

export default function Dashboard(props) {
  const active = props.tab;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  let { user } = useSelector((state) => state.user);
  if (typeof user === 'string') {
    user = JSON.parse(user);
  }
  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate('/');
  };

  React.useEffect(() => {
    if (!user || (user && user.type !== 'administrator')) {
      navigate('/');
    }
  }, []);

  const theme = useTheme();
  const [open, setOpen] = React.useState(true);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: 'flex', flexGrow: 1 }}>
      <CssBaseline />

      <AppBar
        position="fixed"
        open={open}
        elevation={0}
        sx={{ bgcolor: 'grey.400', color: 'grey.800' }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            {active}
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: 'flex',
              fontFamily: 'Changa',
              fontWeight: 500,
              fontSize: '1.8rem',
              color: 'secondary.main',
              textDecoration: 'none',
            }}
          >
            <span style={{ color: '#3145FB' }}>E</span>-Learning
          </Typography>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </DrawerHeader>
        <Stack>
          <Typography
            variant="subtitle1"
            sx={{ pl: '2rem', color: 'grey.700', fontWeight: 'semiBold' }}
          >
            Marketing
          </Typography>
          <List>
            {marketingTabs.map((tab, index) => (
              <ListItem key={tab.label} disablePadding>
                <ListItemButton
                  sx={{
                    p: 0,
                    bgcolor: active === tab.label ? 'grey.400' : 'transparent',
                  }}
                  onClick={() =>
                    tab.label === 'Dashboard'
                      ? navigate(`/dashboard`)
                      : navigate(`/dashboard/${tab.label.toLowerCase()}`)
                  }
                >
                  <ListItemIcon sx={{ minWidth: 0, mr: '0.5rem', ml: '2rem', fontSize: 'inherit' }}>
                    {tab.icon}
                  </ListItemIcon>
                  <ListItemText
                    primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 'semiBold' }}
                    primary={tab.label}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Stack>
        <Stack sx={{ mt: '1rem' }}>
          <Typography
            variant="subtitle1"
            sx={{ pl: '2rem', color: 'grey.700', fontWeight: 'semiBold' }}
          >
            Manage Corporates
          </Typography>
          <List>
            {corporateTabs.map((tab, index) => (
              <ListItem key={tab.label} disablePadding>
                <ListItemButton
                  sx={{
                    p: 0,
                    bgcolor: active === tab.label ? 'grey.400' : 'transparent',
                  }}
                  onClick={() =>
                    tab.label === 'Dashboard'
                      ? navigate(`/dashboard`)
                      : navigate(`/dashboard/${tab.label.toLowerCase().replace(' ', '-')}`)
                  }
                >
                  <ListItemIcon sx={{ minWidth: 0, mr: '0.5rem', ml: '2rem' }}>
                    {tab.icon}
                  </ListItemIcon>
                  <ListItemText
                    primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 'semiBold' }}
                    primary={tab.label}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Stack>
        <Stack sx={{ mt: '1rem' }}>
          <Typography
            variant="subtitle1"
            sx={{ pl: '2rem', color: 'grey.700', fontWeight: 'semiBold' }}
          >
            Support
          </Typography>
          <List>
            {supportTabs.map((tab, index) => (
              <ListItem key={tab.label} disablePadding>
                <ListItemButton
                  sx={{
                    p: 0,
                    bgcolor: active === tab.label ? 'grey.400' : 'transparent',
                  }}
                  onClick={() =>
                    tab.label === 'Dashboard'
                      ? navigate(`/dashboard`)
                      : navigate(`/dashboard/${tab.label.toLowerCase().replace(' ', '-')}`)
                  }
                >
                  <ListItemIcon sx={{ minWidth: 0, mr: '0.5rem', ml: '2rem' }}>
                    {tab.icon}
                  </ListItemIcon>
                  <ListItemText
                    primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 'semiBold' }}
                    primary={tab.label}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Stack>
        <Stack sx={{ mt: '1rem' }}>
          <Typography
            variant="subtitle1"
            sx={{ pl: '2rem', color: 'grey.700', fontWeight: 'semiBold' }}
          >
            System
          </Typography>
          <List>
            {systemTabs.map((tab, index) => (
              <ListItem key={tab.label} disablePadding>
                <ListItemButton sx={{ p: 0 }}>
                  <ListItemIcon sx={{ minWidth: 0, mr: '0.5rem', ml: '2rem' }}>
                    {tab.icon}
                  </ListItemIcon>
                  <ListItemText
                    primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 'semiBold' }}
                    primary={tab.label}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Stack>
        <Stack sx={{ mt: 'auto', color: 'error.main' }}>
          <List>
            <ListItem disablePadding>
              <ListItemButton sx={{ p: 0 }} onClick={onLogout}>
                <ListItemIcon sx={{ minWidth: 0, mr: '0.5rem', ml: '2rem', color: 'error.main' }}>
                  <LogoutIcon sx={{ fontSize: 'inherit' }} />
                </ListItemIcon>
                <ListItemText
                  primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 'semiBold' }}
                  primary={'Logout'}
                />
              </ListItemButton>
            </ListItem>
          </List>
        </Stack>
      </Drawer>
      <Main
        open={open}
        sx={{
          bgcolor: 'grey.400',
          flexGrow: 1,
          display: active === 'Dashboard' ? 'block' : 'none',
        }}
      >
        <DrawerHeader />
      </Main>
      <Users open={open} active={active} user={user} />
      <Corporates open={open} active={active} user={user} />
      <Problems open={open} active={active} user={user} />
      <Promotions open={open} active={active} token={user.token} />
      <Main
        open={open}
        sx={{
          bgcolor: 'grey.400',
          flexGrow: 1,
          display: active === 'Course Requests' ? 'block' : 'none',
        }}
      >
        <DrawerHeader />
        <CourseRequests token={user.token} />
      </Main>
      <Main
        open={open}
        sx={{
          bgcolor: 'grey.400',
          flexGrow: 1,
          display: active === 'Refund Requests' ? 'block' : 'none',
        }}
      >
        <DrawerHeader />
        <RefundRequests token={user.token} />
      </Main>
    </Box>
  );
}
