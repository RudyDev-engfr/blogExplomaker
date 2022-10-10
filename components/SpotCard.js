import Box from '@mui/material/Box'
import ButtonBase from '@mui/material/ButtonBase'
import Paper from '@mui/material/Paper'
import Typography from '@mui/material/Typography'
import makeStyles from '@mui/styles/makeStyles'
import ArrowRightAlt from '@mui/icons-material/ArrowRightAlt'
import Link from 'next/link'

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
      top: '-40px',
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
      left: '70px',
    },
  },
  spotList: {
    maxWidth: '285px',
    fontSize: '20px',
    fontWeight: '500',
    color: '#333333',
    textAlign: 'start',
  },
  arrowList: {
    color: '#DFDFDF',
    fontSize: '2.125rem',
  },
}))

const SpotCard = ({ data }) => {
  const classes = useStyles()
  const { continent, titre: title, introduction, links } = data

  return (
    <Paper elevation={2} className={classes.spotCard}>
      <Box>
        <Typography className={classes.cardTitle}>{continent}</Typography>
      </Box>
      <Box marginBottom="12px">
        <Typography variant="h1" component="h2">
          {title}
        </Typography>
      </Box>
      <Box marginBottom="40px">
        <Typography>{introduction}</Typography>
      </Box>
      {links.map(({ link /* TODO */, titre: linkTitle }) => (
        // eslint-disable-next-line @next/next/link-passhref
        <Link key={link} href={`/spot/${link}`}>
          <Box display="flex" width="100%" marginBottom="30px" component={ButtonBase}>
            <Box marginRight="25px">
              <ArrowRightAlt className={classes.arrowList} />
            </Box>
            <Typography className={classes.spotList}>{linkTitle}</Typography>
          </Box>
        </Link>
      ))}
    </Paper>
  )
}

export default SpotCard
