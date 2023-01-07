import { useEffect, useState } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import EnrolledCourseCard from '../components/EnrolledCourseCard';
import img from '../../public/assets/programmer.png';
import Spinner from '../components/Spinner';
import {
  Box,
  Container,
  Typography,
  Breadcrumbs,
  Link,
  Stack,
  Avatar,
  Divider,
  Button,
  Chip,
  Grid,
  TextField,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Reviews from '../components/Reviews';
import axios from 'axios';
import EditOutlined from '@mui/icons-material/EditOutlined';
import ReviewForm from '../components/ReviewForm';
function Learning(props) {
  const [courses, setCourses] = useState([]);
  let { user } = useSelector((state) => state.user);
  if (typeof user === 'string') {
    user = JSON.parse(user);
  }
  const [tab, setTab] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!user) {
      navigate('/login');
    }
    axios
      .get(`/api/users/courses`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        setCourses(res.data);
      });
  }, []);

  return (
    <Box sx={{ backgroundColor: 'white', paddingBottom: '2rem' }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          maxWidth: '100%',
          height: '30vh',
          backgroundColor: 'secondary.main',
          marginBottom: '2rem',
        }}
      >
        <Typography variant="h4" color="WHITE" sx={{ mt: 'auto' }}>
          My Learning
        </Typography>
        <Stack direction="row" sx={{ mt: '1rem', mt: 'auto', alignSelf: 'flex-start', ml: '2rem' }}>
          <Button
            sx={{
              paddingY: '1rem',
              color: tab === 1 ? 'white' : 'grey.500',
              borderRadius: '0',
              borderBottom: tab === 1 ? '0.3rem solid' : 'none',
              borderColor: 'white',
              fontWeight: 'semiBold',
              mr: '1rem',
            }}
            onClick={() => setTab(1)}
          >
            All Courses
          </Button>

          <Button
            sx={{
              paddingY: '1rem',
              color: tab === 2 ? 'white' : 'grey.500',
              borderRadius: '0',
              borderBottom: tab === 2 ? '0.3rem solid' : 'none',
              borderColor: 'white',
              fontWeight: 'semiBold',
              mr: '1rem',
            }}
            onClick={() => setTab(2)}
          >
            Yet To Start
          </Button>

          <Button
            sx={{
              paddingY: '1rem',
              color: tab === 3 ? 'white' : 'grey.500',
              borderRadius: '0',
              borderBottom: tab === 3 ? '0.3rem solid' : 'none',
              borderColor: 'white',
              fontWeight: 'semiBold',
              mr: '1rem',
            }}
            onClick={() => setTab(3)}
          >
            On Going
          </Button>
          <Button
            sx={{
              paddingY: '1rem',
              color: tab === 4 ? 'white' : 'grey.500',
              borderRadius: '0',
              borderBottom: tab === 4 ? '0.3rem solid' : 'none',
              borderColor: 'white',
              fontWeight: 'semiBold',
              mr: '1rem',
            }}
            onClick={() => setTab(4)}
          >
            Completed
          </Button>
        </Stack>
      </Box>
      <Container maxWidth="lg">
        <Box
          sx={{
            display: tab === 1 ? 'block' : 'none',
            transition: 'display 0.3s ease-in-out',
          }}
        >
          <Grid container spacing={2}>
            {courses.length > 0 ? (
              courses.map((course, i) => {
                return (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
                    <EnrolledCourseCard course={course} user={user} />
                  </Grid>
                );
              })
            ) : (
              <Typography variant="h5" sx={{ textAlign: 'center' }}>
                No Courses Found
              </Typography>
            )}
          </Grid>
        </Box>
        <Box
          sx={{
            display: tab === 2 ? 'block' : 'none',
            transition: 'display 0.3s ease-in-out',
          }}
        >
          <Grid container spacing={2}>
            {courses.length > 0 ? (
              courses.map((course, i) => {
                if (course.progress === 0) {
                  return (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
                      <EnrolledCourseCard course={course} user={user} />
                    </Grid>
                  );
                }
              })
            ) : (
              <Typography variant="h5" sx={{ textAlign: 'center' }}>
                No Courses Found
              </Typography>
            )}
          </Grid>
        </Box>
        <Box
          sx={{
            display: tab === 3 ? 'block' : 'none',
            transition: 'display 0.3s ease-in-out',
          }}
        >
          <Grid container spacing={2}>
            {courses.length > 0 ? (
              courses.map((course, i) => {
                if (course.progress > 0 && course.progress < 100) {
                  return (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
                      <EnrolledCourseCard course={course} user={user} />
                    </Grid>
                  );
                }
              })
            ) : (
              <Typography variant="h5" sx={{ textAlign: 'center' }}>
                No Courses Found
              </Typography>
            )}
          </Grid>
        </Box>
        <Box
          sx={{
            display: tab === 4 ? 'block' : 'none',
            transition: 'display 0.3s ease-in-out',
          }}
        >
          <Grid container spacing={2}>
            {courses.length > 0 ? (
              courses.map((course, i) => {
                if (course.progress === 100) {
                  return (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
                      <EnrolledCourseCard course={course} user={user} />
                    </Grid>
                  );
                }
              })
            ) : (
              <Typography variant="h5" sx={{ textAlign: 'center' }}>
                No Courses Found
              </Typography>
            )}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}

export default Learning;
