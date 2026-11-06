import { useEffect, useState } from 'react'
import './App.scss'
import { Background } from './components/background/Background'
import { BootScreen } from './components/boot/BootScreen'
import { Menu } from './components/menu_system/Menu'
import { Header } from './components/header/Header'
import { Footer } from './components/footer/Footer'

// once the boot screen is gone, the background stays alone this long,
// then the grid and the rest are mounted and play their entrance (introAnimation.js).
const EMPTY_DELAY = 600;

function App() {
  // 'boot' (boot screen shown) -> 'empty' (background only) -> 'ready'
  const [phase, setPhase] = useState('boot');

  useEffect(() => {
    if (phase !== 'empty') return undefined;

    const timer = setTimeout(() => setPhase('ready'), EMPTY_DELAY);
    return () => clearTimeout(timer);
  }, [phase]);

  return (
    <>
      <Background />
      {phase === 'ready' && (
        <>
          <Header/>
          <section id="center">
            <Menu/>
          </section>
          <Footer/>
        </>
      )}
      {phase === 'boot' && <BootScreen onDone={() => setPhase('empty')} />}
    </>
  )
}

export default App
