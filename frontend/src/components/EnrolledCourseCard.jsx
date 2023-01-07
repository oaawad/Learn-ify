import React from 'react';
import axios from 'axios';
import FileDownload from 'js-file-download';
import { toast } from 'react-toastify';
import {
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Stack,
  Box,
  Link,
  Typography,
  Tooltip,
  Button,
  Menu,
  MenuItem,
  Modal,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

function EnrolledCourseCard(props) {
  const course = props.course;
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const [open, setOpen] = React.useState(false);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = (event) => {
    setAnchorElUser(null);
  };
  const handleRefund = (courseId) => {
    axios({
      method: 'post',
      url: `/api/ticket/refund`,
      data: { courseId },
      headers: { Authorization: `Bearer ${props.user.token}` },
    })
      .then((res) => {
        setOpen(false);
        toast.success('Refund request sent successfully');
      })
      .catch((err) => {
        setOpen(false);
        toast.error(err.response.data.message);
      });
  };
  const downloadCertificate = (courseId) => {
    axios({
      method: 'get',
      url: `/api/users/me/course/${courseId}/downloadCertificate`,
      headers: { Authorization: `Bearer ${props.user.token}` },
      responseType: 'blob',
    }).then((res) => {
      FileDownload(res.data, 'certificate.pdf');
      setAnchorElUser(null);
    });
  };

  return (
    <Card
      sx={{
        position: 'relative',
        borderRadius: '0',
        overflow: 'visible',
      }}
    >
      <CardActionArea
        component={Link}
        href={`/courses/${course._id}/learn`}
        sx={{
          pb: '0.5rem',
          '&:hover': {
            transition: 'all 0.3s ease-in-out',
            backgroundColor: 'grey.300',
          },
        }}
      >
        <CardMedia
          component="img"
          height="150"
          image={`https://img.youtube.com/vi/${course.preview}/hqdefault.jpg`}
        />

        <CardContent>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              minHeight: '3.5rem',
            }}
            lang="en"
          >
            <Typography
              variant="h6"
              textAlign="left"
              lineHeight={1.3}
              my={0.2}
              fontWeight="semiBold"
              color="secondary.main"
            >
              {course.title}
            </Typography>
          </Box>

          <Stack direction="row" alignItems="center">
            <Typography variant="body2" textAlign="left" fontWeight="medium" color="grey.700">
              {course.instructor.firstName} {course.instructor.lastName}
            </Typography>
          </Stack>
        </CardContent>
        <Box
          sx={{
            height: '0.5rem',
            bgcolor: 'grey.500',
            mb: '0.5rem',
          }}
        >
          <Box
            sx={{
              height: '0.5rem',
              bgcolor: 'primary.main',
              width: `${course.progress}%`,
            }}
          ></Box>
        </Box>
        <Typography variant="body2" mb="0.5rem" ml="1rem">
          {course.progress}% complete
        </Typography>
      </CardActionArea>
      <Box
        sx={{
          position: 'absolute',
          top: '1rem',
          right: '1rem',
        }}
      >
        <Tooltip title="Open settings">
          <Button
            variant="contained"
            onClick={handleOpenUserMenu}
            sx={{
              p: 0,
              minWidth: 0,
              bgcolor: 'grey.300',
              color: 'grey.800',
              '&:hover': {
                bgcolor: 'grey.500',
              },
            }}
          >
            <MoreVertIcon />
          </Button>
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
          {course.progress === 100 && (
            <MenuItem onClick={() => downloadCertificate(course._id)}>
              <Typography textAlign="center">Get Certificate</Typography>
            </MenuItem>
          )}
          <MenuItem onClick={handleCloseUserMenu}>
            <Typography textAlign="center">Report Problem</Typography>
          </MenuItem>
          {course.progress < 50 ? (
            <MenuItem
              onClick={() => {
                setOpen(true);
                handleCloseUserMenu();
              }}
              disabled={course.progress > 50}
            >
              <Typography textAlign="center">Request a refund</Typography>
            </MenuItem>
          ) : (
            <Tooltip title="You can only request a refund if you have completed less than 50% of the course">
              <span>
                <MenuItem disabled>
                  <Typography textAlign="center">Request a refund</Typography>
                </MenuItem>
              </span>
            </Tooltip>
          )}
          {/* <Tooltip
            title="You can only request a refund if you have completed less than 50% of the course"
            hidden={course.progress < 50}
          >
            <span>
              <MenuItem onClick={() => setOpen(true)} disabled={course.progress > 50}>
                <Typography textAlign="center">Request a refund</Typography>
              </MenuItem>
            </span>
          </Tooltip> */}
        </Menu>
        <Modal
          open={open}
          onClose={() => setOpen(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 400,
              bgcolor: 'background.paper',
              boxShadow: 24,
              p: 4,
            }}
          >
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Refund Request
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              Are you sure you want to request a refund for this course?
            </Typography>
            <Stack spacing={2} sx={{ mt: '1rem' }} direction="row">
              <Button
                variant="contained"
                sx={{ bgcolor: 'success.main', color: 'white' }}
                onClick={() => handleRefund(course._id)}
              >
                Yes
              </Button>
              <Button
                variant="contained"
                sx={{ bgcolor: 'error.main', color: 'white' }}
                onClick={() => setOpen(false)}
              >
                No
              </Button>
            </Stack>
          </Box>
        </Modal>
      </Box>
    </Card>
  );
}

export default EnrolledCourseCard;
