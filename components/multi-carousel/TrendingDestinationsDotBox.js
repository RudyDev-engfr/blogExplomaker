import ButtonBase from '@mui/material/ButtonBase'
import Box from '@mui/material/Box'
import makeStyles from '@mui/styles/makeStyles'
import clsx from 'clsx'
import React from 'react'

const useStyles = makeStyles(theme => ({
  indicatorsCountryGallery: {
    height: '15px',
    width: '15px',
    borderRadius: '50px',
    backgroundColor: theme.palette.grey.df,
  },
  activeColor: {
    backgroundColor: theme.palette.primary.main,
  },
  activeColorResults: {
    backgroundColor: `${theme.palette.primary.ultraDark} !important`,
    height: '8px',
    width: '8px',
  },
  passiveColorResults: {
    backgroundColor: theme.palette.primary.main,
    marginBottom: '5px',
  },
  trendingDotBox: {
    display: 'flex',
    flexWrap: 'wrap',
    mt: 5,
    transform: 'translateY(50px)',
    zIndex: '3',
    alignSelf: 'flex-start',
    [theme.breakpoints.down('sm')]: {
      alignSelf: 'center',
    },
  },
}))
const TrendingDestinationsDotBox = ({ carouselArray, isResults = false, onClick, ...rest }) => {
  const { active } = rest
  // onMove means if dragging or swiping in progress.
  // active is provided by this lib for checking if the item is active or not.
  const classes = useStyles()
  return (
    <Box className={classes.trendingDotBox}>
      <Box
        component={ButtonBase}
        onClick={() => onClick()}
        height="10px"
        mx={1}
        borderRadius="50px"
        marginBottom="10px"
      >
        <Box
          className={clsx(classes.indicatorsCountryGallery, {
            [classes.activeColor]: active,
            [classes.passiveColorResults]: isResults,
            [classes.activeColorResults]: active && isResults,
          })}
        />
      </Box>
    </Box>
  )
}
export default TrendingDestinationsDotBox
