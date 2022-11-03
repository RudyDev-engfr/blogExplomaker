import { format, parse } from 'date-fns'
import clsx from 'clsx'
import { useTheme } from '@mui/styles'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import BookmarkTwoToneIcon from '@mui/icons-material/BookmarkTwoTone'
import Bookmark from '@mui/icons-material/Bookmark'
import makeStyles from '@mui/styles/makeStyles'
import Comment from '@mui/icons-material/Comment'
import Favorite from '@mui/icons-material/Favorite'
import Image from 'next/dist/client/image'

import commentIcon from '../../images/icons/greyCommentIcon.svg'
import { useRouter } from 'next/router'

const useStyles = makeStyles(theme => ({
  root: {
    width: '284px',
    height: '263px',
    borderRadius: '20px',
  },
  resultRoot: {
    width: '360px',
    minHeight: '325px',
    borderRadius: '20px',
    position: 'relative',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: '153px',
  },
  resultImageContainer: {
    position: 'relative',
    width: '100%',
    minWidth: '100%',
    height: '198px',
  },

  cardActionAreaRoot: {
    padding: '15px',
    width: '100%',
    height: '100%',
  },
  cardActionAreaFocusHighlight: {
    backgroundColor: theme.palette.secondary.contrastText,
  },
  cardImage: {
    borderRadius: '10px',
  },
  cardContent: {
    padding: '10px 5px 0 5px',
  },
  cardTitle: {
    fontSize: '18px',
    fontWeight: '500',
    lineHeight: '24px',
  },
  cardSubtitle: {
    fontSize: '14px',
    lineHeight: '20px',
    fontWeight: '400',
  },
  cardIcons: {
    color: '#BDBDBD',
    fontSize: '12px',
    marginRight: '4px',
  },
  cardCounts: {
    fontSize: '12px',
    lineHeight: '14px',
    color: '#828282',
  },
  resultCardIcons: {
    fontSize: '16px',
    lineHeight: '20px',
    fontWeight: '500',
    marginRight: '4px',
    color: theme.palette.grey['82'],
  },
  resultCardContentRoot: {
    display: 'grid',
    height: '100%',
    gridTemplate: 'max-content min-content/1fr',
    alignContent: 'space-between',
  },
  resultSocialInteraction: {},
  resultCardActionAreaRoot: {
    display: 'grid',
    gridTemplate: 'min-content 1fr / 1fr',
    height: '100%',
    padding: '15px',
    width: '100%',
  },
  categoryBox: {
    backgroundColor: theme.palette.primary.ultraLight,
    display: 'inline-block',
    padding: '5px 8px',
    borderRadius: '5px',
    position: 'absolute',
    top: '16.5px',
    left: '15px',
  },
}))
const MobileBlogCard = ({
  srcImg,
  title,
  commentsCount,
  likesCount,
  subtitle,
  publishDate,
  is360px = false,
  className,
  category = 'Demacia',
  isAlgolia = false,
  targetLink,
}) => {
  const classes = useStyles()
  const theme = useTheme()
  const router = useRouter()

  return (
    <Card
      elevation={0}
      className={clsx({ [classes.root]: !is360px, [classes.resultRoot]: is360px }, className)}
    >
      <CardActionArea
        classes={{
          root: is360px ? classes.resultCardActionAreaRoot : classes.cardActionAreaRoot,
          focusHighlight: classes.cardActionAreaFocusHighlight,
        }}
        onClick={() => router.push(targetLink)}
      >
        <CardMedia>
          <Box
            className={clsx({
              [classes.imageContainer]: !is360px,
              [classes.resultImageContainer]: is360px,
            })}
          >
            <Image
              layout="fill"
              src={encodeURI(srcImg)}
              className={classes.cardImage}
              objectFit="cover"
              objectPosition="center"
            />
            <Box display="flex" justifyContent="center" className={classes.categoryBox}>
              <Typography
                sx={{ fontSize: '1rem', fontWeight: '500', color: theme.palette.primary.main }}
              >
                {category}
              </Typography>
            </Box>
          </Box>
        </CardMedia>
        <CardContent
          classes={{ root: is360px ? classes.resultCardContentRoot : classes.cardContentRoot }}
          className={classes.cardContent}
        >
          <Box
            width="100%"
            display="flex"
            marginBottom={is360px ? '10px' : '0px'}
            justifyContent="space-between"
          >
            <Typography className={classes.cardTitle} dangerouslySetInnerHTML={{ __html: title }} />
            {/* {!is360px && (
              <Box display="flex">
                <Box display="flex" alignItems="center" marginRight="10px">
                  <Favorite className={classes.cardIcons} />
                  <Typography className={classes.cardCounts}>{likesCount}</Typography>
                </Box>
                <Box display="flex" alignItems="center">
                  <Comment className={classes.cardIcons} />
                  <Typography className={classes.cardCounts}>{commentsCount}</Typography>
                </Box>
              </Box>
            )} */}
          </Box>
          {is360px && (
            <Box className={classes.resultSocialInteraction}>
              <Box display="flex" justifyContent="space-between">
                <Typography className={classes.cardCounts}>
                  {!isAlgolia
                    ? format(parse(publishDate, 'yyyy-MM-dd HH:mm:ss', new Date()), 'dd MMM yyyy')
                    : publishDate}
                </Typography>
                {/* <Box width="80px" display="flex" justifyContent="space-between">
                  <Box display="flex" alignItems="center" marginRight="10px">
                    <Favorite
                      className={clsx({
                        [classes.cardIcons]: !is360px,
                        [classes.resultCardIcons]: is360px,
                      })}
                    />
                    <Typography className={classes.cardCounts}>{likesCount}</Typography>
                  </Box>
                  <Box display="flex" alignItems="center">
                    <Box
                      position="relative"
                      width={is360px ? '16px' : '12px'}
                      height={is360px ? '16px' : '12px'}
                      marginRight="4px"
                    >
                      <Image
                        src={commentIcon}
                        className={clsx({
                          [classes.cardIcons]: !is360px,
                          [classes.resultCardIcons]: is360px,
                        })}
                        layout="fill"
                      />
                    </Box>
                    <Typography className={classes.cardCounts}>{commentsCount}</Typography>
                  </Box>
                </Box> */}
              </Box>
            </Box>
          )}
          {subtitle && (
            <Box>
              <Typography className={classes.cardSubtitle}>{subtitle}</Typography>
            </Box>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  )
}
export default MobileBlogCard
