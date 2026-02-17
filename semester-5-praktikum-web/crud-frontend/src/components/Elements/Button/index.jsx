const ActionButton = ({
  choice,
  onClick,
  label,
  type,
  className = "",
  ...props
}) => (
  <button
    type={choice}
    className={`btn btn-${type} ${className}`}
    onClick={onClick}
    {...props}
  >
    {label}
  </button>
);

export default ActionButton;
