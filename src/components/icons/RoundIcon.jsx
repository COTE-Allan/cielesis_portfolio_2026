import './RoundIcon.scss';

// rounded icon from the Material Symbols Rounded library (loaded in index.html).
// `name` is the icon name from https://fonts.google.com/icons?icon.style=Rounded
export function RoundIcon({name, filled = false, className = '', ...props}) {
  return (
    <span
      className={`round-icon ${className}`}
      data-filled={filled ? '' : undefined}
      aria-hidden="true"
      {...props}
    >
      {name}
    </span>
  );
}
