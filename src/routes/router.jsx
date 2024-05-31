import { createBrowserRouter } from "react-router-dom";
import Home from '../pages/Home/index';
import Quiz from '../pages/Quiz/index';
import Result from '../pages/Result/index';
const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />,
    },
    {
        path: "/quiz/:category",
        element: <Quiz />,
    },
    {
        path: "/result",
        element: <Result />,
    },

]);

export default router