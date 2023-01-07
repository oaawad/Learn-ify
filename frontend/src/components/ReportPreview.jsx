import React from 'react';
import { useForm } from 'react-hook-form'
import { useState, useEffect } from 'react';



const useStyles = makeStyles((theme) => ({
    selectL: {
        width: '100%',
        marginRight: '0.5rem',
    },
    selectR: {
        width: '100%',
        marginLeft: '0.5rem',
    },
}));

function ReportPreview(props) {
    const classes = useStyles();
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        control,
    } = useForm();


    const onSubmitBasic = (data) => {
        props.setReportInfo(data);
        props.setActiveStep(2);
    };


    return (
        <>

        </>
    )

}

export default ReportPreview;