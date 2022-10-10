import IconButton from '@mui/material/IconButton'
import makeStyles from '@mui/styles/makeStyles'
import ArrowUpward from '@mui/icons-material/ArrowUpward'
import clsx from 'clsx'

const useStyles = makeStyles(theme => ({
  btn: {
    display: 'none',
    position: 'fixed',
    bottom: '30px',
    right: '15%',
    height: '40px',
    backgroundColor: theme.palette.primary.ultraLight,
    borderRadius: '5px',
    zIndex: '1',
    [theme.breakpoints.down('xl')]: {
      right: '8%',
    },
    [theme.breakpoints.down('lg')]: {
      right: '30px',
    },
  },
  show: { display: 'block' },
}))

const GoTop = ({ show, scrollUp }) => {
  const classes = useStyles()

  return (
    <IconButton
      color="primary"
      className={clsx(classes.btn, { [classes.show]: show })}
      onClick={scrollUp}
    >
      <ArrowUpward />
    </IconButton>
  )
}

export default GoTop
