const Button = ({ classname, backgroundColor, color, onClick, children }) => {
  const classes = `px-6 py-2.5 rounded-3xl ${classname}`
  return (
    <button type="button" className={classes} style={{ backgroundColor, color }} onClick={onClick}>
      <span className="font-semibold">{children}</span>
    </button>
  )
}

export default Button