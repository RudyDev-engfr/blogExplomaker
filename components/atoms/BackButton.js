import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import Button from '@mui/material/Button'
import makeStyles from '@mui/styles/makeStyles'
import clsx from 'clsx'
import { useRouter } from 'next/router'

const useStyles = makeStyles(theme => ({
  buttonBack: {
    backgroundColor: theme.palette.primary.ultraLight,
    color: theme.palette.primary.main,
    height: '35px',
    borderRadius: '5px',
    '&:hover': {
      backgroundColor: theme.palette.primary.ultraLight,
    },
  },
}))

const BackButton = ({ className }) => {
  const classes = useStyles()
  const router = useRouter()

  return (
    <Button
      disableElevation
      variant="contained"
      startIcon={<ArrowBackIcon />}
      className={clsx(classes.buttonBack, className)}
      onClick={() => router.back()}
    >
      Retour
    </Button>
  )
}

export default BackButton
