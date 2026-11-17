import './RoundIcon.scss';

// rounded icon from the material symbols rounded library, named as on fonts.google.com/icons.
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
