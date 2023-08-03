import Image from 'next/legacy/image'
import { makeStyles, useTheme } from '@mui/styles'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import { useRouter } from 'next/router'
import { useMediaQuery } from '@mui/material'
import clsx from 'clsx'

const useStyles = makeStyles(theme => ({
  mainContainer: {
    position: 'relative',
    minHeight: '250px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
    },
    [theme.breakpoints.down('sm')]: {
      width: '40vw',
      minHeight: '145px',
    },
  },
  mainContainerOversized: {
    minHeight: '170px',
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
  isOversized = false,
}) => {
  const classes = useStyles()
  const router = useRouter()
  const theme = useTheme()
  const matchesXs = useMediaQuery(theme.breakpoints.down('sm'))
  return (
    <>
      <Paper
        elevation={1}
        className={clsx(classes.mainContainer, { [classes.mainContainerOversized]: isOversized })}
        onMouseEnter={() => setIsHovering(index)}
        onMouseLeave={() => setIsHovering(false)}
        onClick={() => router.push(`results?${url}`)}
      >
        <Image
          src={isHovering === index ? continentHoverImg : continentImg}
          width={250}
          height={150}
          alt="continent_image"
        />
        <Typography
          sx={{ fontSize: matchesXs ? '17px' : '22px', padding: '0 20px' }}
          color={isHovering === index ? 'white' : ''}
          textAlign="center"
        >
          {continentTitle}
        </Typography>
      </Paper>
    </>
  )
}
export default ContinentCard
