import React from 'react';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import { FormHelperText } from '@mui/material';
import Select from '@mui/material/Select';
import { Controller } from 'react-hook-form';

const ReactHookFormSelect = ({
  name,
  label,
  control,
  defaultValue,
  children,
  errors,
  ...props
}) => {
  const labelId = `${name}-label`;
  return (
    <FormControl {...props}>
      <InputLabel id={labelId}>{label}</InputLabel>
      <Controller
        name={name}
        defaultValue={''}
        control={control}
        rules={{ required: true }}
        render={({ field: { onChange, onBlur, value, name, ref } }) => (
          <Select
            labelId={labelId}
            label={label}
            onChange={onChange}
            inputRef={ref}
            value={value}
            onBlur={onBlur}
            size="small"
          >
            {children}
          </Select>
        )}
      />
    </FormControl>
  );
};
export default ReactHookFormSelect;
