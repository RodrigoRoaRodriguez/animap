import * as React from 'react'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormLabel from '@material-ui/core/FormLabel'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'

export function Picker({ values, onChange }) {
  const forwardValue = event => onChange(event.target.value)
  return (
    <FormControl component="fieldset">
      <FormLabel component="legend">Waveform: </FormLabel>
      <RadioGroup defaultValue={values[0]} onChange={forwardValue}>
        {values.map(value => (
          <FormControlLabel value={value} control={<Radio />} label={value} />
        ))}
      </RadioGroup>
    </FormControl>
  )
}
