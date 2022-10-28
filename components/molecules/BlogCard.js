import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import Favorite from '@mui/icons-material/Favorite'
import makeStyles from '@mui/styles/makeStyles'
import Image from 'next/dist/client/image'
import clsx from 'clsx'

import commentIcon from '../../images/icons/greyCommentIcon.svg'

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: '550px',
    borderRadius: '20px',
    position: 'relative',
    [theme.breakpoints.down('sm')]: {
      maxWidth: '84%',
      marginBottom: '20px',
    },
  },
  smallSizeRoot: {
    maxWidth: '330px',
    height: '380px',
    borderRadius: '20px',
    position: 'relative',
    [theme.breakpoints.down('sm')]: {
      maxWidth: '95%',
      marginBottom: '20px',
      margin: 'auto',
      height: '350px',
    },
  },
  actionArea: {
    height: '100%',
    minHeight: '533px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    position: 'relative',
    [theme.breakpoints.down('sm')]: {
      minHeight: '350px',
    },
  },
  smallSizeActionArea: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  cardTitleRounded: {
    fontSize: '1rem',
    fontWeight: '500',
    display: 'inline-block',
    padding: '8px 15px',
    borderRadius: '30px',
    position: 'absolute',
    top: '320px',
    textTransform: 'uppercase',
    [theme.breakpoints.down('sm')]: {
      top: '180px',
    },
  },
  smallSizeDate: {
    fontSize: '14px',
    lineHeight: '24px',
    fontWeight: '400',
  },
  smallSizeTitle: {
    fontSize: '24px',
    lineHeight: '30px',
    fontWeight: '500',
  },
  smallSizeCardTitleRounded: {
    fontSize: '1rem',
    fontWeight: '500',
    display: 'inline-block',
    padding: '8px 15px',
    borderRadius: '30px',
    position: 'absolute',
    top: '195px',
    textTransform: 'uppercase',
    // [theme.breakpoints.down('xs')]: {
    //   top: '180px',
    // },
  },
  cardTitleSquared: {
    fontSize: '1rem',
    fontWeight: '500',
    display: 'inline-block',
    padding: '8px 15px',
    borderRadius: '5px',
    position: 'absolute',
    top: '320px',
    textTransform: 'uppercase',
    [theme.breakpoints.down('sm')]: {
      top: '180px',
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
  grey33: {
    color: '#333333',
  },
  grey82: {
    color: '#828282',
  },
  size28: {
    fontSize: '1.75rem',
    lineHeight: '32px',
  },
  fw500: {
    fontWeight: '500',
  },
  media: {
    minHeight: '343px',
    maxHeight: '343px',
    marginBottom: '35px',
    borderRadius: '20px',
    [theme.breakpoints.down('sm')]: {
      minHeight: '200px',
      maxHeight: '200px',
      maxWidth: '84vw',
      marginBottom: '30px',
    },
  },
  smallSizeMedia: {
    marginBottom: '30px',
    borderRadius: '20px',
    maxHeight: '219px',
    width: '100%',
    top: '0px',
    [theme.breakpoints.down('sm')]: {
      maxHeight: '200px',
      width: '100%',
      marginBottom: '30px',
    },
  },
  detailsCard: {
    display: 'flex',
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: '30px',
    width: 'calc(100% - 60px)',
    [theme.breakpoints.down('sm')]: {
      bottom: '5px',
    },
  },
  smallSizeDetailsCard: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  blogCardIcon: {
    width: '15px',
    height: '15px',
    marginRight: '5px',
    color: '#BDBDBD',
  },
  cardContent: {
    height: '100%',
    padding: '0 30px 30px',
    [theme.breakpoints.down('sm')]: {
      padding: '0 20px 20px 20px',
    },
  },
  smallSizeCardContent: {
    padding: '0 15px 0 15px',
    display: 'flex',
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'space-between',
    [theme.breakpoints.down('sm')]: {
      height: 'max-content',
    },
  },
  // responsive part
  mediaImg: {
    objectFit: 'cover',
    width: '100%',
    height: '343px',
    '& div': {
      borderRadius: '20px',
    },
    [theme.breakpoints.down('sm')]: {
      height: '200px',
      width: '84vw',
    },
  },
  smallSizeMediaImg: {
    position: 'relative',
    height: '219px',
    width: '100%',
    '& div': {
      borderRadius: '10px',
    },
    [theme.breakpoints.down('sm')]: {
      height: '200px',
    },
  },
  mobileTitle: {
    [theme.breakpoints.down('sm')]: {
      fontSize: '20px',
      lineHeight: '24px',
      fontWeight: '500',
    },
  },
  textIcon: {
    color: '#828282',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
  },
}))

