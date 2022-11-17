import { makeStyles } from '@mui/styles'
import Image from 'next/image'

import Carousel from 'react-multi-carousel'
import 'react-multi-carousel/lib/styles.css'

const useStyles = makeStyles({})

const CustomBlock = props => {
  const { attrs, innerHTML } = props
  const classes = useStyles()
  return (
    <Carousel
      autoPlaySpeed={3000}
      centerMode
      draggable
      arrows={false}
      focusOnSelect={false}
      infinite
      renderButtonGroupOutside
      // customButtonGroup={<TrendingDestinationsGroupButton />}
      // showDots
      // dotListClass={dotListClass}
      // customDot={<TrendingDestinationsDotBox carouselArray={trendingDestinationsItems} />}
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
      {attrs.data.blog_log_list.map(image => (
        <Image src={image} layout="fill" />
      ))}
    </Carousel>
  )
}
export default CustomBlock
