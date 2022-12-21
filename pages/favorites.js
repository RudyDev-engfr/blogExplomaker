import { useContext, useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Skeleton from '@mui/material/Skeleton'
import makeStyles from '@mui/styles/makeStyles'
import useMediaQuery from '@mui/material/useMediaQuery'
import Carousel from 'react-multi-carousel'
import { useTheme } from '@mui/material'
import 'react-multi-carousel/lib/styles.css'
import { useRouter } from 'next/dist/client/router'
import { v4 as uuidv4 } from 'uuid'

import CountryTile from '../components/atoms/CountryTile'
import MobileBlogCard from '../components/molecules/MobileBlogCard'
import { SessionContext } from '../contexts/session'
import NoneFavorite from '../components/molecules/NoneFavorite'
import { useAuth } from '../lib/firebase'

const useStyles = makeStyles(theme => ({
  fullWidthContainer: {
    backgroundColor: theme.palette.grey.e5,
    padding: '121px 0 80px 0',
    [theme.breakpoints.down('sm')]: {
      padding: '45px 30px 80px 30px',
    },
  },
  mainContainer: {
    maxWidth: '1140px',
    margin: 'auto',
  },
  favoritesTitles: {
    fontSize: '25px',
    lineHeight: '30px',
    fontWeight: '500',
    fontFamily: theme.typography.fontFamily,
  },
  countryTileGrid: {
    width: '100%',
    display: 'grid',
    gridTemplate: '1fr / 1fr 1fr 1fr 1fr',
    gridGap: '30px',
    marginBottom: '80px',
  },
}))

const fnURL =
  typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? 'http://localhost:5001/explomaker-3010b/us-central1/getFavorites'
    : 'https://us-central1-explomaker-3010b.cloudfunctions.net/getFavorites'

const MySpots = ({ currentSpots, isLoading }) => {
  const classes = useStyles()
  const theme = useTheme()
  const matchesXs = useMediaQuery(theme.breakpoints.down('sm'))
  const { user } = useContext(SessionContext)

  return (
    <>
      <Typography variant="h2" className={classes.favoritesTitles} mb={2}>
        Mes spots
      </Typography>
      {matchesXs ? (
        <Box marginBottom="80px">
          <Carousel
            itemClass={classes.mobileSpotsCarouselItem}
            autoPlaySpeed={3000}
            draggable
            arrows={false}
            focusOnSelect={false}
            infinite={user?.spotsBookmarked?.length > 1}
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
              },
            }}
            slidesToSlide={1}
            swipeable
            ssr
            deviceType="mobile"
          >
            {isLoading ? (
              user?.spotsBookmarked?.length > 1 ? (
                user?.spotsBookmarked?.map(() => (
                  <Skeleton
                    variant="rectangular"
                    width={230}
                    height={305}
                    sx={{ borderRadius: '20px' }}
                    key={uuidv4()}
                  />
                ))
              ) : (
                <Skeleton
                  variant="rectangular"
                  width={230}
                  height={305}
                  sx={{ borderRadius: '20px' }}
                />
              )
            ) : currentSpots.length > 0 ? (
              currentSpots.map(({ gps, picture_main: pictureMain, title, slug, color }) => (
                <CountryTile
                  countryTitle={title}
                  category={gps.country}
                  srcImg={pictureMain.src.original}
                  categoryColor={color}
                  altImg=""
                  key={`spot/${slug}`}
                  link={slug}
                  is360px
                  className={classes.mobileBlogCardAndCountryTile}
                />
              ))
            ) : (
              <NoneFavorite isSpot />
            )}
          </Carousel>
        </Box>
      ) : isLoading ? (
        <Box className={classes.countryTileGrid}>
          {user?.spotsBookmarked?.length > 1 ? (
            user?.spotsBookmarked?.map(() => (
              <Skeleton
                variant="rectangular"
                width={262}
                height={341}
                sx={{ borderRadius: '20px' }}
                key={uuidv4()}
              />
            ))
          ) : (
            <Skeleton
              variant="rectangular"
              width={262}
              height={341}
              sx={{ borderRadius: '20px' }}
            />
          )}
        </Box>
      ) : !currentSpots?.length > 0 ? (
        <NoneFavorite isSpot />
      ) : (
        <Box marginBottom="80px">
          <Box className={classes.countryTileGrid}>
            {currentSpots.map(({ gps, picture_main: pictureMain, title, slug, color }) => (
              <CountryTile
                countryTitle={title}
                category={gps.country}
                srcImg={pictureMain.src.original}
                categoryColor={color}
                altImg=""
                key={`spot/${slug}`}
                link={slug}
                is360px
                className={classes.mobileBlogCardAndCountryTile}
              />
            ))}
          </Box>
        </Box>
      )}
    </>
  )
}

