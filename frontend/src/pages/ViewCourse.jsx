import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import YouTube from 'react-youtube';
import PromotionModal from '../components/PromotionModal';
import PaymentButton from '../components/PaymentButton';
import Reviews from '../components/Reviews';
import Spinner from '../components/Spinner';
import ReviewForm from '../components/ReviewForm';
import ReportCourse from '../components/ReportCourse';
import axios from 'axios';
import {
  Box,
  Container,
  Typography,
  Breadcrumbs,
  Link,
  Stack,
  Grid,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  Divider,
  Avatar,
  Modal,
  TextField,
  Link,
} from '@mui/material';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CircleIcon from '@mui/icons-material/Circle';
import ShareIcon from '@mui/icons-material/Share';
import ReportCourse from '../components/ReportCourse';

function ViewCourse(props) {
  const [course, setCourse] = useState(null);
  const [promotion, setPromotion] = useState(null);
  const [owner, setOwner] = useState(false);
  const [enrolled, setEnrolled] = useState(false);
  const [currency, setCurrency] = useState(null);
  const [reviews, setReviews] = useState(null);
  const [openDelete, setOpenDelete] = useState(false);
  const [openClose, setOpenClose] = useState(false);
  const { country } = useSelector((state) => state.user);
  const cntryObj = typeof country === 'string' ? JSON.parse(country) : country;
  let { user } = useSelector((state) => state.user);
  user = typeof user === 'string' ? JSON.parse(user) : user;
  const { id } = useParams();
  const navigate = useNavigate();

  const getCourse = async () => {
    try {
      if (props.draft) {
        const res = await axios.get(`/api/courses/draft/${id}`, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        if (res.data.instructor._id !== user._id) {
          toast.error('Course not found');
          navigate('/courses');
        }
        setOwner(true);
        setCourse(res.data);
      } else {
        const res = await axios.get(`/api/courses/${id}`);
        if (user && user._id === res.data.instructor._id) {
          setOwner(true);
        } else {
          setOwner(false);
        }
        if (res.data.promotion && res.data.promotion.status === 'active') {
          setPromotion({
            amount: res.data.promotion.amount,
            duration:
              (Date.parse(res.data.promotion.expireAt) - Date.now()) / (1000 * 60 * 60 * 24),
          });
        }
        setCourse(res.data);
      }
    } catch (err) {
      navigate('/courses');
      toast.error(err.response?.data.message || 'Course not found');
    }
  };

  const handleDelete = async () => {
    await axios.delete(`/api/courses/${id}`, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
    toast.success('Course deleted');
    navigate('/profile');
  };
  const handleClose = async () => {
    await axios.get(`/api/courses/${id}/close`, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });
    toast.success('Course closed');
    navigate('/profile');
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    getCourse();
    if (user) {
      if (user.courses.filter((course) => course._id === id).length > 0) {
        setEnrolled(true);
      }
    }

    if (cntryObj) {
      setCurrency(cntryObj.currency);
    }
  }, [country]);

  return (
    // if course is null, return loading else return course

    <Box sx={{ backgroundColor: 'grey.300', paddingBottom: '2rem' }}>
      {course ? (
        <>
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
            <Typography variant="h5" color="WHITE">
              {course?.title}
            </Typography>
            <Breadcrumbs separator="›" color="grey.500" sx={{ marginY: '1rem' }}>
              <Link underline="hover" color="inherit" href="/" variant="body2">
                Home
              </Link>
              <Link underline="hover" color="inherit" href="/courses" variant="body2">
                Courses
              </Link>
              <Link
                underline="hover"
                color="grey.400"
                href={`/courses/${course?.subject.name}`}
                variant="body2"
              >
                {course?.subject.name}
              </Link>
            </Breadcrumbs>
            <Stack direction="row">
              <Stack direction="row" justifyContent="center" alignItems="center" mr={2}>
                <PlayCircleIcon fontSize="sm" color="success" />
                <Typography variant="body2" color="grey.400" ml={1}>
                  1000+ Views
                </Typography>
              </Stack>
              <Stack direction="row" justifyContent="center" alignItems="center" mr={2}>
                <CalendarMonthIcon fontSize="sm" color="success" />
                <Typography variant="body2" color="grey.400" ml={1}>
                  4 Weeks 3 Days
                </Typography>
              </Stack>
              <Stack direction="row" justifyContent="center" alignItems="center" mr={2}>
                <AccessTimeIcon fontSize="sm" color="success" />
                <Typography variant="body2" color="grey.400" ml={1}>
                  40+ Hours
                </Typography>
              </Stack>
            </Stack>
          </Box>
          <Container maxWidth="lg">
            <Grid spacing={2} container direction={{ xs: 'column-reverse', md: 'row' }}>
              <Grid item xs={12} md={8}>
                <Box
                  sx={{
                    backgroundColor: 'white',
                    border: '1px solid ',
                    borderColor: 'divider',
                  }}
                  padding={2}
                >
                  <YouTube videoId={course?.preview} iframeClassName={'preview'} />
                  <Box sx={{ marginTop: '2rem' }}>
                    <Typography variant="h6" color="Black">
                      Course Description
                    </Typography>
                    <Typography variant="body2" color="grey.600" textAlign="justify" mt={2}>
                      Lorem ipsum dolor sit amet consectetur adipisicing elit. Id voluptatibus neque
                      incidunt quidem, atque non architecto dolore reprehenderit repudiandae beatae
                      sit illum saepe alias asperiores, quis porro debitis ullam hic. Lorem ipsum
                      dolor it amet, consectetur adipisicing elit. Dicta ratione officia beatae
                      eveniet soluta sit veniam possimus non velit. Dolorem eaque natus quaerat
                      facere quo. Fugiat odit voluptatibus maxime neque!
                    </Typography>
                    <Typography variant="body2" color="grey.600" textAlign="justify" mt={2}>
                      Lorem ipsum dolor sit amet consectetur adipisicing elit. Id voluptatibus neque
                      incidunt quidem, atque non architecto dolore reprehenderit repudiandae beatae
                      sit illum saepe alias asperiores, quis porro debitis ullam hic. Lorem ipsum
                      dolor it amet, consectetur adipisicing elit. Dicta ratione officia beatae
                      eveniet soluta sit veniam possimus non velit. Dolorem eaque natus quaerat
                      facere quo. Fugiat odit voluptatibus maxime neque!
                    </Typography>
                  </Box>
                </Box>
                <Box
                  sx={{
                    backgroundColor: 'white',
                    border: '1px solid ',
                    borderColor: 'divider',
                  }}
                  padding={2}
                  mt={2}
                >
                  <Typography variant="h6" color="Black">
                    Course Content
                  </Typography>
                  <Box
                    sx={{
                      marginTop: '2rem',
                      '& .MuiAccurdion-root.Mui-expanded': {
                        margin: '0',
                      },
                    }}
                  >
                    {course?.subtitles.length > 0 ? (
                      course.subtitles.map((subtitle, i) => (
                        <Accordion
                          key={i}
                          elevation={0}
                          sx={{
                            backgroundColor: 'grey.300',
                            borderTop: i === 0 ? '1px solid' : 'none',
                            borderBottom: '1px solid ',
                            borderRight: '1px solid ',
                            borderLeft: '1px solid ',
                            borderColor: 'divider',
                            '&  .MuiAccordionSummary-root': {
                              minHeight: '0',
                            },
                            '&  .MuiAccordionSummary-root.Mui-expanded': {
                              minHeight: '0',
                            },
                          }}
                        >
                          <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                            sx={{
                              '& .MuiAccordionSummary-content': {
                                margin: '0.5rem 0',
                              },
                              '&  .MuiAccordionSummary-content.Mui-expanded': {
                                margin: '0.5rem 0',
                              },
                              '&  .MuiAccordionSummary-content.Mui-expanded>P': {
                                transition: 'all 0.3s ease',
                                fontWeight: 'medium',
                              },
                            }}
                          >
                            <Typography>{subtitle.sTitle}</Typography>
                          </AccordionSummary>
                          <AccordionDetails sx={{ padding: '0' }}>
                            <List sx={{ padding: '0' }}>
                              {subtitle.lessons.length !== 0 ? (
                                subtitle.lessons.map((lesson, i) =>
                                  lesson.video ? (
                                    <ListItem
                                      key={i}
                                      sx={{
                                        borderTop: '1px solid',
                                        borderColor: 'divider',
                                      }}
                                    >
                                      <Typography>
                                        Lesson {i + 1}: {lesson.video.title}
                                      </Typography>
                                    </ListItem>
                                  ) : (
                                    <ListItem
                                      key={i}
                                      sx={{
                                        borderTop: '1px solid',
                                        borderColor: 'divider',
                                      }}
                                    >
                                      <Typography>Exercise: {lesson.exercise.title}</Typography>
                                    </ListItem>
                                  )
                                )
                              ) : (
                                <ListItem>
                                  <Typography>No Lessons Yet</Typography>
                                </ListItem>
                              )}
                            </List>
                          </AccordionDetails>
                        </Accordion>
                      ))
                    ) : (
                      <Typography variant="subtitle1" color="grey.600" textAlign="center">
                        No Subtitles Yet
                      </Typography>
                    )}
                  </Box>
                </Box>
                {!props.draft ? (
                  <Box
                    sx={{
                      backgroundColor: 'white',
                      border: '1px solid ',
                      borderColor: 'divider',
                    }}
                    padding={2}
                    mt={2}
                  >
                    <Reviews
                      reviews={reviews}
                      setReviews={setReviews}
                      rating={course?.rating}
                      user={user}
                    />
                  </Box>
                ) : null}
              </Grid>
              <Grid item xs={12} md={4}>
                <Box
                  sx={{
                    backgroundColor: 'white',
                    border: '1px solid ',
                    borderColor: 'divider',
                  }}
                  padding={2}
                >
                  <Typography variant="h6" color="black">
                    Course Features
                  </Typography>
                  <Box
                    sx={{
                      marginTop: '1rem',
                      backgroundColor: 'grey.300',
                      border: '1px solid ',
                      borderColor: 'divider',
                    }}
                  >
                    <List sx={{ padding: '0' }}>
                      <ListItem
                        sx={{
                          display: 'flex',
                          padding: '1rem',
                        }}
                      >
                        <Stack direction="row">
                          <Avatar
                            variant="square"
                            sx={{ marginRight: '1rem', width: 56, height: 56 }}
                            sizes="sm"
                          />
                          <Stack justifyContent="center">
                            <Link
                              fontSize="subtitle1"
                              sx={{ textDecoration: 'none' }}
                              color="secondary.main"
                              fontWeight="bold"
                              lineHeight="1.3rem"
                              href={`/instructors/${course?.instructor._id}`}
                            >
                              {course?.instructor.firstName} {course?.instructor.lastName}
                            </Link>
                            <Typography variant="body1" color="grey.700">
                              {course?.instructor.profession}
                            </Typography>
                          </Stack>
                        </Stack>
                      </ListItem>
                      <Divider variant="fullWidth" />
                      <ListItem sx={{ display: 'flex' }}>
                        <CircleIcon
                          sx={{
                            fontSize: '0.6rem',
                            marginRight: '1rem',
                            marginY: '0.7rem',
                            color: 'primary.main',
                          }}
                        />
                        <Typography variant="body2" color="grey.700">
                          Price
                        </Typography>
                        <Stack ml="auto">
                          <Stack direction="row">
                            {promotion ? (
                              <Typography variant="body2" color="grey.700" mr={1}>
                                {course?.price === 0
                                  ? 'Free'
                                  : currency
                                  ? `${
                                      Math.round(
                                        course?.price * currency.rate * (100 - promotion.amount)
                                      ) / 100
                                    } ${currency.code}`
                                  : `${
                                      Math.round(course?.price * (100 - promotion.amount)) / 100
                                    } USD`}
                              </Typography>
                            ) : null}
                            <Typography
                              variant="body2"
                              color={promotion ? 'grey.600' : 'grey.700'}
                              sx={{
                                textDecoration: promotion ? 'line-through' : 'none',
                              }}
                            >
                              {course?.price === 0
                                ? 'Free'
                                : currency
                                ? `${Math.round(course?.price * currency.rate * 100) / 100} ${
                                    currency.code
                                  }`
                                : `${course?.price}.00 USD`}
                            </Typography>
                          </Stack>
                          {promotion ? (
                            <Typography
                              variant="body2"
                              fontSize="0.8rem"
                              color="error.main"
                              width="100%"
                              textAlign="center"
                            >
                              Expires in {Math.floor(promotion.duration)} days{' '}
                              {Math.ceil((promotion.duration % 1) * 24)} hour
                            </Typography>
                          ) : null}
                        </Stack>
                      </ListItem>
                      <Divider variant="fullWidth" />
                      <ListItem sx={{ display: 'flex' }}>
                        <CircleIcon
                          sx={{
                            fontSize: '0.6rem',
                            marginRight: '1rem',
                            color: 'primary.main',
                            marginY: '0.7rem',
                          }}
                        />
                        <Typography variant="body2" color="grey.700">
                          Level
                        </Typography>
                        <Typography variant="body2" color="grey.700" ml="auto">
                          Beginner
                        </Typography>
                      </ListItem>
                      <Divider variant="fullWidth" />
                      <ListItem sx={{ display: 'flex' }}>
                        <CircleIcon
                          sx={{
                            fontSize: '0.6rem',
                            marginRight: '1rem',
                            color: 'primary.main',
                            marginY: '0.7rem',
                          }}
                        />
                        <Typography variant="body2" color="grey.700">
                          Duration
                        </Typography>
                        <Typography variant="body2" color="grey.700" ml="auto">
                          4 Weeks 3 Days
                        </Typography>
                      </ListItem>
                      <Divider variant="fullWidth" />
                      <ListItem sx={{ display: 'flex' }}>
                        <CircleIcon
                          sx={{
                            fontSize: '0.6rem',
                            marginRight: '1rem',
                            color: 'primary.main',
                            marginY: '0.7rem',
                          }}
                        />
                        <Typography variant="body2" color="grey.700">
                          Total Enrolled
                        </Typography>
                        <Typography variant="body2" color="grey.700" ml="auto">
                          1390
                        </Typography>
                      </ListItem>
                      <Divider variant="fullWidth" />
                      <ListItem sx={{ display: 'flex' }}>
                        <CircleIcon
                          sx={{
                            fontSize: '0.6rem',
                            marginRight: '1rem',
                            color: 'primary.main',
                            marginY: '0.7rem',
                          }}
                        />
                        <Typography variant="body2" color="grey.700">
                          Lessons
                        </Typography>
                        <Typography variant="body2" color="grey.700" ml="auto">
                          78 Lesson
                        </Typography>
                      </ListItem>
                    </List>
                    <Stack
                      padding={2}
                      direction="column"
                      alignItems="center"
                      justifyContent="center"
                    >
                      {owner && !props.draft ? (
                        <>
                          <PromotionModal
                            promotion={promotion}
                            setPromotion={setPromotion}
                            token={user.token}
                            id={id}
                          />
                          <ReportCourse id={id}></ReportCourse>
                          <Button
                            variant="contained"
                            color="error"
                            sx={{ width: '80%', mt: '1rem' }}
                            onClick={() => setOpenClose(true)}
                          >
                            <Typography color="grey.300">Close</Typography>
                          </Button>
                          <Modal
                            open={openClose}
                            onClose={() => setOpenClose(false)}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description"
                          >
                            <Box
                              sx={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                width: '350px',
                                bgcolor: 'background.paper',
                                boxShadow: 24,
                                p: 4,
                              }}
                            >
                              <Typography
                                id="modal-modal-title"
                                variant="h6"
                                textAlign="center"
                                component="h2"
                              >
                                Are you sure you want to close this course?
                              </Typography>
                              <Typography id="subtitle2" textAlign="center" sx={{ mt: 2 }}>
                                Students will no longer be able to enroll in this course.
                              </Typography>
                              <Stack
                                direction="row"
                                justifyContent="center"
                                alignItems="center"
                                mt={2}
                                spacing={2}
                              >
                                <Button variant="contained" color="error" onClick={handleClose}>
                                  Close
                                </Button>
                                <Button
                                  variant="outlined"
                                  color="primary"
                                  onClick={() => setOpenClose(false)}
                                >
                                  Cancel
                                </Button>
                              </Stack>
                            </Box>
                          </Modal>
                        </>
                      ) : enrolled && !props.draft ? (
                        <>
                          <Button
                            variant="contained"
                            color="secondary"
                            sx={{ width: '80%', marginTop: '1rem' }}
                            href={`/courses/${id}/learn`}
                          >
                            Open Course
                          </Button>
                          <ReportCourse id={id}></ReportCourse>
                        </>
                      ) : user?.type === 'corporate' ? (
                        <>
                          <Button
                            variant="contained"
                            color="secondary"
                            sx={{ width: '80%', marginTop: '1rem' }}
                          >
                            Request Access
                          </Button>
                        </>
                      ) : props.draft ? (
                        <>
                          <Button
                            variant="outlined"
                            color="success"
                            sx={{ width: '80%', mt: '1rem' }}
                            href={`/profile/draft/${course?._id}/edit`}
                          >
                            Edit Course
                          </Button>
                          <Button
                            variant="contained"
                            color="error"
                            sx={{ width: '80%', mt: '1rem' }}
                            onClick={() => setOpenDelete(true)}
                          >
                            <Typography color="grey.300">Delete</Typography>
                          </Button>
                          <Modal
                            open={openDelete}
                            onClose={() => setOpenDelete(false)}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description"
                          >
                            <Box
                              sx={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                width: '350px',
                                bgcolor: 'background.paper',
                                boxShadow: 24,
                                p: 4,
                              }}
                            >
                              <Typography
                                id="modal-modal-title"
                                variant="h6"
                                textAlign="center"
                                component="h2"
                              >
                                Are you sure you want to delete this course?
                              </Typography>
                              <Typography id="subtitle2" textAlign="center" sx={{ mt: 2 }}>
                                This action cannot be undone
                              </Typography>
                              <Stack
                                direction="row"
                                justifyContent="center"
                                alignItems="center"
                                mt={2}
                                spacing={2}
                              >
                                <Button variant="contained" color="error" onClick={handleDelete}>
                                  Delete
                                </Button>
                                <Button
                                  variant="outlined"
                                  color="primary"
                                  onClick={() => setOpenDelete(false)}
                                >
                                  Cancel
                                </Button>
                              </Stack>
                            </Box>
                          </Modal>
                        </>
                      ) : (
                        <PaymentButton
                          course={course}
                          currency={currency}
                          variant={'contained'}
                          sx={{ width: '80%', marginTop: '1rem' }}
                        />
                      )}

                      {!props.draft ? (
                        <Stack direction="row" mt={1} alignItems="center">
                          <ShareIcon
                            sx={{
                              fontSize: '1.2rem',
                              color: 'grey.700',
                              marginLeft: '1rem',
                            }}
                          />
                          <Typography variant="body2" color="grey.700">
                            Share Course
                          </Typography>
                        </Stack>
                      ) : null}
                    </Stack>
                  </Box>
                </Box>
                {enrolled &&
                reviews?.filter((review) => review.user._id === user._id).length === 0 &&
                !props.draft ? (
                  <ReviewForm setReviews={setReviews} course={course._id} token={user.token} />
                ) : null}
              </Grid>
            </Grid>
          </Container>
        </>
      ) : (
        <Spinner />
      )}
    </Box>
  );
}

export default ViewCourse;
