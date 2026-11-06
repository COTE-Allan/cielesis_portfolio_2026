import { useRef } from "react";
import { useIntroAnimation } from "../menu_system/introAnimation";
import { t } from "../../i18n/i18n";
import "./footer.scss"

export function Footer() {
    const ref = useRef(null);
    useIntroAnimation(ref, "footer");

    return (
        <footer ref={ref} className="footer">
            <span className="footer-name">
                {t("footer.name")}
            </span>
            <span className="footer-credit">
                Allan "Cielesis" COTE - v1.0.0
            </span>
            <a href="mailto:ctn.email.pro@gmail.com" className="footer-mail">ctn.email.pro@gmail.com</a>
        </footer>
    )
}
