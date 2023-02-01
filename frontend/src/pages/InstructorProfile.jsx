import { useEffect, useState } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import CourseCard from '../components/CourseCard';
import Revenue from '../components/Revenue';
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
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Reviews from '../components/Reviews';
import axios from 'axios';
import EditOutlined from '@mui/icons-material/EditOutlined';
import ReviewForm from '../components/ReviewForm';
function InstructorProfile(props) {
  let { user } = useSelector((state) => state.user);
  if (typeof user === 'string') {
    user = JSON.parse(user);
  }
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm();
  const { id } = useParams();
  const [instructor, setInstructor] = useState(null);
  const [edit, setEdit] = useState(false);
  const [publicCourses, setPublicCourses] = useState([]);
  const [privateCourses, setPrivateCourses] = useState([]);
  const [tab, setTab] = useState(1);
  const [reviews, setReviews] = useState([]);
  const navigate = useNavigate();

  const onSubmitEdit = (data) => {
    const name = data.fullName.split(' ');
    if (name.length < 2) {
      setError('fullName', { type: 'manual', message: 'Please enter your full name' });
    }
    if (
      name[1] === instructor.lastName &&
      name[0] === instructor.firstName &&
      data.bio === instructor.bio &&
      data.profession === instructor.profession
    ) {
      setEdit(false);
      return;
    } else {
      axios
        .patch(
          `/api/instructors/${user._id}`,
          { firstName: name[0], lastName: name[1], bio: data.bio, profession: data.profession },
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          }
        )
        .then((res) => {
          setInstructor(res.data.instructor);
          toast.success('Profile updated successfully');
        })
        .catch((err) => {
          toast.error('Error updating profile');
        });
      setEdit(false);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    axios.get(`/api/instructors/${id ? id : user._id}`).then((res) => {
      setPublicCourses(res.data.courses);
      setInstructor(res.data.instructor);
    });

    if (props.me) {
      axios
        .get(`/api/instructors/${user._id}/private`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
        .then((res) => {
          setPrivateCourses(res.data);
        });
    }
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
        <Typography variant="h4" color="WHITE">
          Instructor Profile
        </Typography>
        <Breadcrumbs separator="›" color="grey.600">
          <Link underline="hover" color="inherit" href="/">
            Home
          </Link>
          <Link underline="hover" color="inherit" href="/">
            Instructors
          </Link>
          <Typography color="white">John Doe</Typography>
        </Breadcrumbs>
      </Box>
      {instructor ? (
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
            <form onSubmit={handleSubmit(onSubmitEdit)}>
              <Stack direction="row">
                <Avatar sx={{ width: '5rem', height: '5rem' }} src={img} />
                <Stack sx={{ marginLeft: '1rem', justifyContent: 'center' }}>
                  <Stack direction="row" alignItems="center">
                    <Stack>
                      {!edit ? (
                        <>
                          <Typography variant="h5" color="grey.800" fontWeight="semiBold">
                            {instructor?.firstName} {instructor?.lastName}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="grey.600"
                            fontWeight="medium"
                            sx={{ lineHeight: '1.5rem' }}
                          >
                            {instructor?.profession}
                          </Typography>
                        </>
                      ) : (
                        <>
                          <TextField
                            id="outlined-basic"
                            label="Full Name"
                            variant="outlined"
                            size="small"
                            defaultValue={`${instructor.firstName} ${instructor.lastName}`}
                            {...register('fullName', { required: true })}
                            error={errors?.fullName ? true : false}
                            helperText={errors?.fullName && 'Please enter your full name'}
                          />
                          <TextField
                            id="outlined-basic"
                            label="Profession"
                            variant="outlined"
                            size="small"
                            sx={{ mt: '0.5rem' }}
                            defaultValue={instructor.profession}
                            {...register('profession', { required: true })}
                            error={errors?.profession ? true : false}
                            helperText={errors?.profession && 'Please enter your profession'}
                          />
                        </>
                      )}
                    </Stack>
                    <Stack direction={{ xs: 'column', sm: 'row' }} gap="1rem" sx={{ ml: '1rem' }}>
                      {instructor?.subjects.map((subject) => (
                        <Chip
                          label={subject.name}
                          variant="outlined"
                          size="small"
                          sx={{
                            color: `${subject.color}`,
                            borderColor: `${subject.color}`,
                            bgcolor: `${subject.color}33`,
                          }}
                        />
                      ))}
                    </Stack>
                  </Stack>
                  <Stack direction="row" mt="0.7rem">
                    <Typography
                      variant="body2"
                      color="grey.600"
                      sx={{
                        pr: '1rem',
                        alignSelf: 'center',
                      }}
                    >
                      <Typography
                        variant="oveline"
                        color="grey.600"
                        fontWeight="bold"
                        fontSize="inherit"
                      >
                        {publicCourses?.length}
                      </Typography>
                      {'  '}Courses
                    </Typography>
                    <Typography
                      variant="body2"
                      color="grey.600"
                      sx={{
                        pr: '1rem',
                        alignSelf: 'center',
                      }}
                    >
                      <Typography variant="oveline" color="grey.600" fontWeight="bold">
                        0
                      </Typography>
                      {'  '}Student
                    </Typography>
                    <Typography
                      variant="body2"
                      color="grey.600"
                      sx={{
                        pr: '1rem',
                        alignSelf: 'center',
                      }}
                    >
                      <Typography
                        variant="oveline"
                        color="grey.600"
                        fontWeight="bold"
                        fontSize="inherit"
                      >
                        4.5
                      </Typography>
                      {'  '}Rating
                    </Typography>
                  </Stack>
                </Stack>
                {props.me && !edit && (
                  <Box sx={{ ml: 'auto' }}>
                    <Button onClick={() => setEdit(true)}>
                      <EditOutlined />
                    </Button>
                  </Box>
                )}
              </Stack>
              {edit ? (
                <Stack>
                  <TextField
                    id="outlined-basic"
                    label="bio"
                    variant="outlined"
                    multiline
                    rows={3}
                    defaultValue={instructor.bio}
                    fullWidth
                    sx={{ mt: '1rem' }}
                    {...register('bio', { required: true })}
                    error={errors?.bio ? true : false}
                    helperText={errors?.bio && 'Please enter your bio'}
                  />
                  <Box sx={{ ml: 'auto', mt: '1rem' }}>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => setEdit(false)}
                      sx={{ mr: '1rem' }}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" variant="outlined" color="success">
                      Save Changes
                    </Button>
                  </Box>
                </Stack>
              ) : (
                <Typography
                  variant="body1"
                  color="grey.600"
                  ml="6rem"
                  mt="1rem"
                  textAlign="justify"
                >
                  {instructor?.bio}
                </Typography>
              )}
            </form>
          </Box>
          <Stack direction="row" sx={{ mt: '1rem' }}>
            <Button
              sx={{
                paddingY: '1rem',
                color: tab === 1 ? 'primary.main' : 'grey.600',
                borderRadius: '0',
                borderBottom: tab === 1 ? '2px solid' : 'none',
                borderColor: 'primary.main',
              }}
              onClick={() => setTab(1)}
            >
              Courses
            </Button>
            {props.me && (
              <Button
                sx={{
                  paddingY: '1rem',
                  color: tab === 2 ? 'primary.main' : 'grey.600',
                  borderRadius: '0',
                  borderBottom: tab === 2 ? '2px solid' : 'none',
                  borderColor: 'primary.main',
                }}
                onClick={() => setTab(2)}
              >
                Draft
              </Button>
            )}

            <Button
              sx={{
                paddingY: '1rem ',
                color: tab === 3 ? 'primary.main' : 'grey.600',
                borderRadius: '0',
                borderBottom: tab === 3 ? '2px solid' : 'none',
                borderColor: tab === 3 ? 'primary.main' : 'none',
              }}
              onClick={() => setTab(3)}
            >
              Reviews
            </Button>
            {props.me && (
              <Button
                sx={{
                  paddingY: '1rem ',
                  color: tab === 4 ? 'primary.main' : 'grey.600',
                  borderRadius: '0',
                  borderBottom: tab === 4 ? '2px solid' : 'none',
                  borderColor: tab === 4 ? 'primary.main' : 'none',
                }}
                onClick={() => setTab(4)}
              >
                Revenue
              </Button>
            )}
            {props.me && (
              <Button
                sx={{
                  ml: 'auto',
                  color: 'secondary.main',
                  fontSize: '1rem',
                }}
                onClick={() => navigate('/courses/create')}
              >
                <AddIcon sx={{ mr: '0.6rem' }} /> Create Course
              </Button>
            )}
          </Stack>
          <Divider />
          <Box
            sx={{
              marginTop: '2rem',
            }}
          >
            <Box
              sx={{
                display: tab === 1 ? 'block' : 'none',
                transition: 'display 0.3s ease-in-out',
              }}
            >
              <Grid container spacing={2}>
                {publicCourses.length > 0 &&
                  publicCourses.map((course, i) => {
                    return (
                      <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
                        <CourseCard course={course} />
                      </Grid>
                    );
                  })}
              </Grid>
            </Box>

            <Box
              sx={{
                display: tab === 2 ? 'block' : 'none',
              }}
            >
              <Grid container spacing={2}>
                {privateCourses.length > 0 &&
                  privateCourses.map((course, i) => {
                    return (
                      <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
                        <CourseCard course={course} draft={true} />
                      </Grid>
                    );
                  })}
              </Grid>
            </Box>
            <Box
              sx={{
                display: tab === 4 ? 'block' : 'none',
              }}
            >
              <Revenue token={user.token} />
            </Box>
            <Stack display={tab === 3 ? 'flex' : 'none'} direction="row" spacing={2}>
              <Box
                sx={{
                  width: '100%',
                }}
              >
                <Reviews
                  rating={4.5}
                  instructor={id || user._id}
                  reviews={reviews}
                  setReviews={setReviews}
                  user={user}
                />
              </Box>

              {!props.me &&
                reviews?.filter((review) => review.user._id === user._id).length === 0 && (
                  <Box sx={{ width: 'auto' }}>
                    <ReviewForm
                      setReviews={setReviews}
                      instructor={instructor._id}
                      token={user.token}
                    />
                  </Box>
                )}
            </Stack>
          </Box>
        </Container>
      ) : (
        <Spinner />
      )}
    </Box>
  );
}

export default InstructorProfile;
