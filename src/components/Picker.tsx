import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormLabel from '@mui/material/FormLabel'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import React, { useCallback } from 'react'
interface Props {
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
}: Props) {
  const forwardValue = useCallback(
    ({}, value: string) => onChange(value),
    [onChange],
  )
  return (
    <FormControl component="fieldset">
      <FormLabel component="legend">{title}</FormLabel>
      <RadioGroup defaultValue={defaultValue} onChange={forwardValue}>
        {values.map((value) => (
          <FormControlLabel
            key={value}
            value={value}
            control={<Radio />}
            label={value}
          />
        ))}
      </RadioGroup>
    </FormControl>
  )
}
