import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormLabel from '@mui/material/FormLabel'
import Radio from '@mui/material/Radio'
import RadioGroup, { RadioGroupProps } from '@mui/material/RadioGroup'
import React, { useCallback } from 'react'
interface Props extends Omit<RadioGroupProps, 'onChange'> {
  onChange: (value: string) => void
  title: string
  values: string[]
  defaultValue?: string
}

export function Picker({
  onChange,
  title,
  values,
  defaultValue = values[0],
  ...radioGroupProps
}: Props) {
  const forwardValue = useCallback(
    ({}, value: string) => onChange(value),
    [onChange],
  )
  return (
    <FormControl component="fieldset">
      <FormLabel component="legend">{title}</FormLabel>
      <RadioGroup
        onChange={forwardValue}
        defaultValue={defaultValue}
        {...radioGroupProps}
      >
        {values.map((value) => (
          <FormControlLabel
            key={value}
            value={value}
            control={<Radio size="small" />}
            label={value}
          />
        ))}
      </RadioGroup>
    </FormControl>
  )
}
