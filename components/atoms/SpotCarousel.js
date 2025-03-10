import Box from '@mui/material/Box'
import { makeStyles } from '@mui/styles'

import Carousel from 'react-multi-carousel'
import 'react-multi-carousel/lib/styles.css'
import TrendingDestinationsDotBox from '../multi-carousel/TrendingDestinationsDotBox'

import CountryTile from './CountryTile'

const useStyles = makeStyles({})
const SpotCarousel = ({ currentSpots, isShowingMoreSpots, dotListClass, infinite = true }) => {
  const classes = useStyles()
  return (
    <Carousel
      itemClass={classes.mobileSpotsCarouselItem}
      autoPlaySpeed={3000}
      draggable
      arrows={false}
      focusOnSelect={false}
      infinite={infinite}
      showDots
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
      dotListClass={dotListClass}
      customDot={<TrendingDestinationsDotBox carouselArray={currentSpots} />}
      ssr
      deviceType="mobile"
      partialVisible
    >
      {currentSpots
        .filter((currentSpot, index) => (isShowingMoreSpots ? true : index <= 5))
        .map(({ title, gps, picture, color, slug }) => (
          <Box display="flex" sx={{ margin: 'auto', marginBottom: '30px' }}>
            <CountryTile
              countryTitle={title}
              category={gps.country}
              srcImg={`https://storage.googleapis.com/explomaker-data-stateless/${encodeURI(
                picture.src.original
              )}`}
              categoryColor={color}
              isLarge
              altImg=""
              key={`spot/${slug}`}
              link={slug}
              className={classes.mobileBlogCardAndCountryTile}
            />
          </Box>
        ))}
    </Carousel>
  )
}
export default SpotCarousel
