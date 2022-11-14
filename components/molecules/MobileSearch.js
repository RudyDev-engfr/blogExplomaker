import { useState } from 'react'
import Image from 'next/image'

import { makeStyles, useTheme } from '@mui/styles'
import PropTypes from 'prop-types'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { Button, useMediaQuery } from '@mui/material'

import Carousel from 'react-multi-carousel'
import 'react-multi-carousel/lib/styles.css'

import CountryTile from '../atoms/CountryTile'
import ArticlesList from './ArticlesList'
import union from '../../images/icons/Union.svg'
import MobileSearchFilter from './MobileSearchFilter'
import TrendingDestinationsDotBox from '../multi-carousel/TrendingDestinationsDotBox'

const useStyles = makeStyles(theme => ({
  filterButton: {
    color: theme.palette.grey.grey33,
    borderRadius: '5px',
    fontSize: '14px',
    padding: '6px 13px',
    height: '32px',
    backgroundColor: theme.palette.grey.e5,
    '&::before': {
      '&:hover': {
        backgroundColor: theme.palette.grey.e5,
      },
    },
    '&:hover': {
      backgroundColor: theme.palette.grey.e5,
    },
  },
  tabRoot: {
    fontSize: '16px',
    textTransform: 'none',
    fontWeight: '400',
  },
  destinationsCarouselRoot: {
    right: 'unset',
    flexWrap: 'wrap',
  },
}))

function TabPanel(props) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ padding: '40px 30px 130px 30px', backgroundColor: '#e5e5e5' }}>{children}</Box>
      )}
    </div>
  )
}

TabPanel.propTypes = {
  // eslint-disable-next-line react/require-default-props
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  }
}
const MobileSearch = ({
  currentSpots,
  currentArticles,
  isShowingMoreArticles,
  setIsShowingMoreArticles,
  isShowingMoreSpots,
  setIsShowingMoreSpots,
  modalStateSetter,
  modalState,
}) => {
  const classes = useStyles()
  const theme = useTheme()
  const matchesXs = useMediaQuery(theme.breakpoints.down('sm'))
  const [value, setValue] = useState(0)
  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  const AllSpotIntegration = () => (
    <>
      {currentSpots
        .filter((spot, index) => index <= 19)
        .map(({ titre: title, country, picture, color, slug }) => (
          <Box display="flex" sx={{ margin: 'auto', marginBottom: '20px' }}>
            <CountryTile
              countryTitle={title}
              category={country}
              srcImg={encodeURI(picture)}
              categoryColor={color}
              altImg=""
              key={`spot/${slug}`}
              link={slug}
              className={classes.mobileBlogCardAndCountryTile}
              isLarge
            />
          </Box>
        ))}
    </>
  )

  const SpotIntegration = () => (
    <>
      <Box marginBottom="22px" display="flex" justifyContent="space-between" alignItems="center">
        {currentSpots.length > 0 && (
          <Typography variant="h3" component="h2">
            Destinations({currentSpots.length > 6 ? '6+' : currentSpots.length})
          </Typography>
        )}
        {currentSpots.length > 6 && (
          <Button
            sx={{
              textTransform: 'none',
              height: '32px',
              borderRadius: '5px',
              fontSize: '14px',
              fontWeight: '500',
            }}
            variant="contained"
            onClick={() => setValue(1)}
          >
            Voir tout
          </Button>
        )}
      </Box>
      <Box sx={{ position: 'relative', marginBottom: '90px' }}>
        <Carousel
          itemClass={classes.mobileSpotsCarouselItem}
          autoPlaySpeed={3000}
          draggable
          arrows={false}
          focusOnSelect={false}
          customDot={<TrendingDestinationsDotBox carouselArray={currentSpots} isResults />}
          infinite={currentSpots.length > 1}
          showDots
          dotListClass={classes.destinationsCarouselRoot}
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
            .filter((currentSpot, index) => (isShowingMoreSpots ? index <= 9 : index <= 5))
            .map(({ titre: title, country, picture, color, slug }) => (
              <Box display="flex" sx={{ margin: 'auto', marginBottom: '10px' }}>
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
      </Box>
    </>
  )

  const ArticleIntegration = () => (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        {currentArticles.length > 0 && (
          <Typography variant="h3" component="h2">
            Articles({currentArticles.length})
          </Typography>
        )}
        {currentArticles.length > 5 && (
          <Button
            sx={{
              textTransform: 'none',
              height: '32px',
              borderRadius: '5px',
              fontSize: '14px',
              fontWeight: '500',
            }}
            variant="contained"
            onClick={() => setValue(2)}
          >
            Voir Tout
          </Button>
        )}
      </Box>
      <Box className={classes.articlesResultContainer}>
        {currentArticles.length > 0 && (
          <ArticlesList
            data={currentArticles}
            isShowingMoreArticles={isShowingMoreArticles}
            isAlgolia
            numberOfArticles={5}
          />
        )}
      </Box>
    </>
  )

  return (
    <>
      <Box
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
          width: '100vw !important',
          position: 'fixed',
          top: '95px',
          backgroundColor: theme.palette.secondary.contrastText,
          zIndex: 900,
        }}
      >
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" centered>
          <Tab label="Tout" {...a11yProps(0)} classes={{ root: classes.tabRoot }} />
          <Tab
            label={`Destinations(${currentSpots.length})`}
            {...a11yProps(1)}
            classes={{ root: classes.tabRoot }}
          />
          <Tab
            label={`Articles(${currentArticles.length})`}
            {...a11yProps(2)}
            classes={{ root: classes.tabRoot }}
          />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <Box
          marginBottom="32px"
          display="flex"
          justifyContent="space-between"
          width="100%"
          sx={{ paddingTop: '145px' }}
        >
          <Typography
            component="h2"
            sx={{
              fontWeight: '700',
              fontSize: '38px',
              lineHeight: '43px',
              fontFamily: 'Vesper Libre',
            }}
          >
            Résultats
          </Typography>
          <Button
            startIcon={<Image src={union} width={20} height={20} quality={100} />}
            onClick={() => modalStateSetter('filter')}
            disableRipple
            classes={{ root: classes.filterButton }}
          />
        </Box>
        <SpotIntegration />
        <ArticleIntegration />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Box
          marginBottom="32px"
          display="flex"
          justifyContent="space-between"
          width="100%"
          sx={{ paddingTop: '145px' }}
        >
          <Typography
            component="h2"
            sx={{
              fontWeight: '700',
              fontSize: '38px',
              lineHeight: '43px',
              fontFamily: 'Vesper Libre',
            }}
          >
            Résultats
          </Typography>
          <Button
            startIcon={<Image src={union} width={20} height={20} quality={100} />}
            onClick={() => modalStateSetter('filter')}
            disableRipple
            classes={{ root: classes.filterButton }}
          />
        </Box>
        <AllSpotIntegration />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <Box
          marginBottom="32px"
          display="flex"
          justifyContent="space-between"
          width="100%"
          sx={{ paddingTop: '145px' }}
        >
          <Typography
            component="h2"
            sx={{
              fontWeight: '700',
              fontSize: '38px',
              lineHeight: '43px',
              fontFamily: 'Vesper Libre',
            }}
          >
            Résultats
          </Typography>
          <Button
            startIcon={<Image src={union} width={20} height={20} quality={100} />}
            onClick={() => modalStateSetter('filter')}
            disableRipple
            classes={{ root: classes.filterButton }}
          />
        </Box>
        <ArticleIntegration />
      </TabPanel>
      <MobileSearchFilter modalState={modalState} modalStateSetter={modalStateSetter} />
    </>
  )
}
export default MobileSearch
