// App.js
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header';



const App = () => {
  return (
    <>
      <Header />
      <ToastContainer />
      <div className="p-4">
        <Outlet />
      </div>
    </>
  );
};

export default App;
