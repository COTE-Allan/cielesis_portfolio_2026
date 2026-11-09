import {useState} from 'react';
import {t} from '../../i18n/i18n';
import {RoundIcon} from '../icons/RoundIcon';
import {Panel, PanelHeader} from '../menu_system/Panel';
import {playSound} from '../sound/sound';
import {read, write} from '../tools/storage';
import './NotesPanel.scss';

const STORAGE_KEY = 'notes';
const MAX_NOTES = 20;
const MAX_LENGTH = 1000;
const COLORS = 4;

const isNote = (note) =>
  note && typeof note.id === 'string' && typeof note.text === 'string' && Number.isInteger(note.color);

function load() {
  const saved = read(STORAGE_KEY);
  return Array.isArray(saved) ? saved.filter(isNote).slice(0, MAX_NOTES) : [];
}

const newId = () => window.crypto?.randomUUID?.() ?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;

export function NotesPanel({modal}) {
  const [notes, setNotes] = useState(load);
  const [created, setCreated] = useState(null);

  const update = (next) => {
    setNotes(next);
    write(STORAGE_KEY, next);
  };

  const add = () => {
    playSound('click');
    const id = newId();
    const color = notes.length ? (notes[0].color + 1) % COLORS : 0;
    setCreated(id);
    update([{id, text: '', color}, ...notes]);
  };

  const remove = (id) => {
    playSound('click');
    update(notes.filter((note) => note.id !== id));
  };

  const edit = (id, text) => update(notes.map((note) => (note.id === id ? {...note, text} : note)));

  return (
    <Panel open={modal.isOpen} onClose={modal.hide} onExited={modal.onExited} label={t('notes.title')}>
      {modal.data && (
        <div className="notes">
          <PanelHeader onClose={modal.hide}>
            <h2 className="notes-title">
              <RoundIcon name="note_stack" filled />
              {t('notes.title')}
            </h2>
            <button type="button" className="notes-add" disabled={notes.length >= MAX_NOTES} onClick={add}>
              <RoundIcon name="add" />
              {t('notes.add')}
            </button>
          </PanelHeader>

          {notes.length === 0 ? (
            <p className="notes-empty">{t('notes.empty')}</p>
          ) : (
            <ul className="notes-list">
              {notes.map((note, index) => (
                <li key={note.id} className={`notes-note notes-note-${note.color % COLORS}`}>
                  <textarea
                    className="notes-text"
                    value={note.text}
                    maxLength={MAX_LENGTH}
                    placeholder={t('notes.placeholder')}
                    aria-label={t('notes.note', {number: index + 1})}
                    autoFocus={note.id === created}
                    onChange={(event) => edit(note.id, event.target.value)}
                  />
                  <button
                    type="button"
                    className="notes-delete"
                    aria-label={t('notes.delete')}
                    title={t('notes.delete')}
                    onClick={() => remove(note.id)}
                  >
                    <RoundIcon name="close" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </Panel>
  );
}
