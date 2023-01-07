import React from 'react';
import { useForm } from 'react-hook-form';
import {
  Box,
  Modal,
  Typography,
  Stack,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  List,
  ListItem,
} from '@mui/material';
import CollectionsBookmarkOutlinedIcon from '@mui/icons-material/CollectionsBookmarkOutlined';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import CreateQuiz from './CreateQuiz';

function CurriculumInfo(props) {
  const [expanded, setExpanded] = React.useState(false);
  const [openSection, setOpenSection] = React.useState(false);
  const [openVideo, setOpenVideo] = React.useState(false);
  const [openExercise, setOpenExercise] = React.useState(false);
  const [openEditExercise, setOpenEditExercise] = React.useState(false);
  const [editVideo, setEditVideo] = React.useState(null);
  const [editSection, setEditSection] = React.useState(null);
  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();
  const {
    register: register2,
    handleSubmit: handleSubmit2,
    formState: { errors: errors2 },
    setValue: setValue2,
  } = useForm();

  const onSubmitSec = (data) => {
    if (editSection === null) {
      props.setSubtitles([...props.subtitles, { sTitle: data.sTitle, lessons: [] }]);
    } else {
      props.setSubtitles((prev) => {
        let newSubtitles = [...prev];
        newSubtitles[editSection].sTitle = data.sTitle;
        return newSubtitles;
      });
      setEditSection(null);
    }
    setOpenSection(false);
  };

  const onSubmitVideo = (data) => {
    const video = {
      title: data.vTitle,
      url: data.vUrl.split('watch?v=')[1].split('&')[0],
    };
    if (editVideo === null) {
      props.setSubtitles((prev) => {
        const newSubtitles = [...prev];
        const exIndex = newSubtitles[expanded].lessons.map((lesson, i) => {
          if (lesson.exercise) {
            return i;
          }
        });
        if (exIndex.length > 0 && exIndex[0] !== undefined) {
          newSubtitles[expanded].lessons.splice(exIndex[0], 0, { video: video });
        } else {
          newSubtitles[expanded].lessons.push({ video: video });
        }
        return newSubtitles;
      });
    } else {
      props.setSubtitles((prev) => {
        prev[expanded].lessons[editVideo].video = video;
        return [...prev];
      });
      setEditVideo(null);
    }
    setValue2('vTitle', '');
    setValue2('vUrl', '');
    setOpenVideo(false);
  };

  const deleteLesson = (index) => {
    props.setSubtitles((prev) => {
      const newSubtitles = [...prev];
      newSubtitles[expanded].lessons.splice(index, 1);
      return newSubtitles;
    });
  };
  const editVid = (index) => {
    setEditVideo(index);
    setValue2('vTitle', props.subtitles[expanded].lessons[index].video.title);
    setValue2(
      'vUrl',
      `https://www.youtube.com/watch?v=${props.subtitles[expanded].lessons[index].video.url}`
    );
    setOpenVideo(true);
  };
  const editSec = (index) => {
    setEditSection(index);
    setValue('sTitle', props.subtitles[index].sTitle);
    setOpenSection(true);
  };
  const deleteSec = (index) => {
    props.setSubtitles((prev) => {
      const newSubtitles = [...prev];
      newSubtitles.splice(index, 1);
      return newSubtitles;
    });
  };
  React.useEffect(() => {
    if (openVideo === false) {
      setValue2('vTitle', '');
      setValue2('vUrl', '');
    }
    if (openSection === false) {
      setValue('sTitle', '');
    }
  }, [openVideo, openSection]);

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <Box
      sx={{
        my: '2rem',
        ml: '1rem',
      }}
    >
      <Stack direction="row">
        <Typography variant="h5" sx={{ fontWeight: 'bold', display: 'flex' }}>
          <CollectionsBookmarkOutlinedIcon sx={{ mr: '1rem', alignSelf: 'center' }} /> Curriculum
        </Typography>
        <Button sx={{ ml: 'auto' }} variant="outlined" onClick={() => setOpenSection(true)}>
          <AddCircleOutlineOutlinedIcon sx={{ mr: '0.5rem', alignSelf: 'center' }} /> Add Section
        </Button>
        <Modal
          open={openSection}
          onClose={() => setOpenSection(false)}
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
              Add Section
            </Typography>
            <form onSubmit={handleSubmit(onSubmitSec)}>
              <TextField
                id="outlined-basic"
                label="Section Title"
                variant="outlined"
                fullWidth
                {...register('sTitle', { required: true })}
                sx={{ mt: '1rem' }}
                error={errors?.sTitle ? true : false}
                helperText={errors?.sTitle && 'Section title is required'}
              />
              <Button type="submit" sx={{ mt: '1rem' }} variant="contained">
                Add Section
              </Button>
            </form>
          </Box>
        </Modal>
      </Stack>
      <Box sx={{ my: '2rem' }}>
        {props.subtitles.length > 0 ? (
          props.subtitles.map((subtitle, i) => (
            <Stack direction="row" alignItems="flex-start" key={i}>
              <Accordion
                elevation={0}
                expanded={expanded === i}
                onChange={handleChange(i)}
                sx={{
                  width: '100%',
                  backgroundColor: 'white',
                  borderTop: i === 0 || expanded === i ? '1px solid' : 'none',
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
                      margin: '0.7rem 0',
                    },
                    '&  .MuiAccordionSummary-content.Mui-expanded': {
                      margin: '0.7rem 0',
                    },
                    '&  .MuiAccordionSummary-content.Mui-expanded>P': {
                      transition: 'all 0.3s ease',
                      fontWeight: 'medium',
                    },
                  }}
                >
                  <Typography>
                    Section {i + 1}: {subtitle.sTitle}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ px: '1rem', py: '0' }}>
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

                            <Button
                              sx={{ minWidth: '0', ml: 'auto', color: 'secondary.main' }}
                              onClick={() => editVid(i)}
                            >
                              <EditOutlinedIcon fontSize="small" />
                            </Button>
                            <Button
                              sx={{ minWidth: '0', color: 'error.main' }}
                              onClick={() => deleteLesson(i)}
                            >
                              <DeleteOutlineOutlinedIcon fontSize="small" />
                            </Button>
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
                            <Button
                              sx={{ ml: 'auto', minWidth: '0', color: 'secondary.main' }}
                              onClick={() => setOpenEditExercise(true)}
                            >
                              <EditOutlinedIcon fontSize="small" />
                            </Button>
                            <CreateQuiz
                              setSubtitles={props.setSubtitles}
                              setOpenExercise={setOpenEditExercise}
                              openExercise={openEditExercise}
                              expanded={expanded}
                              exercise={lesson.exercise}
                              edit={true}
                              lessonIndex={i}
                            />
                            <Button
                              sx={{ minWidth: '0', color: 'error.main' }}
                              onClick={() => deleteLesson(i)}
                            >
                              <DeleteOutlineOutlinedIcon fontSize="small" />
                            </Button>
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
              <Button
                sx={{ minWidth: '0', color: 'secondary.main', mt: '0.5rem', ml: '0.3rem' }}
                onClick={() => editSec(i)}
              >
                <EditOutlinedIcon fontSize="small" />
              </Button>
              <Button
                sx={{ minWidth: '0', color: 'error.main', mt: '0.5rem' }}
                onClick={() => deleteSec(i)}
              >
                <DeleteOutlineOutlinedIcon fontSize="small" />
              </Button>
            </Stack>
          ))
        ) : (
          <Typography variant="body1" textAlign="center" color="grey.600">
            No Sections Added Yet
          </Typography>
        )}
        <Button
          variant="contained"
          sx={{ bgcolor: 'secondary.main', mr: '0.5rem', mt: '1rem' }}
          disabled={expanded === false}
          onClick={() => setOpenVideo(true)}
        >
          Add Video
        </Button>
        <Modal
          open={openVideo}
          onClose={() => setOpenVideo(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '50%',
              bgcolor: 'background.paper',
              boxShadow: 24,
              p: 4,
            }}
          >
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Add Video
            </Typography>
            <form onSubmit={handleSubmit2(onSubmitVideo)}>
              <TextField
                id="outlined-basic"
                label="Video Title"
                variant="outlined"
                fullWidth
                {...register2('vTitle', { required: true })}
                sx={{ mt: '1rem' }}
                error={errors2?.vTitle ? true : false}
                helperText={errors2?.vTitle && 'Video Title is required'}
              />
              <TextField
                id="outlined-basic"
                label="Youtube Video url"
                variant="outlined"
                fullWidth
                {...register2('vUrl', { required: true })}
                sx={{ mt: '1rem' }}
                error={errors2?.vUrl ? true : false}
                helperText={errors2?.vUrl && 'Youtube Url is required'}
              />
              <Button type="submit" sx={{ mt: '1rem' }} variant="contained">
                Add video
              </Button>
            </form>
          </Box>
        </Modal>
        <Button
          variant="contained"
          sx={{ bgcolor: 'secondary.main', mt: '1rem' }}
          disabled={expanded === false}
          onClick={() => setOpenExercise(true)}
        >
          Add Exercise
        </Button>
        <CreateQuiz
          setSubtitles={props.setSubtitles}
          setOpenExercise={setOpenExercise}
          openExercise={openExercise}
          expanded={expanded}
        />
      </Box>
    </Box>
  );
}

export default CurriculumInfo;
