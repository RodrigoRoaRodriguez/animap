import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos'
import { Button } from '@mui/material'
import { lazy, Suspense } from 'react'
const Content = lazy(() => import('./Content/Content'))

export const Blog = () => (
  <>
    <Button
      variant="outlined"
      sx={{ margin: '0' }}
      href="/"
      startIcon={<ArrowBackIosIcon />}
    />
    <Suspense fallback={<div>Loading...</div>}>
      <Content />
    </Suspense>
  </>
)
