import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Capabilities from './components/Capabilities';
import CTA from './components/CTA';
import Footer from './components/Footer';

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Capabilities />
        <CTA />
      </main>
      <Footer />
    </>
  );
}

export default App;
