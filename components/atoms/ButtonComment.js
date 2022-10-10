import CommentIcon from '@mui/icons-material/Comment'
import Button from '@mui/material/Button'
import makeStyles from '@mui/styles/makeStyles'
import clsx from 'clsx'

const useStyles = makeStyles(theme => ({
  buttonComment: {
    fontSize: '14px',
    height: '40px',
    color: theme.palette.grey['4f'],
    backgroundColor: theme.palette.grey.f7,
    borderRadius: '40px',
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
}))

const ButtonComment = ({ commentsCount = '0' }) => {
  const classes = useStyles()

  return (
    <Button
      disableElevation
      variant="contained"
      startIcon={<CommentIcon />}
      className={clsx(classes.buttonComment)}
    >
      {commentsCount}
    </Button>
  )
}

export default ButtonComment
