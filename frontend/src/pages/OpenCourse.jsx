import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
const FileDownload = require('js-file-download');
import axios from 'axios';
import userService from '../features/user/userService';
import Quiz from '../components/Quiz';
import YouTube from 'react-youtube';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close';
import '../styles/video.css';
import {
  Grid,
  Container,
  Typography,
  Box,
  Stack,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  TextField,
  Modal,
} from '@mui/material';
import { updateWatchedDuration } from '../features/user/userSlice';
import ReportCourse from '../components/ReportCourse';

function OpenCourse() {
  const [course, setCourse] = useState(null);
  const [video, setVideo] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [notes, setNotes] = useState('');
  const [completed, setCompleted] = useState(false);
  const { id } = useParams();
  let { user } = useSelector((state) => state.user);
  user = typeof user === 'string' ? JSON.parse(user) : user;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onEnd = async (event) => {
    const subtitle = course.subtitles[video.subtitle];
    const currentLesson = course.subtitles[video.subtitle].lessons[video.lesson];
    const { data } = event;
    if (data === 0) {
      const url = event.target.getVideoUrl().split('v=')[1].split('&')[0];

      if (video.lesson < subtitle.lessons.length - 1) {
        course.subtitles[video.subtitle].lessons[video.lesson + 1].video
          ? setVideo({
              video: course.subtitles[video.subtitle].lessons[video.lesson + 1].video,
              subtitle: video.subtitle,
              lesson: video.lesson + 1,
            })
          : openExercises({
              exercise: course.subtitles[video.subtitle].lessons[video.lesson + 1].exercise,
              subtitle: video.subtitle,
              lesson: video.lesson + 1,
            });
      } else if (video.subtitle < course.subtitles.length - 1) {
        setVideo({
          video: course.subtitles[video.subtitle + 1].lessons[0].video,
          subtitle: video.subtitle + 1,
          lesson: 0,
        });
      } else {
        setVideo({
          video: course.subtitles[0].lessons[0].video,
          subtitle: 0,
          lesson: 0,
        });
      }
      if (
        user.courses.filter(
          (course) => course._Id === id && !course.watchedLessons.includes(currentLesson.video._id)
        )
      ) {
        const data = {
          user,
          courseId: course._id,
          videoId: currentLesson.video._id,
        };
        dispatch(updateWatchedDuration(data)).then((res) => {
          const course = res.payload.courses.find((course) => course._id === id);
          if (course.completed) {
            setCompleted(true);
          }
        });
      }
    }
  };
  const openExercises = ({ exercise, subtitle, lesson }) => {
    setQuiz({ exercise, subtitle, lesson });
    setShowQuiz(true);
  };
  const nextExercise = () => {
    if (
      quiz.lesson < course.subtitles[quiz.subtitle].lessons.length - 1 &&
      course.subtitles[quiz.subtitle].lessons[quiz.lesson + 1].video
    ) {
      setVideo({
        video: course.subtitle[quiz.subtitle].lessons[quiz.lesson + 1].video,
        subtitle: quiz.subtitle,
        lesson: quiz.lesson + 1,
      });
      setQuiz(null);
      setShowQuiz(false);
    } else if (
      quiz.lesson < course.subtitles[quiz.subtitle].lessons.length - 1 &&
      course.subtitles[quiz.subtitle].lessons[quiz.lesson + 1].exercise
    ) {
      openExercises({
        exercise: course.subtitle[quiz.subtitle].lessons[quiz.lesson + 1].exercise,
        subtitle: quiz.subtitle,
        lesson: quiz.lesson + 1,
      });
    } else if (
      quiz.subtitle < course.subtitles.length - 1 &&
      course.subtitles[quiz.subtitle + 1].lessons[0]?.video
    ) {
      setVideo({
        video: course.subtitles[quiz.subtitle + 1].lessons[0].video,
        subtitle: quiz.subtitle + 1,
        lesson: 0,
      });
      setQuiz(null);
      setShowQuiz(false);
    } else {
      setVideo({
        video: course.subtitles[0].lessons[0].video,
        subtitle: 0,
        lesson: 0,
      });
      setQuiz(null);
      setShowQuiz(false);
    }
    if (
      user.courses.filter(
        (course) => course._Id === id && !course.watchedLessons.includes(quiz.exercise._id)
      )
    ) {
      const data = {
        user,
        courseId: course._id,
        exerciseId: quiz.exercise._id,
      };
      dispatch(updateWatchedDuration(data)).then((res) => {
        console.log(res);
        const course = res.payload.courses.filter((course) => course._id === id)[0];
        if (course.completed) {
          setCompleted(true);
        }
      });
    }
  };
  const savePDF = () => {
    axios({
      method: 'post',
      url: `/api/users/downloadNotes`,
      data: { notes, id },
      headers: { Authorization: `Bearer ${user.token}` },
      responseType: 'blob',
    }).then((res) => {
      FileDownload(res.data, 'notes.pdf');
      setNotes('');
    });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!user) {
      navigate('/courses' + id);
    } else if (user && user.courses.filter((course) => course._id === id).length === 0) {
      navigate('/courses' + id);
    } else {
      axios.get(`/api/courses/${id}`).then((res) => {
        user.courses.map((userCourse) => {
          if (userCourse._id === id) {
            if (userCourse.watchedLessons.length === 0) {
              setVideo({
                video: res.data.subtitles[0].lessons[0].video,
                subtitle: 0,
                lesson: 0,
              });
            } else {
              const video = userCourse.watchedLessons[userCourse.watchedLessons.length - 1];
              res.data.subtitles.map((sub, i) => {
                sub.lessons.map((lesson, j) => {
                  if (lesson.video && lesson.video._id === video) {
                    setVideo({ video: lesson.video, subtitle: i, lesson: j });
                  }
                });
              });
            }
          }
        });
        setCourse(res.data);
      });
    }
  }, []);
  return (
    <Container
      maxWidth="lg"
      sx={{
        display: 'flex',
        flexGrow: '1',
        marginY: '1rem',
        backgroundColor: 'white',
      }}
    >
      <Modal
        open={completed}
        onClose={() => setCompleted(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { sm: '80%', md: '52%' },
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
          }}
        >
          <Box
            id="modal-modal-title"
            sx={{
              display: 'flex',
              flexDirection: 'row',
              width: '100%',
            }}
          >
            <Typography variant="h6" component="h2">
              Congratulations!
            </Typography>
            <Button
              onClick={() => setCompleted(false)}
              sx={{
                ml: 'auto',
              }}
            >
              <CloseIcon sx={{ color: 'grey.700' }} />
            </Button>
          </Box>
          <Box id="modal-modal-description" sx={{ mt: 2 }}>
            <Typography variant="body1" component="p">
              You have completed this course! Please check your email for your certificate. or
              download it here.
            </Typography>
          </Box>
        </Box>
      </Modal>

      <Grid container sx={{ display: 'flex', flexGrow: '1' }}>
        <Grid
          item
          xs={12}
          md={9.5}
          sx={{ display: 'flex', flexDirection: 'column', flexGrow: '1' }}
        >
          {showQuiz ? (
            <Quiz quiz={quiz.exercise} nextExercise={nextExercise} />
          ) : (
            <YouTube
              videoId={video ? video.video.url : ''}
              iframeClassName={'lesson'}
              onEnd={onEnd}
              className={'lesson-container'}
            />
          )}
          <Box
            sx={{
              flexGrow: '1',
              backgroundColor: 'white',
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Stack direction="row" padding={2}>
              <Typography variant="h6">Notes</Typography>
              <Button
                variant="contained"
                sx={{ ml: 'auto', bgcolor: 'success.main' }}
                onClick={savePDF}
              >
                Save As PDF
              </Button>
              <Box sx={{ width: '25%', height: '40px', ml: '1rem', mt: '-1rem' }}>
                <ReportCourse id={id}></ReportCourse>
              </Box>
            </Stack>
            <TextField
              id="outlined-multiline-static"
              multiline
              rows={4}
              variant="outlined"
              fullWidth
              placeholder="Type your notes here..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              sx={{ p: '1rem' }}
            />
          </Box>
        </Grid>
        <Grid
          item
          xs={12}
          md={2.5}
          sx={{
            flexGrow: '1',
            backgroundColor: 'white',
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Box>
            <Typography variant="h6" padding={2}>
              Course Content
            </Typography>
            <Box>
              {course?.subtitles?.map((subtitle, i) => (
                <Accordion
                  key={i}
                  elevation={0}
                  sx={{
                    backgroundColor: 'white',
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <Typography>{subtitle.sTitle}</Typography>
                  </AccordionSummary>
                  <AccordionDetails sx={{ padding: '0 1rem' }}>
                    <List>
                      {subtitle.lessons.length !== 0 ? (
                        subtitle.lessons.map((lesson, j) =>
                          lesson.video ? (
                            <ListItem
                              key={j}
                              component="button"
                              sx={{
                                border: 'none',
                                borderTop: j !== 0 ? '1px solid' : 'none',

                                borderColor: 'divider',
                                backgroundColor: 'white',
                                cursor: 'pointer',

                                '&:hover': {
                                  backgroundColor: 'grey.300',
                                },
                              }}
                              onClick={() => {
                                setVideo({
                                  video: lesson.video,
                                  subtitle: i,
                                  lesson: j,
                                });
                                setShowQuiz(false);
                                setQuiz(null);
                              }}
                            >
                              Lesson {j + 1}: {lesson.video.title}
                            </ListItem>
                          ) : (
                            <ListItem
                              key={j}
                              component="button"
                              sx={{
                                border: 'none',
                                borderLeft: 'none',
                                borderRight: 'none',
                                borderColor: 'divider',
                                backgroundColor: 'white',
                                cursor: 'pointer',

                                '&:hover': {
                                  backgroundColor: 'grey.300',
                                },
                              }}
                              onClick={() => {
                                openExercises({
                                  exercise: lesson.exercise,
                                  subtitle: i,
                                  lesson: j,
                                });
                              }}
                            >
                              Exercise: {lesson.exercise.title}
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
              ))}
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}

export default OpenCourse;
