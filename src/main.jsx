import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
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
        element: <Navigate to="/home" replace state={{defaultActiveFromRedirect: 'home'}} />,
    },
    {
        path: '/home',
        element: <MainApp defaultActive='home' />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: '/home',
                element: <Home />,
            },
        ],
    },
    {
        path:'/gallery',
        element: <MainApp defaultActive='gallery' />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: '/gallery',
                element: <Gallery />,
            }
        ]
    },
    {
        path:'/services',
        element: <MainApp defaultActive='services' />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: '/services',
                element: <Services />,
            }
        ]
    },
    {
        path:'/contact',
        element: <MainApp defaultActive='contact' />,
        errorElement: <ErrorPage />,
        children: [
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
