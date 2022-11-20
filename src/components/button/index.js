const Button = ({ classname, backgroundColor, color, children }) => {
  const classes = `px-6 py-2.5 rounded-3xl ${classname}`
  return (
    <button type="button" className={classes} style={{ backgroundColor, color }}>
      <span className="font-semibold">{children}</span>
    </button>
  )
}

export default Button