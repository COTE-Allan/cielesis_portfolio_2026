import {playSound} from '../sound/sound';
import './Button.scss';

// white gradient button, rendered as a link when `href` is given.
export function Button({href, className = '', sound = 'click', onClick, children, ...props}) {
  const classes = `button ${className}`;
  const handleClick = (event) => {
    if (sound) playSound(sound);
    onClick?.(event);
  };

  if (href) {
    return (
      <a href={href} className={classes} onClick={handleClick} {...props}>
        {children}
      </a>
    );
  }

  return (
    <button type="button" className={classes} onClick={handleClick} {...props}>
      {children}
    </button>
  );
}
