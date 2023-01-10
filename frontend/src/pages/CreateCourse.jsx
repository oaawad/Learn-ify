import BasicInfo from '../components/BasicInfo';
import CurriculumInfo from '../components/CurriculumInfo';
import {
  Container,
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  TextField,
  Card,
  CardMedia,
  Stack,
  IconButton,
} from '@mui/material';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import PermMediaOutlinedIcon from '@mui/icons-material/PermMediaOutlined';
import AppRegistrationOutlinedIcon from '@mui/icons-material/AppRegistrationOutlined';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
const steps = ['Basic', 'Curriculum', 'Media', 'Publish'];

function CreateCourse(props) {
  let { user } = useSelector((state) => state.user);
  typeof user == 'string' ? (user = JSON.parse(user)) : user;
  const [activeStep, setActiveStep] = useState(0);
  const [subjects, setSubjects] = useState([]);
  const [basicInfo, setBasicInfo] = useState({});
  const [subtitles, setSubtitles] = useState([]);
  const [preview, setPreview] = useState(null);
  const [subError, setSubError] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    getValues,
    setValue,
  } = useForm();
  const { id } = useParams();

  const navigate = useNavigate();
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  const isStepFailed = (step) => {
    return step === 1 && subError;
  };

  const onSubmitMedia = (data) => {
    setPreview(data.youtubeUrl.split('watch?v=')[1].split('&')[0]);
    handleNext();
  };
  const onSubmitDraft = async () => {
    const course = {
      ...basicInfo,
      subtitles,
      preview,
      status: 'draft',
    };
    course.subject = subjects[course.subject - 1]._id;
    course.level === '1'
      ? (course.level = 'Beginner')
      : course.level === '2'
      ? (course.level = 'Intermediate')
      : (course.level = 'Advanced');
    if (props.edit) {
      await axios
        .patch(`/api/courses/${id}`, course, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
        .then((res) => {
          toast.success('Course updated successfully');
          navigate(`/profile/draft/${id}`);
        });
    } else {
      await axios
        .post('/api/courses', course, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
        .then((res) => {
          toast.success('Course created successfully');
        });
    }
    navigate(`/profile`);
  };
  const onSubmitPublish = async () => {
    if (subtitles.length === 0) {
      setSubError(true);
      return;
    } else {
      subtitles.map((sub) => {
        if (sub.lessons.length === 0) {
          setSubError(true);
          return;
        }
      });
      setSubError(false);
      const course = {
        ...basicInfo,
        subtitles,
        preview,
        instructor: user._id,
        status: 'public',
      };
      course.subject = subjects[course.subject - 1]._id;
      course.level === '1'
        ? (course.level = 'Beginner')
        : course.level === '2'
        ? (course.level = 'Intermediate')
        : (course.level = 'Advanced');
      await axios
        .post('/api/courses', course, {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        })
        .then((res) => {
          toast.success('Course created successfully');
        });
      navigate(`/profile`);
    }
  };
  const getCourse = async () => {
    await axios
      .get(`/api/courses/draft/${id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        setBasicInfo({
          title: res.data.title,
          description: res.data.description,
          level:
            res.data.level === 'Beginner' ? '1' : res.data.level === 'Intermediate' ? '2' : '3',
          category: res.data.category,
          price: res.data.price,
        });
        setSubtitles(res.data.subtitles);
        setPreview(res.data.preview);
        setValue('youtubeUrl', `https://www.youtube.com/watch?v=${res.data.preview}`);
      });
  };
  const getSubjects = async () => {
    await axios.get('/api/courses/subjects').then((res) => {
      setSubjects(res.data);
    });
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!user || user.type !== 'instructor') {
      navigate('/login');
    }
    if (props.edit) {
      getCourse();
    }
    getSubjects();
  }, []);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',

        flexGrow: '1',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          maxWidth: '100%',
          backgroundColor: 'white',
          marginY: '2rem',
        }}
      >
        <Typography variant="h6" fontWeight="bold" color="secondary.main">
          Create New Course{' '}
        </Typography>
      </Box>
      <Container maxWidth="md" sx={{ flexGrow: '1', display: 'flex' }}>
        <Box
          sx={{
            width: '100%',
            flexGrow: '1',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Stepper activeStep={activeStep}>
            {steps.map((label, index) => {
              const stepProps = {};
              const labelProps = {};
              if (isStepFailed(index)) {
                labelProps.optional = (
                  <Typography variant="caption" color="error">
                    Please add at least one subtitle and lesson in each subtitle
                  </Typography>
                );

                labelProps.error = true;
              }
              return (
                <Step key={label} {...stepProps}>
                  <StepLabel {...labelProps}>{label}</StepLabel>
                </Step>
              );
            })}
          </Stepper>

          {activeStep === steps.length - 1 ? (
            <Box sx={{ flexGrow: '1', display: 'flex', flexDirection: 'column' }}>
              <Box
                sx={{
                  my: '2rem',
                  ml: '1rem',
                }}
              >
                <Typography variant="h5" sx={{ fontWeight: 'bold', display: 'flex' }}>
                  <FileUploadOutlinedIcon
                    sx={{ mr: '1rem', alignSelf: 'center' }}
                    fontSize="large"
                  />{' '}
                  Submit
                </Typography>
                <Stack
                  sx={{
                    mt: '2rem',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                    <AppRegistrationOutlinedIcon fontSize="inherit" />
                  </Typography>
                  <Typography variant="body1" textAlign="center" sx={{ mt: '1rem' }}>
                    Your course is in a draft state. Students cannot view, purchase or enroll in
                    this course. For students that are already enrolled, this course will not appear
                    on their student Dashboard.
                  </Typography>
                </Stack>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row',
                  pb: 2,
                  mt: 'auto',
                }}
              >
                <Button color="inherit" onClick={handleBack} sx={{ ml: 1 }}>
                  Back
                </Button>
                <Stack direction="row" spacing={2} sx={{ ml: 'auto' }}>
                  <Button onClick={onSubmitDraft} variant="outlined">
                    Save To Draft
                  </Button>

                  <Button onClick={onSubmitPublish} variant="contained">
                    Make Public
                  </Button>
                </Stack>
              </Box>
            </Box>
          ) : (
            <Box sx={{ flexGrow: '1', display: 'flex', flexDirection: 'column' }}>
              {activeStep === 0 && (
                <BasicInfo
                  basicInfo={basicInfo}
                  setBasicInfo={setBasicInfo}
                  setActiveStep={setActiveStep}
                  activeStep={activeStep}
                  subjects={subjects}
                />
              )}
              {activeStep === 1 && (
                <>
                  <CurriculumInfo subtitles={subtitles} setSubtitles={setSubtitles} />
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'row',
                      pb: 2,
                      mt: 'auto',
                    }}
                  >
                    <Button color="inherit" onClick={handleBack} sx={{ mr: 1 }}>
                      Back
                    </Button>
                    <Button onClick={handleNext} sx={{ ml: 'auto' }}>
                      Next
                    </Button>
                  </Box>
                </>
              )}
              {activeStep === 2 && (
                <Box
                  sx={{
                    mt: '2rem',
                    ml: '1rem',
                    flexGrow: '1',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <Typography variant="h5" sx={{ fontWeight: 'bold', display: 'flex' }}>
                    <PermMediaOutlinedIcon sx={{ mr: '1rem', alignSelf: 'center' }} /> Course
                    Preview
                  </Typography>
                  <form
                    style={{ flexGrow: '1', display: 'flex', flexDirection: 'column' }}
                    onSubmit={handleSubmit(onSubmitMedia)}
                  >
                    <Box sx={{ my: '2rem' }}>
                      <TextField
                        id="outlined-basic"
                        label="Youtube Video URL"
                        variant="outlined"
                        helperText={
                          errors?.youtubeUrl
                            ? errors?.youtubeUrl?.message
                            : 'Must be a valid Youtube URL'
                        }
                        fullWidth
                        {...register('youtubeUrl', {
                          required: 'The Preview Youtube link is required',
                          pattern: {
                            value:
                              /http(?:s?):\/\/(?:www\.)?youtu(?:be\.com\/watch\?v=|\.be\/)([\w\-\_]*)(&(amp;)?‌​[\w\?‌​=]*)?/,
                            message: 'invalid Youtube link',
                          },
                        })}
                        error={errors?.youtubeUrl ? true : false}
                      />
                      <Box sx={{ mt: 'auto' }}>
                        <Stack direction="row">
                          <Typography
                            variant="body2"
                            sx={{ mt: '1rem', mb: '0.5rem', fontWeight: 'medium' }}
                          >
                            Course Preview Image
                          </Typography>
                          <IconButton
                            sx={{ ml: 'auto' }}
                            color="primary"
                            aria-label="upload picture"
                            component="label"
                            onClick={() => {
                              if (!getValues('youtubeUrl').includes('watch?v=')) {
                                setError('youtubeUrl', {
                                  type: 'custom',
                                  message: 'invalid Youtube link',
                                });
                              }
                              setPreview(
                                getValues('youtubeUrl').split('watch?v=')[1].split('&')[0]
                              );
                            }}
                          >
                            <PhotoCamera />
                          </IconButton>
                        </Stack>
                        <Card sx={{ width: '60%' }}>
                          <CardMedia
                            height={270}
                            component="img"
                            image={
                              preview
                                ? `https://img.youtube.com/vi/${preview}/hqdefault.jpg`
                                : 'https://britz.mcmaster.ca/images/placeholder.png'
                            }
                          ></CardMedia>
                        </Card>
                      </Box>
                    </Box>

                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        pb: 2,
                        mt: 'auto',
                      }}
                    >
                      <Button color="inherit" onClick={handleBack} sx={{ mr: 1 }}>
                        Back
                      </Button>
                      <Button type="submit" sx={{ ml: 'auto' }}>
                        Next
                      </Button>
                    </Box>
                  </form>
                </Box>
              )}
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
}

export default CreateCourse;
