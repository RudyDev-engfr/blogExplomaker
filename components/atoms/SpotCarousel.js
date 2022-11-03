import { makeStyles } from '@mui/styles'

import Carousel from 'react-multi-carousel'
import 'react-multi-carousel/lib/styles.css'

const useStyles = makeStyles({})
const SpotCarousel = ({ currentSpots, isShowingMoreSpots }) => {
  const classes = useStyles()
  return (
    <Carousel
      itemClass={classes.mobileSpotsCarouselItem}
      autoPlaySpeed={3000}
      draggable
      arrows={false}
      focusOnSelect={false}
      infinite={currentSpots.length > 1}
      showDots={false}
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
          partialVisibilityGutter: 40,
        },
      }}
      slidesToSlide={1}
      swipeable
      ssr
      deviceType="mobile"
      partialVisible
    >
      {currentSpots
        .filter((currentSpot, index) => (isShowingMoreSpots ? true : index <= 5))
        .map(({ titre: title, country, picture, color, slug }) => (
          <Box display="flex" sx={{ margin: 'auto', marginBottom: '30px' }}>
            <CountryTile
              countryTitle={title}
              category={country}
              srcImg={encodeURI(picture)}
              categoryColor={color}
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
