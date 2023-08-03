Object.defineProperty(exports, '__esModule', { value: true })
/* eslint-disable react/jsx-filename-extension */
// eslint-disable-next-line no-use-before-define
const React = require('react')
const core_1 = require('@mantine/core')
const router_1 = require('next/router')
const react_multi_carousel_1 = require('react-multi-carousel')
require('react-multi-carousel/lib/styles.css')
const hooks_1 = require('@mantine/hooks')
// eslint-disable-next-line import/extensions
const CustomButtonGroup_1 = require('./CustomButtonGroup')
// eslint-disable-next-line import/extensions
const useStyles = (0, core_1.createStyles)({
  carouselContainer: {
    width: '660px',
    height: '375px',
    position: 'relative',
    '@media (max-width: 600px)': { width: 'calc(100vw - 30px)', height: '250px' },
  },
  carouselImage: {
    height: '330px',
    width: '660px',
    borderRadius: '20px',
    '@media (max-width: 600px)': { width: '284px', height: '210px' },
  },
  itemContainer: {
    width: '660px',
    height: '330px',
    '@media (max-width: 600px)': { width: '284px', height: '210px' },
  },
  shadowVeil: {
    position: 'absolute',
    width: '375px',
    height: '330px',
    borderRadius: '20px',
    zIndex: 2,
    bottom: '0',
    background: 'linear-gradient(270deg, rgba(169, 71, 74, 0) 16%, #009D8C 100%)',
    '@media (max-width: 600px)': { width: '210px', height: '210px', bottom: 'unset', top: 0 },
  },
  itemTitle: {
    fontSize: '46px',
    lineHeight: '55px',
    color: '#FFFFFF',
    position: 'absolute',
    left: '50px',
    bottom: '120px',
    zIndex: 3,
    fontFamily: 'Rubik',
    '@media (max-width: 600px)': {
      left: '20px',
      bottom: '65px',
      fontSize: '32px',
      lineHeight: '38px',
      maxWidth: 'calc(284px - 20px)',
    },
  },
  itemButton: {
    width: '130px',
    height: '58px',
    fontSize: '18px',
    padding: '18.5px 22px',
    position: 'absolute',
    bottom: '50px',
    left: '50px',
    borderRadius: '50px',
    color: '#009D8C',
    backgroundColor: '#E6F5F4',
    zIndex: 3,
    '&:hover': {
      backgroundColor: '#E6F5F4',
    },
    '@media (max-width: 600px)': {
      left: '20px',
      bottom: '20px',
      fontSize: '14px',
      lineHeight: '16.5px',
      padding: '10px 15px',
      height: '36px',
    },
  },
})
const WPGAudioBlock = props => {
  const { classes } = useStyles()
  const {
    attrs,
    // innerBlocks,
    innerHTML,
  } = props
  const matchesXs = (0, hooks_1.useMediaQuery)('(max-width:600px)')
  const router = (0, router_1.useRouter)()
  const [imgArray, setImgArray] = React.useState([])
  const [currentImage, setCurrentImage] = React.useState(0)
  React.useEffect(() => {
    var _a
    if (
      (_a = attrs === null || attrs === void 0 ? void 0 : attrs.data) === null || _a === void 0
        ? void 0
        : _a.blog_log_list
    ) {
      const spotKeys = Object.keys(attrs.data.blog_log_list)
      const tempImgArray = spotKeys.map(key => attrs.data.blog_log_list[key])
      setImgArray(tempImgArray)
      console.log(tempImgArray)
    }
  }, [attrs])
  React.useEffect(() => {
    console.log('state tableau', imgArray)
  }, [imgArray])
  return React.createElement(
    'div',
    { className: 'wpg-block wpg-b_audio' },
    React.createElement(
      core_1.Box,
      { sx: { position: 'relative', width: '660px', maxWidth: '660px' } },
      React.createElement(
        core_1.Box,
        { className: classes.carouselContainer },
        React.createElement(
          react_multi_carousel_1.default,
          {
            autoPlaySpeed: 3000,
            centerMode: false,
            draggable: true,
            arrows: false,
            focusOnSelect: false,
            infinite: false,
            renderButtonGroupOutside: !matchesXs,
            customButtonGroup: !matchesXs && React.createElement(CustomButtonGroup_1.default, null),
            // showDots={matchesXs}
            // customDot={<TrendingDestinationsDotBox carouselArray={imgArray} />}
            // dotListClass={dotListClass}
            keyBoardControl: true,
            minimumTouchDrag: 80,
            partialVisible: matchesXs,
            responsive: {
              desktop: {
                breakpoint: {
                  max: 3000,
                  min: 640,
                },
                items: 1,
                partialVisibilityGutter: 0,
              },
              mobile: {
                breakpoint: {
                  max: 600,
                  min: 0,
                },
                items: 1,
                partialVisibilityGutter: 30,
              },
            },
            slidesToSlide: 1,
            swipeable: true,
            ssr: true,
            deviceType: matchesXs ? 'mobile' : 'desktop',
          },
          imgArray.map(image =>
            React.createElement(
              core_1.Box,
              { className: classes.itemContainer, key: image.picture_titled.id },
              React.createElement(core_1.Box, { className: classes.shadowVeil }),
              React.createElement(core_1.Text, { className: classes.itemTitle }, image.title),
              React.createElement(
                core_1.Button,
                {
                  variant: 'filled',
                  className: classes.itemButton,
                  onClick: () => router.push(`/spot/${image.slug}`),
                },
                'D\u00E9couvrir'
              ),
              React.createElement('img', {
                src: `https://storage.googleapis.com/explomaker-data-stateless/${encodeURI(
                  image.picture_titled.src.original
                )}`,
                alt: '',
                className: classes.carouselImage,
              })
            )
          )
        )
      )
    )
  )
}
exports.default = WPGAudioBlock
//# sourceMappingURL=audio.js.map
