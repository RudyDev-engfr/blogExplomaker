import Image from 'next/image'
import { makeStyles } from '@mui/styles'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'

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
  },
}))
const ContinentCard = ({
  continentImg,
  continentTitle,
  continentHoverImg,
  isHovering,
  setIsHovering,
  index,
}) => {
  const classes = useStyles()
  return (
    <>
      <Paper
        elevation="1"
        className={classes.mainContainer}
        onMouseEnter={() => setIsHovering(index)}
        onMouseLeave={() => setIsHovering(false)}
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
