import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import { makeStyles, useTheme } from '@mui/styles'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'

const useStyles = makeStyles(theme => ({
  rootBox: {
    width: '262.5px',
    height: '250px',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    borderRadius: '20px',
    backgroundColor: theme.palette.grey.f7,
    [theme.breakpoints.down('sm')]: {
      width: 'calc(50vw - 40px)',
      height: '200px',
    },
  },
  nextLink: {
    textDecoration: 'none',
  },
  tileImg: {
    borderRadius: '20px',
  },
}))
const ThematicCard = ({ title, srcImg, altImg, link }) => {
  const classes = useStyles()
  const router = useRouter()
  const theme = useTheme()
  const matchesXs = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <Link
      href={`/exploration?${link}`}
      passHref
      target={!matchesXs && '_blank'}
      className={classes.nextLink}
    >
      <Box className={classes.rootBox}>
        <Box
          sx={{
            position: 'relative',
            height: '100%',
            width: '100%',
            minHeight: '250px',
            [theme.breakpoints.down('sm')]: { minHeight: '160px' },
          }}
        >
          <Image
            src={`https://storage.googleapis.com/explomaker-data-stateless/${encodeURI(srcImg)}`}
            alt={altImg ?? 'thematicCard_image'}
            fill
            className={classes.tileImg}
            style={{
              maxWidth: '100%',
              objectFit: 'cover',
              objectPosition: 'center',
              maxHeight: matchesXs ? '300px' : '250px',
            }}
          />
        </Box>
        <Box
          sx={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: 0,
            background: 'rgb(31 31 31 / 33%)',
            borderRadius: '20px',
            zIndex: 0,
          }}
        />
        <Typography
          sx={{
            fontSize: '20px',
            fontWeight: 600,
            padding: '0 15px',
            textAlign: 'center',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            [theme.breakpoints.down('sm')]: {
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            },
            width: '100%',
            color: theme.palette.secondary.contrastText,
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5), -2px -2px 4px rgba(255, 255, 255, 0.3)',
          }}
          textAlign={matchesXs && 'center'}
        >
          {title}
        </Typography>
      </Box>
    </Link>
  )
}
export default ThematicCard