const BlogCard = ({
  isSmallSize = false,
  isHeartStroke = false,
  category,
  bigTitle,
  srcImg,
  altImg,
  text,
  date,
  readingTime,
  categoryColor = 'green',
}) => {
  const classes = useStyles()

  return (
    <Card
      elevation={isSmallSize ? 0 : 2}
      className={clsx({
        [classes.root]: !isSmallSize,
        [classes.smallSizeRoot]: isSmallSize,
      })}
    >
      <CardActionArea
        className={clsx({
          [classes.actionArea]: !isSmallSize,
          [classes.smallSizeActionArea]: isSmallSize,
        })}
      >
        <CardMedia
          className={clsx({ [classes.media]: !isSmallSize, [classes.smallSizeMedia]: isSmallSize })}
        >
          <Box
            className={clsx(classes.imageContainer, {
              [classes.mediaImg]: !isSmallSize,
              [classes.smallSizeMediaImg]: isSmallSize,
            })}
          >
            <Image
              src={encodeURI(srcImg)}
              alt={altImg}
              layout="fill"
              objectFit="cover"
              objectPosition="center"
            />
          </Box>
        </CardMedia>
        <CardContent
          classes={{ root: isSmallSize ? classes.smallSizeCardContent : classes.cardContent }}
        >
          <Box>
            <Typography
              className={clsx(
                isHeartStroke
                  ? isSmallSize
                    ? classes.smallSizeCardTitleRounded
                    : classes.cardTitleSquared
                  : classes.cardTitleRounded,
                {
                  [classes.colorGreen]: categoryColor === 'green',
                  [classes.colorRed]: categoryColor === 'red',
                  [classes.colorBlue]: categoryColor === 'blue',
                }
              )}
            >
              {category}
            </Typography>
          </Box>
          <Box marginBottom="15px" paddingTop="15px">
            <Typography
              variant={isSmallSize ? 'h3' : 'body1'}
              className={clsx(
                isSmallSize ? classes.smallSizeTitle : `${classes.fw500} ${classes.size28}`,
                classes.grey33,
                classes.mobileTitle
              )}
              dangerouslySetInnerHTML={{ __html: bigTitle }}
            />
          </Box>
          {isHeartStroke ? (
            <Box>
              <Typography dangerouslySetInnerHTML={{ __html: text }} />
            </Box>
          ) : (
            <Box className={classes.detailsCard}>
              <Typography
                className={clsx(classes.grey82, { [classes.smallSizeDate]: isSmallSize })}
              >
                {date} | {readingTime}
              </Typography>
              <Box display="flex">
                <Box display="flex" alignItems="center">
                  <Favorite className={classes.blogCardIcon} />
                  <Typography className={classes.textIcon}>12</Typography>
                </Box>
                {/* <Box display="flex" alignItems="center">
                  <Box className={classes.blogCardIcon} position="relative">
                    <Image src={commentIcon} quality={100} />
                  </Box>
                  <Typography className={classes.textIcon}>2</Typography>
                </Box> */}
              </Box>
            </Box>
          )}
          {isSmallSize && (
            <Box className={classes.smallSizeDetailsCard}>
              <Typography className={classes.grey82} gutterBottom>
                {date} | {readingTime}
              </Typography>
            </Box>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  )
}

export default BlogCard
