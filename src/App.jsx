import { useEffect, useState } from 'react'
import './App.scss'
import { Background } from './components/background/Background'
import { BootScreen } from './components/boot/BootScreen'
import { Menu } from './components/menu_system/Menu'
import { Header } from './components/header/Header'
import { Footer } from './components/footer/Footer'
import { getSettings } from './components/settings/settings'
import { useLanguage } from './i18n/i18n'
import { playSound } from './components/sound/sound'

const EMPTY_DELAY = 600;

function App() {

  const [phase, setPhase] = useState(() => (getSettings().bootScreen ? 'boot' : 'empty'));
  useLanguage();

  useEffect(() => {
    if (phase !== 'empty') return undefined;

    const timer = setTimeout(() => setPhase('ready'), EMPTY_DELAY);
    playSound('boot');
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
