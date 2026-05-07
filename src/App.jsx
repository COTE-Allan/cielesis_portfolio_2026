import { useState } from "react";
import videobg from "./assets/background.webm";
import "./sass/style.scss";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <section className="bg">
        <video className="bg-video" autoPlay src={videobg}></video>
        <div className="bg-gradient"></div>
        <div className="bg-blur"></div>
      </section>
      <section className="content">
        <div className="content-main">
          <h1>Allan "Cielesis" COTE</h1>
          <hr />
          <p>
            I’m a developer and designer specialized in web and video games,
            focused on creating immersive and interactive projects blending
            design, gameplay, and technology. Open to work and collaborations.
          </p>
          <a
            className="link-button"
            href="https://www.behance.net/allancote1"
            target="blank"
          >
            check out my portfolio
          </a>
          <div className="content-list">
            <h2>games i made</h2>
            <hr />
            <ul>
              <li>
                <a
                  href="https://store.steampowered.com/app/4212830/Void_Nebula/"
                  target="blank"
                >
                  Void Nebula
                </a>
              </li>
              <li>
                <a
                  href="https://cielesis.itch.io/explosive-knight-takes-flying-pawn"
                  target="blank"
                >
                  TAKES
                </a>
              </li>
            </ul>
          </div>
          <div className="content-list">
            <h2>websites</h2>
            <hr />
            <ul>
              <li>
                <a href="https://www.ml-lehavre.fr/" target="blank">
                  Mission Locale Le Havre Estuaire Littoral
                </a>
              </li>
              <li>
                <a href="https://xpfr.fr/" target="blank">
                  XPLH
                </a>
              </li>
              <li>
                <a href="https://lofi-cafe.cielesis.fr/" target="blank">
                  Cielesis's Lofi Cafe
                </a>
              </li>
              <li>
                <a href="https://babelfest.fr/" target="blank">
                  Babelfest
                </a>
              </li>
            </ul>
          </div>
          <div className="content-list">
            <h2>webcomics</h2>
            <hr />
            <ul>
              <li>
                <a
                  href="https://www.mangadraft.com/manga/alternative"
                  target="blank"
                >
                  Alternative
                </a>
              </li>
            </ul>
          </div>
          <div className="content-list">
            <h2>links</h2>
            <hr />
            <ul>
              <li>
                <a href="https://www.linkedin.com/in/cielesis/" target="blank">
                  LinkedIn
                </a>
              </li>
              <li>
                <a href="https://www.malt.fr/profile/allancote1" target="blank">
                  Malt
                </a>
              </li>
              <li>
                <a
                  href="https://www.youtube.com/channel/UCxZ85Kq0CvJXQu9jAzcNzEw"
                  target="blank"
                >
                  Youtube
                </a>
              </li>
              <li>
                <a href="https://www.twitch.tv/cielesis_" target="blank">
                  Twitch
                </a>
              </li>
              <li>
                <a href="https://x.com/koffi_cup" target="blank">
                  Twitter/X
                </a>
              </li>
              <li>
                <a href="https://www.behance.net/allancote1" target="blank">
                  Behance
                </a>
              </li>
            </ul>
          </div>
          <h2>Want to work with me?</h2>
          <hr />
          <div className="flex-hori">
            <a
              className="link-button"
              href="https://www.malt.fr/profile/allancote1"
              target="blank"
            >
              contact me on malt
            </a>
            <a
              className="link-button"
              href="mailto:ctn.email.pro@gmail.com"
              target="blank"
            >
              send me a mail
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

export default App;
