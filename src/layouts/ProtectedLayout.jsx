import Navbar from '../Components/Navbar/Navbar';
import { Outlet } from 'react-router-dom';

const ProtectedLayout = () => {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default ProtectedLayout;