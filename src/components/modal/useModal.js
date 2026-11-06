import {useCallback, useState} from 'react';

// open/close state for a <Modal>. `data` is kept until the exit animation
// is done, so the content doesn't vanish while the modal fades out.
//   const project = useModal();
//   project.show(id);
//   <Modal open={project.isOpen} onClose={project.hide} onExited={project.onExited}>
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
