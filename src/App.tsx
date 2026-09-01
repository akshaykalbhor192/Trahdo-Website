import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Features from './components/Features'
import Products from './components/Products'
import Stats from './components/Stats'
import AboutTrahdo from './components/AboutTrahdo'
import Footer from './components/Footer'

function App() {
  return (
    <>
      <Navbar />
      <main className="bg-ink">
        <Hero />
        <Features />
        <Products />
        <Stats />
        <AboutTrahdo />
      </main>
      <Footer />
    </>
  )
}

export default App
