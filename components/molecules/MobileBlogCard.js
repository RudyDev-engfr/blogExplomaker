import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import makeStyles from '@mui/styles/makeStyles'
import Comment from '@mui/icons-material/Comment'
import Favorite from '@mui/icons-material/Favorite'
import Image from 'next/dist/client/image'
import clsx from 'clsx'

import commentIcon from '../../images/icons/greyCommentIcon.svg'

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
}))
const MobileBlogCard = ({
  srcImg,
  title,
  commentsCount,
  likesCount,
  subtitle,
  publishDate,
  isResult = false,
  className,
}) => {
  const classes = useStyles()
  return (
    <Card
      elevation={0}
      className={clsx({ [classes.root]: !isResult, [classes.resultRoot]: isResult }, className)}
    >
      <CardActionArea
        classes={{
          root: isResult ? classes.resultCardActionAreaRoot : classes.cardActionAreaRoot,
          focusHighlight: classes.cardActionAreaFocusHighlight,
        }}
      >
        <CardMedia>
          <Box
            className={clsx({
              [classes.imageContainer]: !isResult,
              [classes.resultImageContainer]: isResult,
            })}
          >
            <Image
              layout="fill"
              src={encodeURI(srcImg)}
              className={classes.cardImage}
              objectFit="cover"
              objectPosition="center"
            />
          </Box>
        </CardMedia>
        <CardContent
          classes={{ root: isResult ? classes.resultCardContentRoot : classes.cardContentRoot }}
          className={classes.cardContent}
        >
          <Box
            width="100%"
            display="flex"
            marginBottom={isResult ? '10px' : '0px'}
            justifyContent="space-between"
          >
            <Typography className={classes.cardTitle} dangerouslySetInnerHTML={{ __html: title }} />
            {/* {!isResult && (
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
          {/* {isResult && (
            <Box className={classes.resultSocialInteraction}>
              <Box display="flex" justifyContent="space-between">
                <Typography className={classes.cardCounts}>{publishDate}</Typography>
                <Box width="80px" display="flex" justifyContent="space-between">
                  <Box display="flex" alignItems="center" marginRight="10px">
                    <Favorite
                      className={clsx({
                        [classes.cardIcons]: !isResult,
                        [classes.resultCardIcons]: isResult,
                      })}
                    />
                    <Typography className={classes.cardCounts}>{likesCount}</Typography>
                  </Box>
                  <Box display="flex" alignItems="center">
                    <Box
                      position="relative"
                      width={isResult ? '16px' : '12px'}
                      height={isResult ? '16px' : '12px'}
                      marginRight="4px"
                    >
                      <Image
                        src={commentIcon}
                        className={clsx({
                          [classes.cardIcons]: !isResult,
                          [classes.resultCardIcons]: isResult,
                        })}
                        layout="fill"
                      />
                    </Box>
                    <Typography className={classes.cardCounts}>{commentsCount}</Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          )} */}
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
