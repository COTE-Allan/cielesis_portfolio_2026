import {useEffect, useLayoutEffect, useRef, useState} from 'react';
import {DragDropProvider} from '@dnd-kit/react';
import {Feedback} from '@dnd-kit/dom';
import {useModal} from '../modal/useModal';
import {BadgeCaseModal} from './BadgeCaseModal';
import {FolderModal} from './FolderModal';
import {ProjectCard} from './ProjectCard';
import {SlotGrid} from './SlotGrid';
import {Toolbar} from './Toolbar';
import {BADGE_CASE, DEFAULT_LAYOUT, ITEMS, MAIN, ZOOM_LEVELS} from './menuData';
import {
  applyDrop,
  fitMain,
  getItem,
  initialLayout,
  isBadge,
  isFolder,
  itemAt,
  loadLayout,
  loadNames,
  loadZoom,
  mainCount,
  pickNames,
  saveLayout,
  saveNames,
  saveZoom,
} from './layout';
import {fadeInMusic, fadeOutMusic} from '../music/music';
import {playSound} from '../sound/sound';
import {playGridIntro} from './introAnimation';
import {SWAP_DURATION, SWAP_EASING, captureIconRects, captureZoom, playSwapAnimation} from './swapAnimation';
import './Menu.scss';

// ignore clicks fired right after a drop.
const CLICK_GUARD_MS = 100;
// hovering a folder tile this long while dragging an icon opens it.
const HOVER_OPEN_MS = 500;
// the main grid keeps its size at every zoom level (ZOOM_LEVELS):
// icons, badges and folders scale to fill it.
const DEFAULT_ZOOM = 1;
// width of a column and of the gap between columns at scale 1 ($cell and $gap in SlotGrid.scss).
const CELL_WIDTH = 96;
const CELL_GAP = 10;
// width of the main grid's icons until it is measured ($menu-grid).
const GRID_WIDTH = 520;

// scale at which `columns` columns fill `width`.
const fitScale = (width, columns) => width / (columns * CELL_WIDTH + (columns - 1) * CELL_GAP);

// slots of the main grid at a zoom level.
const capacity = (zoom) => ZOOM_LEVELS[zoom] ** 2;

// biggest zoom level, up to `zoom`, whose grid holds every item of main
// (the first one always does: main holds at most MAX_MAIN_SLOTS items).
function fittingZoom(layout, zoom) {
  let fitting = zoom;
  while (fitting > 0 && mainCount(layout) > capacity(fitting)) fitting -= 1;

  return fitting;
}

const plugins = (defaults) => [
  ...defaults,
  Feedback.configure({dropAnimation: {duration: SWAP_DURATION, easing: SWAP_EASING}}),
];

function isOutside(element, {x, y}) {
  const rect = element?.getBoundingClientRect();
  return Boolean(rect) && (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom);
}

