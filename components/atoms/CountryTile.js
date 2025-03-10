import { useContext } from 'react'
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined'
import BookmarkTwoToneIcon from '@mui/icons-material/BookmarkTwoTone'
import Bookmark from '@mui/icons-material/Bookmark'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import makeStyles from '@mui/styles/makeStyles'
import { useMediaQuery } from '@mui/material'
import { useTheme } from '@mui/styles'
import clsx from 'clsx'
import { useRouter } from 'next/dist/client/router'
import Link from 'next/link'
import Image from 'next/image'

import { SessionContext } from '../../contexts/session'

import commentIcon from '../../images/icons/commentIcon.svg'

const useStyles = makeStyles(theme => ({
  root: {
    width: '262px',
    height: '341px',
    position: 'relative',
    cursor: 'pointer',
    [theme.breakpoints.down('sm')]: {
      width: '230px',
      height: '305px',
    },
  },
  largeRoot: {
    width: 'calc(100vw - 60px)',
    position: 'relative',
  },
  shadowVeil: {
    position: 'absolute',
    width: '262px',
    height: '341px',
    borderRadius: '20px',
    zIndex: '2',
    bottom: '0',
    [theme.breakpoints.down('sm')]: {
      width: '230px',
      height: '305px',
    },
  },
  largeShadowVeil: {
    width: 'calc(100vw - 60px)',
    height: '305px',
    top: '0',
    background:
      'linear-gradient(180deg, rgba(31, 31, 25, 0) 50%, rgb(31,31,25,0.6) 100%) !important',
  },
  cardMedia: {
    position: 'absolute',
    bottom: '0',
    zIndex: '1',
    height: '100%',
    width: '100%',
  },
  cardContent: {
    position: 'absolute',
    top: '0',
    zIndex: '3',
    display: 'grid',
    gridTemplate: '1fr max-content max-content/1fr',
    gridGap: '5px',
    alignItems: 'start',
    height: '100%',
    width: '100%',
    padding: '25px',
  },
  shadow: {
    background: 'linear-gradient(180deg, rgba(31, 31, 25, 0) 16%, rgb(31,31,25,0.5) 100%)',
  },
  shadowGreen: {
    background: 'linear-gradient(180deg, rgba(0, 157, 140, 0) 48.96%, rgba(0, 157, 140, 0.8) 100%)',
  },
  shadowRed: {
    background: 'linear-gradient(180deg, rgba(169, 71, 74, 0) 48.96%, rgba(169, 71, 74, 0.8) 100%)',
  },
  shadowBlue: {
    background: 'linear-gradient(180deg, rgba(0, 108, 119, 0) 48.96%, rgba(0, 108, 119, 0.8) 100%)',
  },
  tileImg: {
    borderRadius: '20px',
  },
  countryTitleStyle: {
    color: theme.palette.secondary.contrastText,
    fontFamily: 'Rubik',
    fontWeight: '500',
    zIndex: '2',
    textAlign: 'left',
  },
  cardTitleSquared: {
    fontSize: '14px',
    lineHeight: '16.6px',
    fontWeight: '500',
    display: 'inline-block',
    padding: '5px 8px',
    borderRadius: '5px',
    textTransform: 'uppercase',
    zIndex: '2',
    [theme.breakpoints.down('sm')]: {
      fontSize: '12px',
      lineHeight: '14px',
    },
  },
  colorGreen: {
    color: theme.palette.primary.main,
    backgroundColor: theme.palette.primary.ultraLight,
  },
  colorRed: {
    color: theme.palette.secondary.main,
    backgroundColor: theme.palette.secondary.ultraLight,
  },
  colorBlue: {
    color: theme.palette.primary.ultraDark,
    backgroundColor: theme.palette.primary.lightGreenBackground,
  },
  cardCountrySubtitle: {
    color: theme.palette.secondary.contrastText,
    fontWeight: '400',
    zIndex: '2',
  },
  cardActionArea: {
    position: 'relative',
    borderRadius: '10px',
    height: '341px',
  },
  likeAndDestinationType: {
    width: '225px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
  largeLikeContainer: {
    width: '100%',
  },
  likeButton: {
    zIndex: '100',
  },
  likeAndCommentsBox: {
    zIndex: '100',
    display: 'flex',
    width: '100%',
    alignItems: 'center',
  },
  likeAndCommentsButtonsBox: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '120px',
    zIndex: '100',
  },
  socialInteractionCount: {
    color: theme.palette.secondary.contrastText,
    fontSize: '16px',
    fontWeight: '500',
    lineHeight: '20px',
  },
}))

