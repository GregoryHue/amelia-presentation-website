import Navbar from './components/Navbar';
import Hero from './components/Hero';
import LogoStrip from './components/LogoStrip';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import Stats from './components/Stats';
import Testimonial from './components/Testimonial';
import CTA from './components/CTA';
import Footer from './components/Footer';

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <LogoStrip />
        <Features />
        <HowItWorks />
        <Stats />
        <Testimonial />
        <CTA />
      </main>
      <Footer />
    </>
  );
}

export default App;
