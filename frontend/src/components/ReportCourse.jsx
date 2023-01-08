import React from 'react';
import { Button } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function ReportCourse(props) {
  const { id } = useParams();
  return (
    <>
      <Button variant="contained" color="error" sx={{ mt: '1rem' }} href={`/Support/Report/${id}`}>
        Report Problem
      </Button>
    </>
  );
}

export default ReportCourse;
