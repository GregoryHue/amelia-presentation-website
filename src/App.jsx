import { BrowserRouter } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import PageTransition from './components/PageTransition';
import IdlePageCycler from './components/IdlePageCycler';

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <IdlePageCycler />
      <Navbar />
      <main>
        <PageTransition />
      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
