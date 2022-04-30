import { lazy, Suspense } from 'react'
const Content = lazy(() => import('./Content/Content'))

export const Blog = () => (
  <>
    <Suspense fallback={<div>Loading...</div>}>
      <Content />
    </Suspense>
  </>
)
