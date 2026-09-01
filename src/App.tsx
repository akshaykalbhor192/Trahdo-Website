import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Features from './components/Features'
import Products from './components/Products'
import Stats from './components/Stats'
import ClosingCta from './components/ClosingCta'
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
        <ClosingCta />
      </main>
      <Footer />
    </>
  )
}

export default App
