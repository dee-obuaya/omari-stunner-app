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
        path: '/home',
        element: <MainApp />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: '/home',
                element: <Home defaultActive='home' />,
            },
        ],
    },
    {
        path:'/gallery',
        element: <MainApp />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: '/gallery',
                element: <Gallery defaultActive='gallery' />,
            }
        ]
    },
    {
        path:'/services',
        element: <MainApp />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: '/services',
                element: <Services defaultActive='services' />,
            }
        ]
    },
    {
        path:'/contact',
        element: <MainApp />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: '/contact',
                element: <Contact defaultActive='contact' />,
            }
        ]
    },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
