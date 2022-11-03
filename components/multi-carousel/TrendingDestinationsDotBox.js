import ButtonBase from '@mui/material/ButtonBase'
import Box from '@mui/material/Box'
import makeStyles from '@mui/styles/makeStyles'
import clsx from 'clsx'
import React from 'react'

const useStyles = makeStyles(theme => ({
  indicatorsCountryGallery: {
    height: '6px',
    width: '6px',
    borderRadius: '50px',
    backgroundColor: theme.palette.primary.ultraLight,
  },
  activeColor: {
    backgroundColor: theme.palette.primary.main,
  },
  trendingDotBox: {
    display: 'flex',
    flexWrap: 'wrap',
    mt: 5,
    transform: 'translateY(50px)',
    zIndex: '10',
    alignSelf: 'flex-start',
    [theme.breakpoints.down('sm')]: {
      alignSelf: 'center',
    },
  },
}))
const TrendingDestinationsDotBox = ({ carouselArray, onClick, ...rest }) => {
  const { active } = rest
  // onMove means if dragging or swiping in progress.
  // active is provided by this lib for checking if the item is active or not.
  const classes = useStyles()
  return (
    <Box className={classes.trendingDotBox}>
      <Box
        component={ButtonBase}
        onClick={() => onClick()}
        height="12px"
        mx={1}
        borderRadius="50px"
      >
        <Box
          className={clsx(classes.indicatorsCountryGallery, {
            [classes.activeColor]: active,
          })}
        />
      </Box>
    </Box>
  )
}
export default TrendingDestinationsDotBox
