import Box from '@mui/material/Box'
import ButtonBase from '@mui/material/ButtonBase'
import makeStyles from '@mui/styles/makeStyles'
import clsx from 'clsx'

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
}))

const IndicatorBox = ({ currentArray, setter, currentActiveIndex }) => {
  const classes = useStyles()

  return (
    <Box display="flex" flexWrap="wrap" mt={5}>
      {currentArray.map((element, elementIndex) => (
        <Box
          component={ButtonBase}
          onClick={() => setter(elementIndex)}
          height="15px"
          width="15px"
          mx={1}
          borderRadius="50px"
          // eslint-disable-next-line react/no-array-index-key
          key={elementIndex}
        >
          <Box
            className={clsx(classes.indicatorsCountryGallery, {
              [classes.activeColor]: elementIndex === currentActiveIndex,
            })}
          />
        </Box>
      ))}
    </Box>
  )
}

export default IndicatorBox
