import Navbar from '../Components/Navbar/Navbar';
import Footer from '/src/Components/Footer/Footer';
import { Outlet } from 'react-router-dom';

const ProtectedLayout = () => {
  return (
    <>
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default ProtectedLayout;