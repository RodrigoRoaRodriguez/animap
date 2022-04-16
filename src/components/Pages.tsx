import { BrowserRouter, Route, Routes } from 'react-router-dom'
import App from './App'
import { Blog } from './Blog'

export const Pages = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/blog" element={<Blog />} />
      <Route path="/" element={<App />} />
    </Routes>
  </BrowserRouter>
)
