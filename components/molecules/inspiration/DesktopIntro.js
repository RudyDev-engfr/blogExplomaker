import { Typography } from '@mui/material'
import Box from '@mui/material/Box'
import { makeStyles } from '@mui/styles'

import CountryTile from '../../atoms/CountryTile'

const useStyles = makeStyles(theme => ({
  fewWordsTitle: {
    fontSize: '28px',
    lineHeight: '32px',
    fontWeight: '700',
    marginBottom: '10px',
    fontFamily: theme.typography.fontFamily,
  },
}))
const DesktopIntro = ({ spotlight, metaContinentRef }) => {
  const classes = useStyles()
  return (
    <Box display="flex" marginBottom="60px">
      <Box marginRight="50px">
        <CountryTile
          countryTitle={spotlight.prefixed_title}
          srcImg={`https://storage.googleapis.com/stateless-www-explomaker-fr/${spotlight.picture_titled.src.original}`}
          altImg="test img"
          link={spotlight.slug}
          category={metaContinentRef[parseInt(spotlight.meta_continent[0], 10)].name}
        />
      </Box>
      <Box>
        <Typography
          variant="h6"
          color="primary.ultraDark"
          fontWeight="400"
          sx={{ marginBottom: '15px' }}
        >
          À la Une
        </Typography>
        <Typography variant="h1" sx={{ marginBottom: '20px' }}>
          {spotlight.title}
        </Typography>
        <Typography variant="h2" className={classes.fewWordsTitle}>
          En quelques mots
        </Typography>
        <Typography dangerouslySetInnerHTML={{ __html: spotlight.few_words }} />
      </Box>
    </Box>
  )
}
export default DesktopIntro
