import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Login from './pages/Login';
import Admin from './pages/Admin';


const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/admin",
    element: <Admin />
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
