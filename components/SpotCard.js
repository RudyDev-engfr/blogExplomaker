import Box from '@mui/material/Box'
import ButtonBase from '@mui/material/ButtonBase'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import makeStyles from '@mui/styles/makeStyles'
import ArrowRightAlt from '@mui/icons-material/ArrowRightAlt'
import Link from 'next/link'
import { useTheme } from '@mui/styles'
import { useMediaQuery } from '@mui/material'

const useStyles = makeStyles(theme => ({
  spotCard: {
    position: 'absolute',
    maxWidth: '460px',
    right: '0',
    bottom: '-84px',
    zIndex: '2',
    borderRadius: '20px',
    padding: '60px 40px 40px 40px',
    [theme.breakpoints.down('sm')]: {
      maxWidth: '80%',
      position: 'relative',
      top: '-95px',
      padding: '40px 30px 30px',
    },
  },
  cardTitle: {
    color: '#009D8C',
    backgroundColor: '#E6F5F4',
    fontSize: '1rem',
    fontWeight: '500',
    display: 'inline-block',
    padding: '8px 15px',
    borderRadius: '5px',
    position: 'absolute',
    top: '-20px',
    left: '40px',
    textTransform: 'uppercase',
    [theme.breakpoints.down('sm')]: {
      left: 'unset',
    },
  },
  spotList: {
    maxWidth: '285px',
    fontSize: '20px',
    fontWeight: '500',
    color: '#333333',
    textAlign: 'left',
    [theme.breakpoints.down('sm')]: {
      maxWidth: 'unset',
    },
  },
  arrowList: {
    color: '#DFDFDF',
    fontSize: '2.125rem',
  },
  nextLink: {
    textDecoration: 'none',
  },
}))

const SpotCard = ({ data }) => {
  const classes = useStyles()
  const theme = useTheme()
  const matchesXs = useMediaQuery(theme.breakpoints.down('sm'))
  const { continent, titre: title, introduction, links } = data

  return (
    <Paper elevation={2} className={classes.spotCard}>
      <Box display={matchesXs && 'flex'} justifyContent={matchesXs && 'center'}>
        <Typography className={classes.cardTitle}>{continent}</Typography>
      </Box>
      <Box marginBottom="12px">
        <Typography
          variant="h1"
          component="h2"
          sx={{
            [theme.breakpoints.down('sm')]: {
              fontSize: '28px',
              lineHeight: '32px',
              fontWeight: '500',
              maxWidth: '100%',
            },
          }}
        >
          {title}
        </Typography>
      </Box>
      <Box marginBottom="40px">
        <Typography sx={{ maxWidth: '100% !important', wordBreak: 'break-word' }}>
          {introduction}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
        {links.map(({ link /* TODO */, titre: linkTitle }) => (
          <Link key={link} href={`${link}`} target="_blank" className={classes.nextLink}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-start',
                width: '100%',
                marginBottom: '30px',
              }}
              component={ButtonBase}
            >
              <Box marginRight="25px">
                <ArrowRightAlt className={classes.arrowList} />
              </Box>
              <Typography className={classes.spotList}>{linkTitle}</Typography>
            </Box>
          </Link>
        ))}
      </Box>
    </Paper>
  )
}

export default SpotCard