export function Menu({defaultLayout = DEFAULT_LAYOUT}) {
  const [initial] = useState(() => {
    const loaded = loadLayout(defaultLayout);
    const zoom = fittingZoom(loaded, loadZoom(ZOOM_LEVELS.length, DEFAULT_ZOOM));
    return {zoom, layout: fitMain(loaded, capacity(zoom))};
  });
  const [layout, setLayout] = useState(initial.layout);
  const [names, setNames] = useState(() => loadNames(layout));
  const [zoom, setZoom] = useState(initial.zoom);
  // content width of the main grid: smaller than GRID_WIDTH on small screens.
  const [gridWidth, setGridWidth] = useState(GRID_WIDTH);
  // id of the item being dragged, or null.
  const [dragId, setDragId] = useState(null);

  const folder = useModal();
  const badgeCase = useModal();
  const project = useModal();

  const gridRef = useRef(null);
  const folderRef = useRef(null);
  const badgeCaseRef = useRef(null);
  const snapshot = useRef(null);
  const dragGuard = useRef(false);
  const hoverTimer = useRef(null);
  // whether the pointer has been inside the open folder (or badge case) during this drag.
  const enteredPanel = useRef(false);

  useLayoutEffect(() => {
    playSwapAnimation(snapshot.current);
    snapshot.current = null;
  }, [layout, zoom]);

  // the music fades out while a project is open, and comes back once it is closed.
  useEffect(() => {
    if (project.isOpen) fadeOutMusic();
    else fadeInMusic();
  }, [project.isOpen]);

  // the grid zooms in, then its icons one by one (before the first paint, so they never flash).
  useLayoutEffect(() => playGridIntro(gridRef.current), []);

  useLayoutEffect(() => {
    const observer = new ResizeObserver(([entry]) => setGridWidth(entry.contentRect.width));
    observer.observe(gridRef.current);
    return () => observer.disconnect();
  }, []);

  const columns = ZOOM_LEVELS[zoom];
  // folders and the badge case get more columns when the icons are smaller,
  // so they keep about the same width at every zoom level (3 and 6 at the default zoom).
  // folders never go under 3 columns (the max zoom would give 2).
  const folderColumns = Math.max(columns - 1, 3);
  const badgeCaseColumns = columns + 2;
  const dragging = dragId !== null;
  const panelOpen = folder.isOpen || badgeCase.isOpen;

  // wraps a handler so it is ignored during (and just after) a drag.
  const guarded = (handler) => (...args) => {
    if (!dragGuard.current) handler(...args);
  };

  const updateNames = (next) => {
    setNames(next);
    saveNames(next);
  };

  // the items past the last slot of the new grid move to its free slots.
  // `dragged`: id of the item being dragged, which the animation leaves alone.
  const updateZoom = (next, dragged) => {
    if (next === zoom) return;

    snapshot.current = captureZoom(gridRef.current, dragged);
    const fitted = fitMain(layout, capacity(next));
    if (fitted !== layout) {
      setLayout(fitted);
      saveLayout(fitted);
    }

    setZoom(next);
    saveZoom(next);
  };

  // back to the menu of a first visit: default layout, folder names and zoom.
  const resetLayout = () => {
    const fresh = initialLayout(defaultLayout);
    const nextZoom = fittingZoom(fresh, DEFAULT_ZOOM);
    const fitted = fitMain(fresh, capacity(nextZoom));

    snapshot.current = captureZoom(gridRef.current);
    setLayout(fitted);
    saveLayout(fitted);
    updateNames({});
    setZoom(nextZoom);
    saveZoom(nextZoom);
  };

  // badges are purely cosmetic: opening one does nothing (but click).
  const openItem = guarded((id) => {
    if (ITEMS[id]?.isApp) {
      playSound('open_app');
      project.show(id);
    } else if (ITEMS[id]?.isLink) {
      playSound('launch_app');
      window.open(ITEMS[id].link, '_blank', 'noopener,noreferrer');
    } else {
      playSound('click');
      if (isFolder(id)) folder.show(id);
      else if (ITEMS[id]?.isBadgeCase) badgeCase.show();
    }
  });

  const handleDragMove = (event) => {
    // dragging an item out of the open folder (or badge case) closes it,
    // so the item can be dropped in the main grid.
    const panel = folder.isOpen ? folder : badgeCase;
    const ref = folder.isOpen ? folderRef : badgeCaseRef;
    if (!panel.isOpen) return;

    const pointer = event.to ?? event.operation.position.current;

    if (!isOutside(ref.current, pointer)) {
      enteredPanel.current = true;
    } else if (enteredPanel.current) {
      panel.hide();
      // main has no free slot for the item: zoom out to make room for it.
      if (zoom > 0 && mainCount(layout) >= capacity(zoom)) updateZoom(zoom - 1, event.operation.source?.id);
    }
  };

  const handleDragOver = (event) => {
    window.clearTimeout(hoverTimer.current);

    // holding an icon from the main grid (or a badge from the case) over a folder
    // tile opens the folder, so the item can be dropped in a specific slot.
    const {source, target} = event.operation;
    const folderId = target && itemAt(layout, target.id);
    const fromOutside = [MAIN, BADGE_CASE].some((id) => layout[id].includes(source?.id));

    if (panelOpen || !fromOutside || isFolder(source.id) || !isFolder(folderId)) return;

    hoverTimer.current = window.setTimeout(() => {
      enteredPanel.current = false;
      folder.show(folderId);
    }, HOVER_OPEN_MS);
  };

  const handleDragEnd = (event) => {
    window.clearTimeout(hoverTimer.current);
    setDragId(null);
    window.setTimeout(() => {
      dragGuard.current = false;
    }, CLICK_GUARD_MS);

    if (event.canceled) return;

    const {source, target} = event.operation;
    const next = applyDrop(layout, source?.id, target?.id);
    if (next === layout) return;

    const created = Object.keys(next).find((id) => !Object.hasOwn(layout, id));

    playSound('click');
    snapshot.current = captureIconRects(source?.id);
    setLayout(next);
    saveLayout(next);
    updateNames(pickNames(names, next));

    if (created) folder.show(created);
    else if (folder.data && !Object.hasOwn(next, folder.data)) folder.hide();
  };

  const folderId = folder.data && Object.hasOwn(layout, folder.data) ? folder.data : null;

  return (
    <DragDropProvider
      plugins={plugins}
      onDragStart={(event) => {
        playSound('grab_icon');
        dragGuard.current = true;
        enteredPanel.current = false;
        setDragId(event.operation.source?.id ?? null);
      }}
      onDragMove={handleDragMove}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      {/* modals are inside so they get the zoom too. */}
      <div className="home" style={{'--zoom': fitScale(gridWidth, columns)}}>
        <div className="menu">
          <Toolbar
            zoom={zoom}
            maxZoom={fittingZoom(layout, ZOOM_LEVELS.length - 1)}
            onZoom={updateZoom}
            onResetLayout={resetLayout}
          />

          <SlotGrid
            ref={gridRef}
            layout={layout}
            names={names}
            containerId={MAIN}
            columns={columns}
            rows={columns}
            variant="main"
            disabled={panelOpen}
            showPins={isBadge(dragId)}
            onOpen={openItem}
          />
        </div>

        <FolderModal
          ref={folderRef}
          modal={folder}
          onClose={guarded(folder.hide)}
          keepMounted={dragging}
          folderId={folderId}
          layout={layout}
          names={names}
          columns={folderColumns}
          onRename={(name) => updateNames(pickNames({...names, [folderId]: name}, layout))}
          onOpen={openItem}
        />

        <BadgeCaseModal
          ref={badgeCaseRef}
          modal={badgeCase}
          onClose={guarded(badgeCase.hide)}
          keepMounted={dragging}
          layout={layout}
          names={names}
          columns={badgeCaseColumns}
          onOpen={openItem}
        />

        {/* rendered after the folder and badge case so it stacks on top of them. */}
        <ProjectCard
          modal={project}
          onClose={guarded(project.hide)}
          item={project.data && getItem(project.data, names)}
        />
      </div>
    </DragDropProvider>
  );
}