const MyArticles = ({ currentArticles, isLoading }) => {
  const classes = useStyles()
  const theme = useTheme()
  const matchesXs = useMediaQuery(theme.breakpoints.down('sm'))
  const { user } = useContext(SessionContext)

  return (
    <>
      <Typography variant="h2" className={classes.favoritesTitles} mb={2}>
        Mes articles
      </Typography>
      {matchesXs ? (
        <Box marginBottom="80px">
          <Carousel
            itemClass={classes.mobileSpotsCarouselItem}
            autoPlaySpeed={3000}
            draggable
            arrows={false}
            focusOnSelect={false}
            infinite
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
              },
            }}
            slidesToSlide={1}
            swipeable
            ssr
            deviceType="mobile"
          >
            {isLoading ? (
              user?.articlesBookmarked?.length > 1 ? (
                user?.articlesBookmarked?.map(() => (
                  <Skeleton
                    variant="rectangular"
                    width={315}
                    height={293}
                    sx={{ borderRadius: '20px' }}
                    key={uuidv4()}
                  />
                ))
              ) : (
                <Skeleton
                  variant="rectangular"
                  width={315}
                  height={293}
                  sx={{ borderRadius: '20px' }}
                />
              )
            ) : !currentArticles?.length > 0 ? (
              <NoneFavorite isArticle />
            ) : (
              currentArticles.map(
                ({
                  title,
                  picture: pictureMain,
                  target_url: targetUrl,
                  creation_date: publishDate,
                  slug,
                }) => (
                  <MobileBlogCard
                    srcImg={pictureMain}
                    targetLink={targetUrl}
                    title={title}
                    key={targetUrl}
                    publishDate={publishDate}
                    slug={slug}
                    is360px
                    className={classes.mobileBlogCardAndCountryTile}
                  />
                )
              )
            )}
          </Carousel>
        </Box>
      ) : isLoading ? (
        <Box className={classes.countryTileGrid}>
          {user.articlesBookmarked?.length > 1 ? (
            user.articlesBookmarked?.map(() => (
              <Skeleton
                variant="rectangular"
                width={360}
                height={321}
                sx={{ borderRadius: '20px' }}
                key={uuidv4()}
              />
            ))
          ) : (
            <Skeleton
              variant="rectangular"
              width={360}
              height={321}
              sx={{ borderRadius: '20px' }}
            />
          )}
        </Box>
      ) : !currentArticles?.length > 0 ? (
        <NoneFavorite isArticle />
      ) : (
        <Box marginBottom="80px">
          <Box display="grid" sx={{ gridTemplate: 'repeat(auto-fill, 360px) / repeat(3, 1fr)' }}>
            {currentArticles.map(
              ({
                title,
                picture: pictureMain,
                target_url: targetUrl,
                creation_date: publishDate,
                slug,
              }) => (
                <MobileBlogCard
                  srcImg={pictureMain}
                  targetLink={targetUrl}
                  title={title}
                  key={targetUrl}
                  publishDate={publishDate}
                  slug={slug}
                  is360px
                  className={classes.mobileBlogCardAndCountryTile}
                />
              )
            )}
          </Box>
        </Box>
      )}
    </>
  )
}

const Favorites = () => {
  const classes = useStyles()
  const { user, isAuthModalOpen, setIsAuthModalOpen } = useContext(SessionContext)
  const [currentSpots, setCurrentSpots] = useState([])
  const [currentArticles, setCurrentArticles] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const { initializing } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user?.spotsBookmarked?.length > 0 || user?.articlesBookmarked?.length > 0) {
      const myHeaders = new Headers({
        'Content-Type': 'application/json',
      })

      const myInit = {
        method: 'POST',
        headers: myHeaders,
        mode: 'cors',
        cache: 'default',
        body: JSON.stringify({
          spotsBookmarked: user?.spotsBookmarked || [],
          articlesBookmarked: user?.articlesBookmarked || [],
        }),
      }
      fetch(fnURL, myInit)
        .then(async response => {
          const payload = await response.json()
          console.log('payload', payload)
          setCurrentSpots(payload.spots)
          setCurrentArticles(payload.articles)
          setIsLoading(false)
        })
        .catch(error => console.error(error))
    } else if (!initializing && user?.isLoggedIn) {
      setIsLoading(false)
    } else if (!initializing && !user?.isLoggedIn) {
      setIsAuthModalOpen('login')
    }
  }, [user, initializing])

  useEffect(() => {
    console.log('articles favoris', currentArticles)
  }, [currentArticles])

  useEffect(() => {
    console.log(user)
  }, [user])

  return (
    <Box className={classes.fullWidthContainer}>
      <Box className={classes.mainContainer}>
        <Typography variant="h1" mb={4}>
          Favoris
        </Typography>
        <MySpots currentSpots={currentSpots} isLoading={isLoading} />
        <MyArticles currentArticles={currentArticles} isLoading={isLoading} />
      </Box>
    </Box>
  )
}

export default Favorites
