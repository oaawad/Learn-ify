import { useState, useMemo } from 'react';
import QuestionCard from './QuestionCard';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Box,
  Grid,
  Button,
  CardActions,
} from '@mui/material';

function Quiz(props) {
  const questions = props.quiz.questions;
  const [start, setStart] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const finishedQuiz = currentQuestionIndex === questions.length;
  const currentQuestion = questions[currentQuestionIndex];
  const goToNext = () => {
    setCurrentQuestionIndex((prevState) => prevState + 1);
  };
  const submitAnswer = (value) => {
    setAnswers((prevState) => [...prevState, value]);
    goToNext();
  };
  const correctAnswers = useMemo(() => {
    return questions.filter((q, i) => {
      return q.correctAnswer === parseInt(answers[i]);
    }).length;
  }, [answers]);

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setAnswers([]);
  };
  return (
    <Container
      maxWidth="lg"
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
      }}
    >
      {!start ? (
        <Box sx={{ width: '50%' }}>
          <Card
            variant="outlined"
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <CardContent>
              <Typography variant="h4" component="div" textAlign="center">
                {props.quiz.title}
              </Typography>
              <Typography variant="h6" sx={{ my: 1.5, fontWeight: 'regular' }} color="grey.800">
                {props.quiz.description}
              </Typography>
              <Typography
                variant="h6"
                sx={{ my: 1.5, fontWeight: 'regular' }}
                color="black"
                textAlign="center"
              >
                Number of questions: {props.quiz.questions.length}
              </Typography>
            </CardContent>
            <CardActions>
              <Button variant="contained" onClick={() => setStart(true)} fullWidth size="large">
                Start
              </Button>
            </CardActions>
          </Card>
        </Box>
      ) : finishedQuiz ? (
        <Box sx={{ width: '100%', height: '100%' }}>
          <Card variant="outlined" sx={{ padding: '2rem 1rem' }}>
            <CardContent>
              <Grid container spacing={2}>
                {questions.map((q, i) => {
                  return (
                    <Grid item key={i} md={6}>
                      <Typography variant="h6" component="div">
                        Question {i + 1}: {q.question}
                      </Typography>
                      {q.answers.map((a, j) => {
                        return (
                          <Typography
                            key={j}
                            variant="h6"
                            sx={{
                              my: 1.5,
                              fontWeight: 'regular',
                              border: '2px solid ',
                              borderColor:
                                j + 1 === q.correctAnswer
                                  ? 'green'
                                  : parseInt(answers[i]) === j + 1
                                  ? 'red'
                                  : 'divider',
                              width: '40%',
                              minWidth: 'fit-content',
                              padding: '0rem 0.5rem',
                              display: 'flex',
                              alignItems: 'center',
                              textAlign: 'left',
                            }}
                            color={
                              j + 1 === q.correctAnswer
                                ? 'green'
                                : parseInt(answers[i]) === j + 1
                                ? 'red'
                                : 'black'
                            }
                          >
                            <Typography
                              variant="overline"
                              sx={{
                                border: '2px solid ',
                                borderColor:
                                  j + 1 === q.correctAnswer
                                    ? 'green'
                                    : parseInt(answers[i]) === j + 1
                                    ? 'red'
                                    : 'divider',
                                lineHeight: '1rem',
                                padding: '0.1rem 0.3rem',
                                marginRight: '0.5rem',
                              }}
                            >
                              {j === 0 ? 'A' : j === 1 ? 'B' : j === 2 ? 'C' : 'D'}
                            </Typography>
                            {a}
                          </Typography>
                        );
                      })}
                    </Grid>
                  );
                })}
              </Grid>
            </CardContent>
            <CardActions sx={{ display: 'flex' }}>
              <Typography variant="h6">
                Result: {correctAnswers} / {questions.length}
              </Typography>
              <Box sx={{ ml: 'auto' }}>
                <Button variant="outlined" sx={{ mr: '1rem' }} onClick={resetQuiz}>
                  Restart
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => {
                    props.nextExercise();
                  }}
                >
                  Next
                </Button>
              </Box>
            </CardActions>
          </Card>
        </Box>
      ) : (
        <QuestionCard
          question={currentQuestion}
          questionNumber={currentQuestionIndex + 1}
          submitAnswer={submitAnswer}
        />
      )}
    </Container>
  );
}

export default Quiz;
