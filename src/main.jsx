import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import MainApp from './routes'
import ErrorPage from './error'
import Services from './routes/Service'
import Home from './routes/Home'
import Gallery from './routes/Gallery'
import Contact from './routes/Contact'

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainApp />,
    errorElement: <ErrorPage />,
    children: [
        {
            path: '/home',
            element: <Home />,
        },
        {
            path: '/gallery',
            element: <Gallery />,
        },
        {
            path: '/services',
            element: <Services />,
        },
        {
            path: '/contact',
            element: <Contact />,
        }
    ]
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
