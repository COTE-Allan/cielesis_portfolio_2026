import {useLayoutEffect} from 'react';
import {playSound} from '../sound/sound';

// entrance of the page: the grid, its icons, then the toolbar, the header and the footer.

const GRID_DURATION = 400;
const ICON_DURATION = 300;
// the icons start within this time, however many there are.
const ICONS_SPREAD = 700;
// semitones between the pop sounds of the first and the last icon.
const ICONS_PITCH_RANGE = 12;
// the first icon starts before the grid is done.
const ICONS_DELAY = GRID_DURATION * 0.6;
// when the last icon is in place.
const GRID_END = ICONS_DELAY + ICONS_SPREAD + ICON_DURATION;
// time between the starts of the toolbar, header and footer.
const STEP_GAP = 200;

// overshoots a little, like a pop.
const POP_EASING = 'cubic-bezier(0.34, 1.56, 0.64, 1)';
const SLIDE_EASING = 'cubic-bezier(0.25, 1, 0.5, 1)';

const ZOOM_IN = [
  {opacity: 0, transform: 'scale(0.3)'},
  {opacity: 1, transform: 'none'},
];

// steps that come after the grid, in order.
const STEPS = {
  toolbar: {
    keyframes: ZOOM_IN,
    duration: 300,
    easing: POP_EASING,
    delay: GRID_END,
    sound: {name: 'grab_icon', pitch: ICONS_PITCH_RANGE + 2},
  },
  header: {
    keyframes: [{translate: '0 calc(-100% - 20px)'}, {translate: 'none'}],
    duration: 450,
    easing: SLIDE_EASING,
    delay: GRID_END + STEP_GAP,
  },
  footer: {keyframes: [{opacity: 0}, {opacity: 1}], duration: 500, easing: 'ease', delay: GRID_END + 2 * STEP_GAP},
};

// when a step is fully shown, from the page load.
export const introEnd = (step) => (reducedMotion() ? 0 : STEPS[step].delay + STEPS[step].duration);

// the "reduce motion" setting, or the system's preference when it is not set (settings.js).
export const reducedMotion = () => document.documentElement.dataset.motion === 'reduce';

function shuffle(items) {
  const shuffled = [...items];
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const other = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[other]] = [shuffled[other], shuffled[index]];
  }

  return shuffled;
}

// `backwards`: hidden until their delay is over, then back to their own styles.
const play = (element, keyframes, {duration, delay = 0, easing}) =>
  element.animate(keyframes, {duration, delay, easing, fill: 'backwards'});

// plays the grid then its icons with a pop sound, and returns a function stopping the animations.
export function playGridIntro(grid) {
  if (!grid || reducedMotion()) return () => {};

  const animations = [play(grid, ZOOM_IN, {duration: GRID_DURATION, easing: POP_EASING})];
  const timers = [];

  const icons = shuffle(grid.querySelectorAll('[data-icon-id]'));
  const progress = (index) => (icons.length > 1 ? index / (icons.length - 1) : 0);

  icons.forEach((icon, index) => {
    const delay = ICONS_DELAY + progress(index) * ICONS_SPREAD;
    const pitch = progress(index) * ICONS_PITCH_RANGE;
    animations.push(play(icon, ZOOM_IN, {duration: ICON_DURATION, delay, easing: POP_EASING}));
    timers.push(setTimeout(() => playSound('grab_icon', {throttle: false, pitch}), delay));
  });

  return () => {
    animations.forEach((animation) => animation.cancel());
    timers.forEach(clearTimeout);
  };
}

// plays a step of the entrance on the element of `ref` before its first paint.
export function useIntroAnimation(ref, step) {
  useLayoutEffect(() => {
    if (!ref.current || reducedMotion()) return undefined;

    const {keyframes, sound, ...timing} = STEPS[step];
    const animation = play(ref.current, keyframes, timing);
    const timer = sound && setTimeout(() => playSound(sound.name, {throttle: false, pitch: sound.pitch}), timing.delay);

    return () => {
      animation.cancel();
      clearTimeout(timer);
    };
  }, [ref, step]);
}
