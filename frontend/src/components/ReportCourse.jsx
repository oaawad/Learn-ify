import React from 'react';
import { Button } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';



function ReportCourse(props) {
    const { id } = useParams()
    console.log(id)

    const navigate = useNavigate();
    const handleSub = () => {
        navigate('/Support/Report/' + id)
    }

    // const { id } = props;

    return (
        <>
            <Button
                variant="contained"
                color="error"
                sx={{ width: '80%', mt: '1rem' }}
                href={`/Support/Report/${id}`}
            // onClick={handleSub}

            >
                Report Problem
            </Button>
        </>
    );
}

export default ReportCourse;
