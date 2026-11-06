import { useCallback, useEffect, useRef, useState } from "react";
import { RoundIcon } from "../icons/RoundIcon";
import { introEnd, useIntroAnimation } from "../menu_system/introAnimation";
import { useModal } from "../modal/useModal";
import { getLanguage, t } from "../../i18n/i18n";
import { playSound } from "../sound/sound";
import { ProfileModal } from "./ProfileModal";
import ProfilePic from '../../assets/others/allan_cote_profile_picture.webp'
import "./header.scss"

const pad = (n) => String(n).padStart(2, "0");
// short name of the day in the current language (Sun, dim., So...).
const weekday = (date) => new Intl.DateTimeFormat(getLanguage(), { weekday: "short" }).format(date);

// current date, refreshed at each new minute
function useClock() {
    const [now, setNow] = useState(() => new Date());

    useEffect(() => {
        let timer;
        const tick = () => {
            const date = new Date();
            setNow(date);
            timer = setTimeout(tick, 60000 - date.getSeconds() * 1000 - date.getMilliseconds());
        };
        tick();
        return () => clearTimeout(timer);
    }, []);

    return now;
}

// battery level (0-100) and charging state, static fallback when the Battery API is unavailable (Firefox, Safari)
function useBattery(fallback = 56) {
    const [state, setState] = useState({ level: fallback, charging: false });

    useEffect(() => {
        if (!navigator.getBattery) return;
        let battery;
        let cancelled = false;
        const update = () => setState({ level: Math.round(battery.level * 100), charging: battery.charging });
        navigator.getBattery().then((b) => {
            if (cancelled) return;
            battery = b;
            update();
            battery.addEventListener("levelchange", update);
            battery.addEventListener("chargingchange", update);
        });
        return () => {
            cancelled = true;
            battery?.removeEventListener("levelchange", update);
            battery?.removeEventListener("chargingchange", update);
        };
    }, []);

    return state;
}

function useWifiIcon() {
    const getIcon = () => {
        if (!navigator.onLine) return "wifi_off";
        const type = navigator.connection?.effectiveType;
        if (type === "slow-2g" || type === "2g") return "wifi_1_bar";
        if (type === "3g") return "wifi_2_bar";
        return "wifi";
    };
    const [icon, setIcon] = useState(getIcon);

    useEffect(() => {
        const update = () => setIcon(getIcon());
        window.addEventListener("online", update);
        window.addEventListener("offline", update);
        navigator.connection?.addEventListener("change", update);
        return () => {
            window.removeEventListener("online", update);
            window.removeEventListener("offline", update);
            navigator.connection?.removeEventListener("change", update);
        };
    }, []);

    return icon;
}

// welcome message: shown on mount and on each hover, then collapses after `duration` ms
// (on mount, counted from the end of the header's entrance).
function useWelcome(duration = 2500) {
    const [open, setOpen] = useState(true);
    const timer = useRef();

    const show = useCallback((delay = 0) => {
        setOpen(true);
        clearTimeout(timer.current);
        timer.current = setTimeout(() => setOpen(false), delay + duration);
    }, [duration]);

    useEffect(() => {
        show(introEnd("header"));
        return () => clearTimeout(timer.current);
    }, [show]);

    return [open, show];
}

function batteryIcon({ level, charging }) {
    if (charging) return "battery_android_bolt";
    if (level < 25) return "battery_horiz_000";
    if (level < 63) return "battery_horiz_050";
    if (level < 88) return "battery_horiz_075";
    return "battery_full_alt";
}

// colour of the battery icon: green when charging or well charged, orange then red as it runs down
function batteryTone({ level, charging }) {
    if (charging || level >= 63) return "high";
    if (level >= 25) return "mid";
    return "low";
}

export function Header() {
    const now = useClock();
    const battery = useBattery();
    const wifiIcon = useWifiIcon();
    const [welcomeOpen, showWelcome] = useWelcome();
    const profile = useModal();
    const ref = useRef(null);
    useIntroAnimation(ref, "header");

    const openProfile = () => {
        playSound("click");
        profile.show();
    };

    // the modal is a sibling of the header, not a child: the header's transform
    // would make it the containing block of the fixed backdrop.
    return (
        <>
        <header ref={ref} className="header">
            <section
                className={`header-profile${welcomeOpen ? " header-profile-open" : ""}`}
                role="button"
                tabIndex={0}
                aria-label={t("header.openProfile")}
                onMouseEnter={() => showWelcome()}
                onClick={openProfile}
                onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        openProfile();
                    }
                }}
            >
                <img src={ProfilePic} alt={t("header.pictureAlt")} className="header-profile-picture" />
                <span className="header-profile-welcome">{t("header.welcome")}</span>
            </section>
            <section className="header-system">
                <div className="header-wifi">
                    <RoundIcon name={wifiIcon} className="header-icon-wifi" />
                    <span className="header-wifi-label">
                        {t("header.internet")}
                    </span>
                </div>
                <div className="header-battery">
                    <span className="header-battery-amount">{battery.level}%</span>
                    <RoundIcon name={batteryIcon(battery)} className={`header-icon-battery header-icon-battery-${batteryTone(battery)}`}/>
                </div>
                <div className="header-clock">
                    <span className="header-date">{pad(now.getDate())}/{pad(now.getMonth() + 1)} ({weekday(now)})</span>
                    <span className="header-time">{pad(now.getHours())}:{pad(now.getMinutes())}</span>
                </div>
            </section>
        </header>
        <ProfileModal modal={profile} />
        </>
    )
}
