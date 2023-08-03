import { useMediaQuery } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { makeStyles, useTheme } from '@mui/styles'
import Image from 'next/image'
import Carousel from 'react-multi-carousel'
import TrendingDestinationsDotBox from '../multi-carousel/TrendingDestinationsDotBox'
import TrendingDestinationsGroupButton from '../multi-carousel/TrendingDestinationsGroupButton'

const useStyles = makeStyles(theme => ({
  carouselImage: {
    width: '660px',
    height: '374px',
    [theme.breakpoints.down('sm')]: {
      width: '284px',
      height: '210px',
    },
  },
}))

const ArticleImageCarousel = ({ currentImages, dotListClass }) => {
  const classes = useStyles()
  const theme = useTheme()
  const matchesXs = useMediaQuery(theme.breakpoints.down('sm'))

  return matchesXs ? (
    <Carousel
      itemClass={classes.mobileCarouselItem}
      autoPlaySpeed={3000}
      draggable
      arrows={false}
      focusOnSelect={false}
      infinite
      showDots
      dotListClass={dotListClass}
      customDot={<TrendingDestinationsDotBox carouselArray={currentImages} />}
      renderDotsOutside
      keyBoardControl
      minimumTouchDrag={80}
      responsive={{
        desktop: {
          breakpoint: {
            max: 3000,
            min: 640,
          },
          items: 1,
        },
        mobile: {
          breakpoint: {
            max: 640,
            min: 0,
          },
          items: 1,
        },
      }}
      slidesToSlide={1}
      swipeable
      ssr
      deviceType="mobile"
    >
      {currentImages.map(image => (
        <Image
          layout="fill"
          src={image.src}
          className={classes.carouselImage}
          alt="carousel_image"
        />
      ))}
    </Carousel>
  ) : (
    <Carousel
      autoPlaySpeed={3000}
      centerMode
      draggable
      arrows={false}
      focusOnSelect={false}
      infinite
      renderButtonGroupOutside
      customButtonGroup={<TrendingDestinationsGroupButton />}
      showDots
      dotListClass={dotListClass}
      customDot={<TrendingDestinationsDotBox carouselArray={currentImages} />}
      renderDotsOutside
      keyBoardControl
      minimumTouchDrag={80}
      partialVisible={false}
      responsive={{
        desktop: {
          breakpoint: {
            max: 3000,
            min: 640,
          },
          items: 3,
          partialVisibilityGutter: 40,
        },
        mobile: {
          breakpoint: {
            max: 640,
            min: 0,
          },
          items: 1,
          partialVisibilityGutter: 30,
        },
      }}
      slidesToSlide={1}
      swipeable
      ssr
      deviceType="desktop"
    >
      {currentImages.map(image => (
        <Box sx={{ position: 'relative' }}>
          <Image
            layout="fill"
            src={image.src}
            className={classes.carouselImage}
            alt="carousel_image"
          />
          <Button>Découvrir</Button>
        </Box>
      ))}
    </Carousel>
  )
}
export default ArticleImageCarousel
