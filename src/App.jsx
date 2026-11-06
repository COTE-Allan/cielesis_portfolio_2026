import { useEffect, useState } from 'react'
import './App.scss'
import { Background } from './components/background/Background'
import { BootScreen } from './components/boot/BootScreen'
import { Menu } from './components/menu_system/Menu'
import { Header } from './components/header/Header'
import { Footer } from './components/footer/Footer'
import { getSettings } from './components/settings/settings'
import { useLanguage } from './i18n/i18n'

// once the boot screen is gone, the background stays alone this long,
// then the grid and the rest are mounted and play their entrance (introAnimation.js).
const EMPTY_DELAY = 600;

function App() {
  // 'boot' (boot screen shown) -> 'empty' (background only) -> 'ready'
  // the boot screen can be turned off in the settings.
  const [phase, setPhase] = useState(() => (getSettings().bootScreen ? 'boot' : 'empty'));
  // every component below renders again with the texts of the new language.
  useLanguage();

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