const CountryTile = ({
  countryTitle,
  countrySubtitle = '',
  category,
  categoryColor = 1,
  srcImg,
  altImg,
  link = 'polynesie-francaise',
  likesCounter = '0',
  commentsCounter = '0',
  isLarge,
}) => {
  const router = useRouter()
  const classes = useStyles()
  const theme = useTheme()
  const matchesXs = useMediaQuery(theme.breakpoints.down('sm'))
  const { user, spotsBookmarkedUpdate, setIsAuthModalOpen } = useContext(SessionContext)

  return (
    <Link passHref target={!matchesXs && '_blank'} href={`/spot/${link}`}>
      <Card
        elevation={0}
        className={clsx(classes.root, {
          [classes.largeRoot]: isLarge,
        })}
        // onClick={() => router.push(`/spot/${link}`)}
      >
        <CardActionArea className={classes.cardActionArea}>
          <CardMedia classes={{ root: classes.cardMedia }}>
            <Box
              className={clsx(classes.shadowVeil, {
                [classes.largeShadowVeil]: isLarge,
                // [classes.shadow]: categoryColor === 1,
                // [classes.shadowRed]: categoryColor === 2,
                // [classes.shadowBlue]: categoryColor === 3,
              })}
            />
            <Box sx={{ position: 'relative' }} height="100%" width="100%">
              <Image
                src={encodeURI(srcImg)}
                alt={altImg ?? 'country_image'}
                className={classes.tileImg}
                fill
                sizes="(max-width: 960px) 100vw"
                style={{
                  objectFit: 'cover',
                }}
              />
            </Box>
          </CardMedia>
        </CardActionArea>

        <CardContent classes={{ root: classes.cardContent }}>
          <Box
            className={clsx(classes.likeAndDestinationType, {
              [classes.largeLikeContainer]: isLarge,
            })}
          >
            <Typography
              className={clsx(classes.cardTitleSquared, {
                [classes.colorGreen]: categoryColor === 1,
                [classes.colorRed]: categoryColor === 2,
                [classes.colorBlue]: categoryColor === 3,
              })}
            >
              {category || 'Demacia'}
            </Typography>
            <IconButton
              sx={{ color: '#FFFFFF', padding: (isLarge || matchesXs) && '0' }}
              classes={{ root: classes.likeButton }}
              onClick={event => {
                event.stopPropagation()
                if (!user?.isLoggedIn) {
                  setIsAuthModalOpen('login')
                }
                spotsBookmarkedUpdate(link)
              }}
            >
              {user?.spotsBookmarked?.includes(link) ? (
                <Bookmark sx={{ fontSize: '26px' }} />
              ) : (
                <BookmarkTwoToneIcon sx={{ fontSize: '26px' }} />
              )}
            </IconButton>
          </Box>
          {countrySubtitle && (
            <Typography className={classes.cardCountrySubtitle}>{countrySubtitle}</Typography>
          )}
          <Typography variant="h3" className={classes.countryTitleStyle}>
            {countryTitle}
          </Typography>
          <Box className={classes.likeAndCommentsButtonsBox}>
            <Box className={classes.likeAndCommentsBox} sx={{ padding: '0' }}>
              <FavoriteBorderOutlinedIcon sx={{ color: '#FFFFFF', marginRight: '4px' }} />
              <Typography className={classes.socialInteractionCount}>{likesCounter}</Typography>
            </Box>
            <Box className={classes.likeAndCommentsBox} sx={{ padding: '0' }}>
              <Box marginRight="4px" display="flex" alignItems="center">
                <Image
                  width={20}
                  height={20}
                  src={commentIcon}
                  alt="comment_icon"
                  style={{
                    maxWidth: '100%',
                    height: 'auto',
                  }}
                />
              </Box>
              <Typography className={classes.socialInteractionCount}>{commentsCounter}</Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Link>
  )
}

export default CountryTile
