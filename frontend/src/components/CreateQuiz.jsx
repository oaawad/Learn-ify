import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  Typography,
  Box,
  Grid,
  Button,
  Radio,
  Modal,
  TextField,
  IconButton,
  Stack,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
function CreateExercise(props) {
  const [questions, setQuestions] = useState(!props.edit ? [] : props.exercise.questions);
  const [currCorrect, setCurrCorrect] = useState(0);

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
    setError,
    clearErrors,
    setValue: setValue2,
  } = useForm();

  const onSubmitExercise = (data) => {
    if (questions.length === 0) {
      setError('noQuestions', { type: 'required', message: 'Please add at least one question' });
    } else {
      const exercise = {
        title: data.title,
        questions: questions,
        description: data.description,
      };
      if (!props.edit) {
        props.setSubtitles((prev) => {
          const newSubtitles = [...prev];
          newSubtitles[props.expanded].lessons.push({ exercise: exercise });
          return newSubtitles;
        });
        setValue('title', '');
        setValue('description', '');
        setQuestions([]);
      } else {
        props.setSubtitles((prev) => {
          const newSubtitles = [...prev];
          newSubtitles[props.expanded].lessons[props.lessonIndex].exercise = exercise;
          return newSubtitles;
        });
      }
      setCurrCorrect(0);
      props.setOpenExercise(false);
    }
  };
  const onSubmitQuestion = (data) => {
    if (currCorrect === 0) {
      setError('noCorrect', {
        type: 'required',
        message: 'Please select at least one correct answer',
      });
    } else {
      setQuestions((prev) => {
        return [
          ...prev,
          {
            question: data.question,
            answers: [data.answer1, data.answer2, data.answer3, data.answer4],
            correctAnswer: currCorrect,
          },
        ];
      });
      setCurrCorrect(0);
      setValue2('question', '');
      setValue2('answer1', '');
      setValue2('answer2', '');
      setValue2('answer3', '');
      setValue2('answer4', '');
    }
  };
  const deleteQuestion = (index) => {
    setQuestions((prev) => {
      const newQuestions = [...prev];
      newQuestions.splice(index, 1);
      return newQuestions;
    });
  };
  useEffect(() => {
    if (props.edit) {
      setValue('title', props.exercise.title);
      setValue('description', props.exercise.description);
    } else {
      setValue('title', '');
      setValue('description', '');
    }
  }, []);
  return (
    <Modal
      open={props.openExercise}
      onClose={() => props.setOpenExercise(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '60%',
          bgcolor: 'background.paper',
          boxShadow: 24,
          overflow: 'scroll',
          height: '95%',
          p: 4,
        }}
      >
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Add Exercise
        </Typography>
        <form onSubmit={handleSubmit2(onSubmitQuestion)}>
          <Box>
            <TextField
              id="outlined-basic"
              label="Question"
              variant="outlined"
              fullWidth
              {...register2(
                'question',
                { required: true },
                {
                  onChange: (e) => {
                    clearErrors('noQuestions');
                  },
                }
              )}
              sx={{ mt: '1rem' }}
              error={errors2?.question || errors2?.noQuestions ? true : false}
              helperText={
                (errors2?.question && 'Question is required') ||
                (errors2?.noQuestions && 'Please add at least one question')
              }
            />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Stack direction="row">
                  <Radio
                    value={1}
                    checked={currCorrect === 1}
                    onClick={() => setCurrCorrect(1) & clearErrors('noCorrect')}
                  />
                  <TextField
                    id="outlined-basic"
                    label="Answer 1"
                    variant="outlined"
                    fullWidth
                    {...register2('answer1', { required: true })}
                    sx={{ mt: '1rem' }}
                    error={errors2?.answer1 || errors2.noCorrect ? true : false}
                    helperText={
                      (errors2?.answer1 && 'Answer 1 is required') ||
                      (errors2?.noCorrect && 'Please select the correct answer')
                    }
                  />
                </Stack>
              </Grid>
              <Grid item xs={6}>
                <Stack direction="row">
                  <Radio
                    value={2}
                    checked={currCorrect === 2}
                    onClick={() => setCurrCorrect(2) & clearErrors('noCorrect')}
                  />
                  <TextField
                    id="outlined-basic"
                    label="Answer 2"
                    variant="outlined"
                    fullWidth
                    {...register2('answer2', { required: true })}
                    sx={{ mt: '1rem' }}
                    error={errors2?.answer2 || errors2.noCorrect ? true : false}
                    helperText={
                      (errors2?.answer2 && 'Answer 2 is required') ||
                      (errors2?.noCorrect && 'Please select the correct answer')
                    }
                  />
                </Stack>
              </Grid>
              <Grid item xs={6}>
                <Stack direction="row">
                  <Radio
                    value={3}
                    checked={currCorrect === 3}
                    onClick={() => setCurrCorrect(3) & clearErrors('noCorrect')}
                  />
                  <TextField
                    id="outlined-basic"
                    label="Answer 3"
                    variant="outlined"
                    fullWidth
                    {...register2('answer3', { required: true })}
                    sx={{ mt: '1rem' }}
                    error={errors2?.answer3 || errors2.noCorrect ? true : false}
                    helperText={
                      (errors2?.answer3 && 'Answer 3 is required') ||
                      (errors2?.noCorrect && 'Please select the correct answer')
                    }
                  />
                </Stack>
              </Grid>
              <Grid item xs={6}>
                <Stack direction="row">
                  <Radio
                    value={4}
                    checked={currCorrect === 4}
                    onClick={() => setCurrCorrect(4) & clearErrors('noCorrect')}
                  />
                  <TextField
                    id="outlined-basic"
                    label="Answer 4"
                    variant="outlined"
                    fullWidth
                    {...register2('answer4', { required: true })}
                    sx={{ mt: '1rem' }}
                    error={errors2?.answer4 || errors2.noCorrect ? true : false}
                    helperText={
                      (errors2?.answer4 && 'Answer 4 is required') ||
                      (errors2?.noCorrect && 'Please select the correct answer')
                    }
                  />
                </Stack>
              </Grid>
            </Grid>
            <Stack direction="row" sx={{ mt: '1rem' }}>
              <Typography variant="h6">Questions</Typography>
              <Button type="submit" sx={{ ml: 'auto' }} variant="contained">
                Add Question
              </Button>
            </Stack>
            {questions ? (
              <Box sx={{ mt: '1rem' }}>
                <List>
                  {questions.map((q, i) => (
                    <ListItem key={i}>
                      <ListItemText
                        primary={`Question ${i + 1}: ${q.question}`}
                        secondary={`Correct Answer: ${q.answers[q.correctAnswer - 1]}`}
                      />
                      <Button sx={{ color: 'error.main' }} onClick={() => deleteQuestion(i)}>
                        <DeleteOutlineOutlinedIcon />
                      </Button>
                    </ListItem>
                  ))}
                </List>
              </Box>
            ) : (
              <Box sx={{ mt: '1rem' }}>
                <Typography variant="h6" textAlign="center">
                  No Questions
                </Typography>
              </Box>
            )}
          </Box>
        </form>
        <form onSubmit={handleSubmit(onSubmitExercise)}>
          <TextField
            id="outlined-basic"
            label="Exercise Title"
            variant="outlined"
            fullWidth
            {...register('title', { required: true })}
            sx={{ mt: '1rem' }}
            error={errors?.title ? true : false}
            helperText={errors?.title && 'Exercise Title is required'}
          />
          <TextField
            id="outlined-basic"
            label="Exercise Description"
            variant="outlined"
            multiline
            rows={3}
            fullWidth
            {...register('description', { required: true })}
            sx={{ mt: '1rem' }}
            error={errors?.description ? true : false}
            helperText={errors?.description && 'Exercise description is required'}
          />

          <Button type="submit" sx={{ mt: '1rem' }} variant="contained">
            Create Exercise
          </Button>
        </form>
      </Box>
    </Modal>
  );
}

export default CreateExercise;
