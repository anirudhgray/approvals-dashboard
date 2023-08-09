import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Login from './pages/Login';
import Admin from './pages/Admin';
import Main from './pages/Main';


const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/dashboard",
    element: <Main />
  }
]);

function App() {
  return (
    <>
      <RouterProvider classNames="bg-slate-500" router={router} />
    </>
  )
}

export default App
