import { Box } from '@mui/material'
import { makeStyles } from '@mui/styles'

import Carousel from 'react-multi-carousel'
import 'react-multi-carousel/lib/styles.css'

import MobileBlogCard from '../molecules/MobileBlogCard'
import TrendingDestinationsDotBox from '../multi-carousel/TrendingDestinationsDotBox'

const useStyles = makeStyles({})
const ArticlesCarousel = ({ currentArticles, dotListClass }) => {
  const classes = useStyles()
  return (
    <Carousel
      itemClass={classes.mobileSpotsCarouselItem}
      autoPlaySpeed={3000}
      draggable
      arrows={false}
      focusOnSelect={false}
      infinite={currentArticles.length > 1}
      showDots
      dotListClass={dotListClass}
      customDot={<TrendingDestinationsDotBox carouselArray={currentArticles} />}
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
            max: 660,
            min: 0,
          },
          items: 1,
        },
        tablet: {
          breakpoint: {
            max: 960,
            min: 660,
          },
          items: 2,
        },
      }}
      slidesToSlide={1}
      swipeable
      ssr
      deviceType="mobile"
      partialVisible
    >
      {currentArticles.map(
        ({
          picture,
          creation_date: creationDate,
          target_url: targetURL,
          sub_type: subType,
          title,
          reading_time: readingTime,
        }) => (
          <Box display="flex" sx={{ margin: 'auto', padding: '5px' }}>
            <MobileBlogCard
              srcImg={`https://storage.googleapis.com/explomaker-data-stateless/${encodeURI(
                picture.src.original
              )}`}
              title={title}
              publishDate={creationDate}
              category={subType[0].name}
              targetLink={targetURL}
              readingTime={readingTime}
            />
          </Box>
        )
      )}
    </Carousel>
  )
}
export default ArticlesCarousel
