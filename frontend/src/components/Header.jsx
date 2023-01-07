import * as React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { logout, reset } from '../features/user/userSlice';

import Link from '@mui/material/Link';
const pages = ['Products', 'Pricing', 'Blog'];
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

function Header() {
  const location = useLocation();

  const [hide, setHide] = React.useState(false);
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [url, setUrl] = React.useState(location.pathname);
  const [shadow, setShadow] = React.useState(false);
  let { user } = useSelector((state) => state.user);
  if (typeof user === 'string') {
    user = JSON.parse(user);
  }
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate('/');
  };
  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = (event) => {
    setAnchorElNav(null);
    if (event.target.textContent !== '') {
      let path = `/${event.target.textContent.toLowerCase()}`;
      path === '/home' ? (path = '/') : path;
      path === '/sign up' ? (path = '/register') : path;
      setUrl(path);
      navigate(path);
    }
  };

  const handleCloseUserMenu = (event) => {
    setAnchorElUser(null);
    if (event.target.textContent !== '') {
      let path = `/${event.target.textContent.toLowerCase()}`;
      path === '/account' ? (path = '/profile') : path;
      path === '/edit profile' ? (path = '/profile/edit') : path;
      path === '/logout' ? (onLogout(), (path = '/')) : path;
      path === '/my learning' ? (path = '/learning') : path;
      path === '/payments history' ? (path = '/payments') : path;
      setUrl(path);
      navigate(path);
    }
  };
  React.useEffect(() => {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 0) {
        setShadow(true);
      } else {
        setShadow(false);
      }
    });
  }, []);
  React.useEffect(() => {
    location.pathname.includes('/dashboard') ? setHide(true) : setHide(false);
    setUrl(location.pathname);
  }, [location]);
  return (
    <AppBar
      position="sticky"
      sx={{
        backgroundColor: 'white',
        boxShadow: shadow ? '0 0 10px rgba(0,0,0,0.2)' : 'none',
        display: hide ? 'none' : 'block',
      }}
    >
      <Container
        sx={{
          '&.MuiContainer-maxWidthLg': {
            paddingX: { xs: '3rem', sm: '6rem' },
          },
          maxWidth: { sm: 'lg', xs: '100%' },
        }}
      >
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'Changa',
              fontWeight: 500,
              fontSize: '1.8rem',
              color: 'secondary.main',
              textDecoration: 'none',
            }}
          >
            <span style={{ color: '#3145FB' }}>E</span>-Learning
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
            >
              <MenuIcon color="black" />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
                '& .MuiMenu-paper': {
                  width: '100%',
                  maxWidth: '300px',
                },
              }}
            >
              <MenuItem
                onClick={(e) => handleCloseNavMenu(e)}
                selected={url === '/'}
                sx={{
                  justifyContent: 'center',
                }}
              >
                <Typography textAlign="center">Home</Typography>
              </MenuItem>

              <MenuItem
                onClick={(e) => handleCloseNavMenu(e)}
                selected={url === '/courses'}
                sx={{
                  justifyContent: 'center',
                }}
              >
                <Typography textAlign="center">Courses</Typography>
              </MenuItem>

              <MenuItem
                onClick={handleCloseNavMenu}
                sx={{
                  justifyContent: 'center',
                }}
              >
                <Typography textAlign="center">About</Typography>
              </MenuItem>
              <MenuItem
                onClick={handleCloseNavMenu}
                sx={{
                  justifyContent: 'center',
                }}
              >
                <Typography textAlign="center">Support</Typography>
              </MenuItem>
              {!user ? (
                <Box>
                  <MenuItem
                    onClick={handleCloseNavMenu}
                    sx={{
                      justifyContent: 'center',
                    }}
                  >
                    <Typography textAlign="center">Login</Typography>
                  </MenuItem>
                  <MenuItem
                    onClick={handleCloseNavMenu}
                    sx={{
                      justifyContent: 'center',
                    }}
                  >
                    <Button variant="contained" sx={{ width: '100%' }}>
                      Sign Up
                    </Button>
                  </MenuItem>
                </Box>
              ) : null}
            </Menu>
          </Box>
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              fontFamily: 'Changa',
              fontWeight: 500,
              fontSize: '1.8rem',
              color: 'secondary.main',
              textDecoration: 'none',
              flexGrow: 1,
            }}
          >
            <span style={{ color: '#3145FB' }}>E</span>-Learning
          </Typography>
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              marginX: 'auto',
            }}
          >
            <Button
              href="/"
              onClick={() => setUrl('/')}
              sx={{
                mx: 2,
                display: 'block',
                textTransform: 'none',
                color: url === '/' ? 'primary.main' : 'black',
              }}
            >
              Home
            </Button>

            <Button
              href="/courses"
              onClick={() => setUrl('/courses')}
              sx={{
                mx: 2,
                color: url === '/courses' ? 'primary.main' : 'black',
                display: 'block',
                textTransform: 'none',
              }}
            >
              Courses
            </Button>
            <Button
              onClick={handleCloseNavMenu}
              sx={{
                mx: 2,
                color: url === '/instructors' ? 'primary.main' : 'black',
                display: 'block',
                textTransform: 'none',
              }}
            >
              Instructors
            </Button>
            <Button
              onClick={handleCloseNavMenu}
              sx={{
                mx: 2,
                color: 'black',
                color: url === '/about' ? 'primary.main' : 'black',
                display: 'block',
                textTransform: 'none',
              }}
            >
              About
            </Button>
            <Button
              onClick={handleCloseNavMenu}
              sx={{
                mx: 2,
                color: 'black',
                display: 'block',
                textTransform: 'none',
                color: url === '/Support' ? 'primary.main' : 'black',
              }}
            >
              Support
            </Button>
          </Box>

          {user ? (
            <Box>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <AccountCircleIcon fontSize="large" color="black" />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem onClick={handleCloseUserMenu}>
                  <Typography textAlign="center">
                    {user.type === 'administrator'
                      ? 'Dashboard'
                      : user.type === 'instructor'
                        ? 'Profile'
                        : 'My Learning'}
                  </Typography>
                </MenuItem>
                {user.type === 'individual' && (
                  <MenuItem onClick={handleCloseUserMenu}>
                    <Typography textAlign="center">Payments History</Typography>
                  </MenuItem>
                )}
                <MenuItem onClick={handleCloseUserMenu}>
                  <Typography textAlign="center">Edit Profile</Typography>
                </MenuItem>
                <MenuItem onClick={handleCloseUserMenu}>
                  <Typography textAlign="center">Logout</Typography>
                </MenuItem>
              </Menu>
            </Box>
          ) : (
            <Box
              sx={{
                display: { xs: 'none', md: 'flex' },
              }}
            >
              <Button
                onClick={handleCloseNavMenu}
                sx={{
                  my: 2,
                  color: 'black',
                  display: 'block',
                  textTransform: 'none',
                }}
              >
                Login
              </Button>
              <Button
                variant="outlined"
                onClick={handleCloseNavMenu}
                sx={{
                  my: 2,
                  color: 'primary',
                  display: 'block',
                  textTransform: 'none',
                }}
              >
                Sign up
              </Button>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default Header;
