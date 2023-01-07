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
  Paper,
} from '@mui/material';
import SummarizeOutlinedIcon from '@mui/icons-material/SummarizeOutlined';
import AppRegistrationOutlinedIcon from '@mui/icons-material/AppRegistrationOutlined';
import FileUploadOutlinedIcon from '@mui/icons-material/FileUploadOutlined';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import ReportCategory from '../components/ReportCategory';
const steps = ['Basic', 'Curriculum', 'Media', 'Publish'];

function Report(props) {
  let { user } = useSelector((state) => state.user);
  let { courseid } = useParams();
  typeof user == 'string' ? (user = JSON.parse(user)) : user;
  const [activeStep, setActiveStep] = useState(0);
  const [subjects, setSubjects] = useState([]);
  const [reportInfo, setReportInfo] = useState({});
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

  // functions

  // Send Report Info To API from here

  const onSubmitPublish = async () => {
    setSubError(false);
    const report = {
      ...reportInfo,
      uid: user._id,
      cid: courseid,
    };
    await axios
      .post(`/api/ticket/issue/${id}`, report, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
      .then((res) => {
        toast.success('Report Sent Successfully');
      });
    navigate(`/Support`);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!user) {
      navigate('/login');
    }
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
        <Typography variant="h6" fontWeight="bold" color="error">
          Report Issue{' '}
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
          {activeStep === 1 ? (
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
                <Paper elevation={3} sx={{ mt: '3rem', height: '100%' }}>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 'bold', display: 'flex', ml: '1.3rem', mt: '1rem' }}
                  >
                    {reportInfo?.category}
                  </Typography>
                  <Typography
                    variant="h7"
                    sx={{ display: 'flex', ml: '2rem', mt: '4.5rem', maxWidth: '90%' }}
                  >
                    {reportInfo?.description}
                  </Typography>
                </Paper>
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
                  {!props.edit && (
                    <Button onClick={onSubmitPublish} variant="contained">
                      Send Report
                    </Button>
                  )}
                </Stack>
              </Box>
            </Box>
          ) : (
            <Box sx={{ flexGrow: '1', display: 'flex', flexDirection: 'column' }}>
              {activeStep === 0 && (
                <ReportCategory
                  reportInfo={reportInfo}
                  setReportInfo={setReportInfo}
                  setActiveStep={setActiveStep}
                  activeStep={activeStep}
                  subjects={subjects}
                />
              )}
              {/* {activeStep === 1 && (
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
                                        <SummarizeOutlinedIcon sx={{ mr: '1rem', alignSelf: 'center' }} /> Report
                                        Preview
                                    </Typography>
                                    <form
                                        style={{ flexGrow: '1', display: 'flex', flexDirection: 'column' }}
                                        onSubmit={handleSubmit(onSubmitMedia)}
                                    >
                                        <Paper elevation={3} sx={{ mt: '3rem', height: '70%' }}>

                                            <Typography variant="h6" sx={{ fontWeight: 'bold', display: 'flex', ml: '1.3rem', mt: '1rem' }}>
                                                {reportInfo?.category}
                                            </Typography>
                                            <Typography variant="h7" sx={{ display: 'flex', ml: '2rem', mt: '6rem', maxWidth: '90%' }}>
                                                {reportInfo?.description}
                                            </Typography>
                                        </Paper>
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
                            )} */}
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  );
}

export default Report;
