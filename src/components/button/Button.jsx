import './Button.scss';

// white gradient button. renders a link when `href` is given.
export function Button({href, className = '', children, ...props}) {
  const classes = `button ${className}`;

  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {children}
      </a>
    );
  }

  return (
    <button type="button" className={classes} {...props}>
      {children}
    </button>
  );
}
