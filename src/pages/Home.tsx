import Hero from '../components/Hero'
import Features from '../components/Features'
import Products from '../components/Products'
import Stats from '../components/Stats'
import AboutTrahdo from '../components/AboutTrahdo'

export default function Home() {
  return (
    <main className="bg-ink">
      <Hero />
      <Features />
      <Products />
      <Stats />
      <AboutTrahdo />
    </main>
  )
}
