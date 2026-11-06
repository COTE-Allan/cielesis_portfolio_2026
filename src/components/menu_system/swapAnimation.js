import {reducedMotion} from './introAnimation';

// FLIP animation: icons slide (and resize) from their old position to the new one
// after a drop or a zoom change.

export const SWAP_DURATION = 250;
export const SWAP_EASING = 'cubic-bezier(0.25, 1, 0.5, 1)';
// zoom changes move every icon of the main grid: they take a bit longer.
const ZOOM_DURATION = 450;

export function captureIconRects(skipId) {
  const rects = new Map();

  document.querySelectorAll('[data-icon-id]').forEach((element) => {
    rects.set(element.dataset.iconId, element.getBoundingClientRect());
  });

  return {rects, skipId: String(skipId), duration: SWAP_DURATION};
}

// before a zoom change of `grid`: its empty slots also fade in at their new place.
// `skipId`: the icon being dragged, if any, is left alone.
export const captureZoom = (grid, skipId) => ({...captureIconRects(skipId), duration: ZOOM_DURATION, grid});

export function playSwapAnimation(snapshot) {
  if (!snapshot || reducedMotion()) return;

  const {duration} = snapshot;

  for (const [id, before] of snapshot.rects) {
    if (id === snapshot.skipId) continue;

    const element = document.querySelector(`[data-icon-id="${id}"]`);
    if (!element) continue;

    const after = element.getBoundingClientRect();
    if (!after.width || !after.height) continue;

    // from center to center: icons scale around their center.
    const dx = before.left + before.width / 2 - (after.left + after.width / 2);
    const dy = before.top + before.height / 2 - (after.top + after.height / 2);
    const sx = before.width / after.width;
    const sy = before.height / after.height;
    if (dx === 0 && dy === 0 && sx === 1 && sy === 1) continue;

    element.animate(
      [{transform: `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`}, {transform: 'none'}],
      {duration, easing: SWAP_EASING}
    );
  }

  snapshot.grid?.querySelectorAll('.slot-magnet').forEach((element) => {
    element.animate(
      [{opacity: 0, transform: 'scale(0.4)'}, {opacity: 1, transform: 'none'}],
      {duration, easing: SWAP_EASING}
    );
  });
}
