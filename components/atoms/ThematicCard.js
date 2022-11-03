import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
  useMediaQuery,
} from '@mui/material'
import Box from '@mui/material/Box'
import { makeStyles, useTheme } from '@mui/styles'
import Image from 'next/image'
import { useRouter } from 'next/router'

const useStyles = makeStyles(theme => ({
  rootCard: {
    width: '262.5px',
    height: '250px',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    [theme.breakpoints.down('sm')]: {
      width: '150px',
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
    },
  },
}))
const ThematicCard = ({ title, srcImg, altImg, link }) => {
  const classes = useStyles()
  const router = useRouter()
  const theme = useTheme()
  const matchesXs = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <Card className={classes.rootCard}>
      <CardActionArea onClick={() => router.push(`/results?${link}`)}>
        <CardMedia component="span">
          <Box position="relative" height="100%" width="100%">
            <Image
              src={`https://storage.googleapis.com/stateless-www-explomaker-fr/${encodeURI(
                srcImg
              )}`}
              alt={altImg}
              width={262.5}
              height={164}
              objectFit="cover"
              className={classes.tileImg}
            />
          </Box>
        </CardMedia>
        <CardContent sx={{ padding: '0' }}>
          <Box className={classes.cardTitle}>
            <Typography textAlign={matchesXs && 'center'}>{title}</Typography>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}
export default ThematicCard
