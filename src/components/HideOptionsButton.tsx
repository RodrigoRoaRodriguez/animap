import VisibilityIcon from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'
import { Button } from '@mui/material'
import create from 'zustand'

const initialState = {
  showOptions: true,
}

export const useHideOptionsStore = create<typeof initialState>(() => ({
  ...initialState,
}))

const showOptions = () => useHideOptionsStore.setState({ showOptions: true })
const hideOptions = () => useHideOptionsStore.setState({ showOptions: false })

export function HideOptionsButton() {
  return (
    <Button
      variant="contained"
      sx={{ margin: '0', width: '100%' }}
      {...(useHideOptionsStore().showOptions
        ? {
            onClick: hideOptions,
            startIcon: <VisibilityOffIcon />,
            children: 'hide options',
          }
        : {
            onClick: showOptions,
            startIcon: <VisibilityIcon />,
            children: 'show options',
          })}
    />
  )
}
