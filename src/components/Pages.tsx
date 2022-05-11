import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Animap from './Animap'
import { Blog } from './Blog'

export const Pages = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/blog" element={<Blog />} />
      <Route path="/" element={<Animap />} />
    </Routes>
  </BrowserRouter>
)
