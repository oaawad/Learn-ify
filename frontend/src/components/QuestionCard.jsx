import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  CardActions,
  Button,
} from '@mui/material';

function QuestionCard(props) {
  const { question = {}, questionNumber, submitAnswer } = props;
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const handleChangeRadio = (event) => {
    setSelectedAnswer(event.target.value);
  };
  const handleSubmit = () => {
    submitAnswer(selectedAnswer);
    setSelectedAnswer(null);
  };
  return (
    <Box sx={{ width: '50%' }}>
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h6" component="div">
            Question {questionNumber}
          </Typography>
          <Typography
            variant="h6"
            sx={{ my: 1.5, fontWeight: 'regular' }}
            color="black"
          >
            {question.question}
          </Typography>
          <FormControl>
            <RadioGroup
              name="radio-group-quiz"
              value={selectedAnswer}
              onChange={handleChangeRadio}
            >
              {question.answers.map((answer, i) => {
                return (
                  <FormControlLabel
                    key={i + 1}
                    value={i + 1}
                    control={<Radio />}
                    label={answer}
                  />
                );
              })}
            </RadioGroup>
          </FormControl>
        </CardContent>
        <CardActions>
          <Button
            size="small"
            onClick={handleSubmit}
            fullWidth
            variant="outlined"
          >
            Submit
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
}

export default QuestionCard;
