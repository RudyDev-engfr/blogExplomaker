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
  rootCard: {
    width: '262.5px',
    height: '250px',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    backgroundColor: theme.palette.grey.f7,
    [theme.breakpoints.down('sm')]: {
      width: '40vw',
      height: '160px',
    },
  },
  cardTitle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '86px',
    [theme.breakpoints.down('sm')]: {
      height: '65px',
      position: 'relative',
    },
  },
  nextLink: {
    textDecoration: 'none',
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
      <Card className={classes.rootCard}>
        <CardActionArea sx={{ minHeight: '100%' }}>
          <CardMedia component="span">
            <Box sx={{ position: 'relative', height: '100%', width: '100%' }}>
              <Image
                src={`https://storage.googleapis.com/explomaker-data-stateless/${encodeURI(
                  srcImg
                )}`}
                alt={altImg ?? 'thematicCard_image'}
                width={262.5}
                height={164}
                className={classes.tileImg}
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                  objectFit: 'cover',
                  objectPosition: 'center',
                  maxHeight: matchesXs ? '95px' : '160px',
                }}
              />
            </Box>
          </CardMedia>
          <CardContent sx={{ padding: '0' }}>
            <Box className={classes.cardTitle}>
              <Typography
                sx={{
                  fontSize: '18px',
                  padding: '0 15px',
                  textAlign: 'center',
                  [theme.breakpoints.down('sm')]: {
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                  },
                  width: '100%',
                }}
                textAlign={matchesXs && 'center'}
              >
                {title}
              </Typography>
            </Box>
          </CardContent>
        </CardActionArea>
      </Card>
    </Link>
  )
}
export default ThematicCard
