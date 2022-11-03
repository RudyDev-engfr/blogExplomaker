import Image from 'next/image'
import { makeStyles } from '@mui/styles'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import { useRouter } from 'next/router'

const useStyles = makeStyles(theme => ({
  mainContainer: {
    position: 'relative',
    minHeight: '250px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
    },
    [theme.breakpoints.down('sm')]: {
      width: '150px',
      minHeight: '145px',
    },
  },
}))
const ContinentCard = ({
  continentImg,
  continentTitle,
  continentHoverImg,
  isHovering,
  setIsHovering,
  index,
  url,
}) => {
  const classes = useStyles()
  const router = useRouter()
  return (
    <>
      <Paper
        elevation={1}
        className={classes.mainContainer}
        onMouseEnter={() => setIsHovering(index)}
        onMouseLeave={() => setIsHovering(false)}
        onClick={() => router.push(`results?${url}`)}
      >
        <Image
          src={isHovering === index ? continentHoverImg : continentImg}
          width={250}
          height={150}
        />
        <Typography color={isHovering === index ? 'white' : ''}>{continentTitle}</Typography>
      </Paper>
    </>
  )
}
export default ContinentCard
