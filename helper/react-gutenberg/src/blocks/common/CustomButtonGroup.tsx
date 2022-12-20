/* eslint-disable react/jsx-filename-extension */
// eslint-disable-next-line no-use-before-define
import * as React from 'react'
import ArrowRightAlt from '@material-ui/icons/ArrowRightAlt'
import { Box, Button, createStyles } from '@mantine/core'
import { ButtonGroupProps } from 'react-multi-carousel/lib/types'

const useStyles = createStyles({
  buttonsSpot: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    top: '76px',
    right: '-20px',
    zIndex: 3,
    height: '100px',
  },
  carouselArrow: {
    color: '#009D8C',
    backgroundColor: '#E6F5F4',
    borderRadius: '5px',
    width: '70px',
    height: '45px',
    '&:hover': {
      backgroundColor: '#E6F5F4',
    },
  },
})

interface CarouselButtonGroupProps extends ButtonGroupProps {}

const CustomButtonGroup = ({ next, previous }: CarouselButtonGroupProps) => {
  const { classes } = useStyles()

  return (
    <Box className={classes.buttonsSpot}>
      <Button
        className={classes.carouselArrow}
        onClick={() => {
          previous()
          console.log('salut')
        }}
      >
        <ArrowRightAlt style={{ transform: 'rotate(180deg)' }} fontSize="large" />
      </Button>
      <Button className={classes.carouselArrow} onClick={() => next()}>
        <ArrowRightAlt fontSize="large" />
      </Button>
    </Box>
  )
}
export default CustomButtonGroup
