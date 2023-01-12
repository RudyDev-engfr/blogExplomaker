import { Box, Paper, Typography, useMediaQuery } from '@mui/material'
import { makeStyles, useTheme } from '@mui/styles'
import Image from 'next/image'

import MobileSearchButton from '../components/atoms/MobileSearchButton'
import WPGBlocks from '../helper/react-gutenberg'

import headerImg from '../images/Kenya 2.png'
import mobileHeaderImg from '../images/tom-pavlakos-NQuDiZISPtk-unsplash2.png'
import { database } from '../lib/firebase'

const useStyles = makeStyles(theme => ({
  headerMapBox: {
    position: 'relative',
    top: '84px',
    width: '100%',
    height: '450px',
    [theme.breakpoints.down('sm')]: {
      top: '0',
      width: '100vw',
      maxWidth: '100vw',
    },
  },
  headingPaper: {
    padding: '50px 50px 30px 60px',
    position: 'relative',
    borderRadius: '40px 40px 0 0',
    display: 'flex',
    justifyContent: 'center',
    margin: 'auto',
    [theme.breakpoints.down('sm')]: {
      padding: '40px 30px 30px 30px',
    },
    '& a': {
      textTransform: 'none',
      textDecoration: 'none',
      color: theme.palette.primary.main,
    },
    '& p': {
      maxWidth: 'unset !important',
    },
    // '& strong': {
    //   color: theme.palette.primary.main,
    // },
    '& figCaption': {
      maxWidth: '80%',
      overflow: 'hidden',
      padding: '6px 10px',
      backgroundColor: theme.palette.primary.ultraLight,
      color: theme.palette.primary.main,
      fontSize: '14px',
      fontWeight: 500,
      lineHeight: '22px',
      position: 'relative',
      top: '-20px',
      left: '10%',
      borderRadius: '5px',
      zIndex: 3,
    },
    '& h2': {
      fontSize: '38px',
      fontWeight: '400',
      lineHeight: '44px',
      color: theme.palette.primary.ultraDark,
    },
    '& img': {
      borderRadius: '20px',
      [theme.breakpoints.down('sm')]: {
        position: 'relative',
      },
    },
  },
  mainContainer: {
    maxWidth: '1240px',
    margin: 'auto',
    [theme.breakpoints.down('sm')]: {
      width: '100vw',
      maxWidth: '100vw',
    },
  },
}))

export async function getStaticProps() {
  let dataset
  const doc = await database.ref().child(`content/pages/crash`).get()
  if (doc.exists()) {
    dataset = doc.val()
  }

  return {
    props: { dataset },
    revalidate: 1,
  }
}

const Crash = ({ dataset }) => {
  const classes = useStyles()
  const theme = useTheme()
  const matchesXs = useMediaQuery(theme.breakpoints.down('sm'))
  return (
    <Box>
      {matchesXs && <MobileSearchButton />}
      <Box className={classes.headerMapBox}>
        <Image src={!matchesXs ? headerImg : mobileHeaderImg} layout="fill" objectFit="cover" />
      </Box>
      <Box className={classes.mainContainer} sx={{ position: 'relative', top: '-100px' }}>
        <Paper elevation={0} className={classes.headingPaper}>
          <Box
            sx={{
              [theme.breakpoints.down('sm')]: { maxWidth: 'calc(100vw - 60px)' },
            }}
          >
            <Typography variant="h1">{dataset.title}</Typography>
            <WPGBlocks blocks={dataset.blocks} />
          </Box>
        </Paper>
      </Box>
    </Box>
  )
}
export default Crash
