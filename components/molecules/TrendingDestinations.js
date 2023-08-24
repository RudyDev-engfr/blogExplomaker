import { useTheme } from '@mui/material'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import useMediaQuery from '@mui/material/useMediaQuery'
import makeStyles from '@mui/styles/makeStyles'
import clsx from 'clsx'
import MultiCarousel from 'react-multi-carousel'
import 'react-multi-carousel/lib/styles.css'

import CountryTile from '../atoms/CountryTile'
import TrendingDestinationsDotBox from '../multi-carousel/TrendingDestinationsDotBox'
import TrendingDestinationsGroupButton from '../multi-carousel/TrendingDestinationsGroupButton'

const useStyles = makeStyles(theme => ({
  ultraDark: {
    color: theme.palette.primary.ultraDark,
  },
  // Responsive Part
  mobileTextCenter: {
    [theme.breakpoints.down('sm')]: {
      textAlign: 'center',
    },
  },
  mobileAlignCenter: {
    [theme.breakpoints.down('sm')]: {
      textAlign: 'center',
    },
  },
  mobileFlexColumn: {
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
    },
  },
  mobileSizing: {
    [theme.breakpoints.down('sm')]: {
      maxWidth: '90%',
      margin: 'auto',
    },
  },
  mobileSubtitle: {
    [theme.breakpoints.down('sm')]: {
      fontSize: '18px',
      fontWeight: '500',
      lineHeight: '21px',
    },
  },
  mobileTitle: {
    [theme.breakpoints.down('sm')]: {
      fontSize: '38px',
      lineHeight: '43px',
    },
  },
  mobileCarouselItem: {
    [theme.breakpoints.down('sm')]: {
      display: 'flex',
      justifyContent: 'center',
    },
  },
}))

const TrendingDestinations = ({ trendingDestinationsItems, dotListClass }) => {
  const classes = useStyles()
  const theme = useTheme()
  const matchesXs = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <Box className={clsx(classes.mobileAlignCenter, classes.mobileFlexColumn)}>
      <Box
        className={clsx(classes.mobileSizing, classes.mobileFlexColumn, classes.mobileAlignCenter)}
      >
        <Box marginBottom="20px">
          <Typography
            variant="subtitle1"
            className={clsx(classes.mobileSubtitle, classes.ultraDark)}
          >
            Destinations populaires
          </Typography>
        </Box>
        <Box marginBottom="50px">
          <Typography
            variant="h1"
            component="h2"
            className={clsx(classes.mobileTextCenter, classes.mobileTitle)}
          >
            Les destinations du moment ✈️
          </Typography>
        </Box>
      </Box>
      {matchesXs ? (
        <Box sx={{ position: 'relative' }}>
          <MultiCarousel
            itemClass={classes.mobileCarouselItem}
            autoPlaySpeed={3000}
            draggable
            arrows={false}
            focusOnSelect={false}
            infinite
            showDots
            dotListClass={dotListClass}
            customDot={<TrendingDestinationsDotBox carouselArray={trendingDestinationsItems} />}
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
            {trendingDestinationsItems
              .filter(
                ({ picture_titled: pictureTitled, title }) =>
                  pictureTitled?.src?.original !== '' && title !== ''
              )
              .map(
                ({
                  picture_titled: pictureTitled,
                  title,
                  slug,
                  color,
                  meta_continent_text: continent,
                }) => (
                  <CountryTile
                    countryTitle={title}
                    category={continent}
                    srcImg={`https://storage.googleapis.com/explomaker-data-stateless/${pictureTitled?.src?.original}`}
                    altImg=""
                    link={slug}
                    isLarge
                    key={`trendingDestination-${slug}`}
                    categoryColor={color}
                  />
                )
              )}
          </MultiCarousel>
        </Box>
      ) : (
        <Box sx={{ position: 'relative' }}>
          <MultiCarousel
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
            customDot={<TrendingDestinationsDotBox carouselArray={trendingDestinationsItems} />}
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
            {trendingDestinationsItems
              ?.filter(
                ({ picture_titled: pictureTitled, title }) =>
                  pictureTitled?.src?.original !== '' && title !== ''
              )
              .map(
                ({
                  picture_titled: pictureTitled,
                  title,
                  slug,
                  color,
                  meta_continent_text: continent,
                }) => (
                  <CountryTile
                    countryTitle={title}
                    category={continent}
                    categoryColor={color}
                    srcImg={`https://storage.googleapis.com/explomaker-data-stateless/${pictureTitled?.src?.original}`}
                    altImg=""
                    link={slug}
                    key={`trendingDestination-${slug}`}
                  />
                )
              )}
          </MultiCarousel>
        </Box>
      )}
    </Box>
  )
}

export default TrendingDestinations
