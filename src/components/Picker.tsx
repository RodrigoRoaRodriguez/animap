import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormLabel from '@material-ui/core/FormLabel'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
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
  const forwardValue = useCallback((_, value: string) => onChange(value), [
    onChange,
  ])
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
