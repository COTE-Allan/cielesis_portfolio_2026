import {useEffect, useRef, useState} from 'react';
import {t} from '../../i18n/i18n';
import {RoundIcon} from '../icons/RoundIcon';
import {Panel, PanelHeader} from '../menu_system/Panel';
import {playSound} from '../sound/sound';
import {read, write} from '../tools/storage';
import './DrawingPad.scss';

const WIDTH = 900;
const HEIGHT = 600;
const PAPER = '#ffffff';
const STORAGE_KEY = 'drawing';
const MAX_UNDO = 10;

const COLORS = [
  {id: 'black', value: '#1b1b1f'},
  {id: 'red', value: '#e00000'},
  {id: 'orange', value: '#d68b00'},
  {id: 'green', value: '#38c538'},
  {id: 'teal', value: '#65d1ca'},
  {id: 'blue', value: '#4d89b8'},
  {id: 'purple', value: '#b49ae0'},
];
const SIZES = [4, 10, 24];

function Tool({icon, label, pressed, disabled, onClick, children}) {
  return (
    <button
      type="button"
      className="drawing-tool"
      aria-label={label}
      title={label}
      aria-pressed={pressed}
      disabled={disabled}
      onClick={() => {
        playSound('click');
        onClick();
      }}
    >
      {children ?? <RoundIcon name={icon} filled />}
    </button>
  );
}

export function DrawingPad({modal}) {
  const canvasRef = useRef(null);
  const history = useRef([]);
  const last = useRef(null);
  const [color, setColor] = useState(COLORS[0].value);
  const [size, setSize] = useState(SIZES[1]);
  const [eraser, setEraser] = useState(false);
  const [canUndo, setCanUndo] = useState(false);

  const context = () => canvasRef.current.getContext('2d');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    history.current = [];
    setCanUndo(false);

    const saved = read(STORAGE_KEY);
    if (typeof saved === 'string' && saved.startsWith('data:image/')) {
      const image = new Image();
      image.onload = () => ctx.drawImage(image, 0, 0);
      image.src = saved;
    }
  }, [modal.data]);

  const save = () => write(STORAGE_KEY, canvasRef.current.toDataURL('image/png'));

  const remember = () => {
    history.current = [...history.current.slice(1 - MAX_UNDO), context().getImageData(0, 0, WIDTH, HEIGHT)];
    setCanUndo(true);
  };

  const point = (event) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) * WIDTH) / rect.width,
      y: ((event.clientY - rect.top) * HEIGHT) / rect.height,
    };
  };

  const stroke = (from, to) => {
    const ctx = context();
    ctx.strokeStyle = eraser ? PAPER : color;
    ctx.lineWidth = eraser ? size * 2 : size;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
  };

  const onPointerDown = (event) => {
    if (event.button !== 0) return;

    event.currentTarget.setPointerCapture(event.pointerId);
    remember();
    last.current = point(event);
    stroke(last.current, last.current);
  };

  const onPointerMove = (event) => {
    if (!last.current) return;

    const next = point(event);
    stroke(last.current, next);
    last.current = next;
  };

  const onPointerUp = () => {
    if (!last.current) return;

    last.current = null;
    save();
  };

  const undo = () => {
    const previous = history.current.pop();
    if (!previous) return;

    context().putImageData(previous, 0, 0);
    setCanUndo(history.current.length > 0);
    save();
  };

  const clear = () => {
    remember();
    const ctx = context();
    ctx.fillStyle = PAPER;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    save();
  };

  const download = () => {
    const link = document.createElement('a');
    link.download = 'drawing.png';
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  return (
    <Panel open={modal.isOpen} onClose={modal.hide} onExited={modal.onExited} label={t('drawing.title')}>
      {modal.data && (
        <div className="drawing">
          <PanelHeader onClose={modal.hide}>
            <h2 className="drawing-title">
              <RoundIcon name="brush" filled />
              {t('drawing.title')}
            </h2>
          </PanelHeader>

          <canvas
            ref={canvasRef}
            className="drawing-canvas"
            width={WIDTH}
            height={HEIGHT}
            role="img"
            aria-label={t('drawing.canvas')}
            data-eraser={eraser ? '' : undefined}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
          />

          <div className="drawing-colors" role="group" aria-label={t('drawing.colors')}>
            {COLORS.map(({id, value}) => (
              <button
                key={id}
                type="button"
                className="drawing-swatch"
                style={{'--swatch': value}}
                aria-label={t(`drawing.color.${id}`)}
                title={t(`drawing.color.${id}`)}
                aria-pressed={!eraser && value === color}
                onClick={() => {
                  playSound('click');
                  setColor(value);
                  setEraser(false);
                }}
              />
            ))}
          </div>

          <div className="drawing-tools">
            <div className="drawing-group" role="group" aria-label={t('drawing.size')}>
              {SIZES.map((value) => (
                <Tool
                  key={value}
                  label={t('drawing.sizeValue', {size: value})}
                  pressed={value === size}
                  onClick={() => setSize(value)}
                >
                  <span className="drawing-dot" style={{'--dot': `${Math.max(value / 1.2, 4)}px`}} />
                </Tool>
              ))}
            </div>

            <div className="drawing-group">
              <Tool icon="ink_eraser" label={t('drawing.eraser')} pressed={eraser} onClick={() => setEraser(!eraser)} />
              <Tool icon="undo" label={t('drawing.undo')} disabled={!canUndo} onClick={undo} />
              <Tool icon="delete" label={t('drawing.clear')} onClick={clear} />
              <Tool icon="download" label={t('drawing.download')} onClick={download} />
            </div>
          </div>
        </div>
      )}
    </Panel>
  );
}
