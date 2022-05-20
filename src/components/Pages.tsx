import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Animap from './Animap'
import { Blog } from './Blog'

export const Pages = () => (
  <BrowserRouter basename={process.env.PUBLIC_URL}>
    <Routes>
      <Route path="/blog" element={<Blog />} />
      <Route path="/" element={<Animap />} />
    </Routes>
  </BrowserRouter>
)
