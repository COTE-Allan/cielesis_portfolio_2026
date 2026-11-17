import {useCallback, useState} from 'react';

// open and close state for a modal, keeping its data until the exit animation is done.
export function useModal() {
  const [data, setData] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const show = useCallback((value = true) => {
    setData(value);
    setIsOpen(true);
  }, []);

  const hide = useCallback(() => setIsOpen(false), []);
  const onExited = useCallback(() => setData(null), []);

  return {data, isOpen, show, hide, onExited};
}
