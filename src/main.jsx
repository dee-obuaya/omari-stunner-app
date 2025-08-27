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


const getActiveTab = () => {
    const url = new URL(window.location.href);
    let valueToPass = 'home';

    if (url.pathname.includes('/home')) {
        valueToPass = 'home';
    } else if (url.pathname.includes('/gallery')) {
        valueToPass = 'gallery';
    } else if (url.pathname.includes('/services')) {
        valueToPass = 'services';
    } else if (url.pathname.includes('/contact')) {
        valueToPass = 'contact'
    }

    return { tabToSet: valueToPass };
};

const router = createBrowserRouter([
    {
        id: 'main-app-id',
        Component: MainApp,
        loader: getActiveTab,
        errorElement: <ErrorPage />,
        children: [
            {
                index: true, // This makes it the default child route
                element: <Navigate to="/home" replace />, // Redirect to /home
            },
            {
                path: '/home',
                Component: Home,
            },
            {
                path: '/gallery',
                Component: Gallery,
            },
            {
                path: '/services',
                Component: Services,
            },
            {
                path: '/contact',
                Component: Contact,
            },
        ]
    }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
        <RouterProvider router={router}/>
  </StrictMode>,
)
