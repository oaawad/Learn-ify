import React from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import LinkedinIcon from '@mui/icons-material/LinkedIn';
import { useLocation } from 'react-router-dom';

function Footer() {
  const [hide, setHide] = React.useState(false);
  const location = useLocation();
  React.useEffect(() => {
    location.pathname.includes('/dashboard') ? setHide(true) : setHide(false);
  }, [location]);
  return (
    <Box
      sx={{
        position: 'auto',
        bottom: 0,
        width: '100%',
        height: 'auto',
        backgroundColor: 'secondary.main',
        padding: '1rem',
        display: hide ? 'none' : 'block',
      }}
    >
      <Container maxWidth="md">
        <Grid direction="row" spacing={2} padding={2} container>
          <Grid item sm={12} md={4.8}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                flexDirection: 'column',
              }}
            >
              <Typography
                variant="h6"
                noWrap
                component="a"
                href="/"
                sx={{
                  fontFamily: 'Changa',
                  fontWeight: 500,
                  color: 'grey.400',
                  textDecoration: 'none',
                }}
              >
                Learn-<span style={{ color: '#3145FB' }}>ify</span>
              </Typography>
              <Stack direction="column">
                <Typography
                  variant="body2"
                  color="grey.500"
                  textAlign="justify"
                  mt={1}
                  maxWidth="80%"
                >
                  Lorem ipsum dolor sit, amet consectetur adipisicing elit. Porro tempora
                  repudiandae laboriosam delectus omnis voluptate dolorem corrupti quos minus rem.
                </Typography>
                <Stack direction="row" mt={1} spacing={2}>
                  <TwitterIcon sx={{ color: 'grey.500' }} />
                  <FacebookIcon sx={{ color: 'grey.500' }} />
                  <InstagramIcon sx={{ color: 'grey.500' }} />
                  <LinkedinIcon sx={{ color: 'grey.500' }} />
                </Stack>
              </Stack>
            </Box>
          </Grid>
          <Grid item xs={6} sm={4} md={2.4}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                flexDirection: 'column',
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{
                  color: 'grey.400',
                  textDecoration: 'none',
                }}
              >
                Company
              </Typography>

              <Stack direction="column">
                <Typography
                  varient="body2"
                  color="grey.500"
                  href="/"
                  mt={1}
                  fontWeight="light"
                  fontSize="0.8rem"
                >
                  Services
                </Typography>
                <Typography
                  varient="body2"
                  color="grey.500"
                  href="/"
                  mt={1}
                  fontWeight="light"
                  fontSize="0.8rem"
                >
                  Courses
                </Typography>
                <Typography
                  varient="body2"
                  color="grey.500"
                  href="/"
                  mt={1}
                  fontWeight="light"
                  fontSize="0.8rem"
                >
                  About Us
                </Typography>
                <Typography
                  varient="body2"
                  color="grey.500"
                  href="/"
                  mt={1}
                  fontWeight="light"
                  fontSize="0.8rem"
                >
                  Legal Terms
                </Typography>
              </Stack>
            </Box>
          </Grid>
          <Grid item xs={6} sm={4} md={2.4}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                flexDirection: 'column',
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{
                  color: 'grey.400',
                  textDecoration: 'none',
                }}
              >
                Support
              </Typography>

              <Stack direction="column">
                <Typography
                  varient="body2"
                  color="grey.500"
                  href="/"
                  mt={1}
                  fontWeight="light"
                  fontSize="0.8rem"
                >
                  Help Center
                </Typography>
                <Typography
                  varient="body2"
                  color="grey.500"
                  href="/"
                  mt={1}
                  fontWeight="light"
                  fontSize="0.8rem"
                >
                  FAQ
                </Typography>
                <Typography
                  varient="body2"
                  color="grey.500"
                  href="/"
                  mt={1}
                  fontWeight="light"
                  fontSize="0.8rem"
                >
                  Tweet @ Us
                </Typography>
                <Typography
                  varient="body2"
                  color="grey.500"
                  href="/"
                  mt={1}
                  fontWeight="light"
                  fontSize="0.8rem"
                >
                  Feedback
                </Typography>
              </Stack>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4} md={2.4}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                flexDirection: 'column',
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{
                  color: 'grey.400',
                  textDecoration: 'none',
                }}
              >
                Contact
              </Typography>

              <Stack direction="column">
                <Typography
                  varient="body2"
                  color="grey.500"
                  href="/"
                  mt={1}
                  fontWeight="light"
                  fontSize="0.8rem"
                >
                  info@learn-ify.live
                </Typography>
                <Typography
                  varient="body2"
                  color="grey.500"
                  href="/"
                  mt={1}
                  fontWeight="light"
                  fontSize="0.8rem"
                >
                  +1 234 567 890
                </Typography>
              </Stack>
            </Box>
          </Grid>
        </Grid>
        <Box mt="auto" display="flex" justifyContent="center" flexDirection="column">
          <Box
            sx={{
              width: '100%',
              height: '0.05rem',
              background: 'radial-gradient(circle, rgba(234,234,234,1) 0%, rgba(24,25,69,1) 100%)',
              marginY: '1rem',
            }}
          />
          <Typography variant="body2" color="grey.400" textAlign="center">
            copyright &copy; 2022 Team Inferno. All rights reserved
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
export default Footer;
