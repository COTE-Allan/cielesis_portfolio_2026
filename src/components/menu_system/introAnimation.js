import {useLayoutEffect} from 'react';

// entrance of the page when it loads: the main grid zooms in, then its icons
// one after the other in a random order, then the toolbar zooms in, the header
// slides down from the top and the footer fades in.

const GRID_DURATION = 400;
const ICON_DURATION = 300;
// the icons start within this time, however many there are.
const ICONS_SPREAD = 700;
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

// what comes after the grid, in order. `translate`, not `transform`: the header
// is centred with a transform.
const STEPS = {
  toolbar: {keyframes: ZOOM_IN, duration: 300, easing: POP_EASING, delay: GRID_END},
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

// the grid, then its icons. returns a function that stops the animations.
export function playGridIntro(grid) {
  if (!grid || reducedMotion()) return () => {};

  const animations = [play(grid, ZOOM_IN, {duration: GRID_DURATION, easing: POP_EASING})];

  const icons = shuffle(grid.querySelectorAll('[data-icon-id]'));
  const step = icons.length > 1 ? ICONS_SPREAD / (icons.length - 1) : 0;

  icons.forEach((icon, index) => {
    animations.push(play(icon, ZOOM_IN, {duration: ICON_DURATION, delay: ICONS_DELAY + index * step, easing: POP_EASING}));
  });

  return () => animations.forEach((animation) => animation.cancel());
}

// plays the `step` of the entrance ('toolbar', 'header' or 'footer') on the element of `ref`,
// once mounted (before the first paint, so it never flashes).
export function useIntroAnimation(ref, step) {
  useLayoutEffect(() => {
    if (!ref.current || reducedMotion()) return undefined;

    const {keyframes, ...timing} = STEPS[step];
    const animation = play(ref.current, keyframes, timing);
    return () => animation.cancel();
  }, [ref, step]);
}
