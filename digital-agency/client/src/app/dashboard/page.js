'use client'
import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';
import { useForm } from 'react-hook-form';
import '../globals.css'
// import tw from 'tailwind-styled-components'; //исправь для next js 


const ApplicationForm = () => {
  const { register, handleSubmit, errors } = useForm();
  // const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = (data) => {
    setIsSubmitting(true);
    // Submit application logic here
  };

  return (
    <div className="flex h-100 flex-col items-center justify-center">
      <form className="flex flex-col items-center justify-center" onSubmit={handleSubmit(onSubmit)}>
        <TextField
        className="mt-4"
          name="name"
          label="Name"
          // inputRef={register({ required: true })}
          // error={!!errors.name}
          // helperText={errors.name && 'Name is required'}
        />
        <TextField
        className="mt-4"
          name="email"
          label="Email"
          // inputRef={register({ required: true })}
          // error={!!errors.email}
          // helperText={errors.email && 'Email is required'}
        />
        <TextField
        className="mt-4"
          name="message"
          label="Message"
          // inputRef={register({ required: true })}
          // error={!!errors.message}
          // helperText={errors.message && 'Message is required'}
        />
        <Button variant="contained" color="success">
          Success
        </Button>

      </form>
    </div>
  );
};

export default ApplicationForm;