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
const MobileIntro = ({ spotlight, metaContinentRef }) => {
  const classes = useStyles()
  return (
    <Box marginBottom="80px" paddingRight="30px">
      <Typography
        variant="h6"
        color="primary.ultraDark"
        fontWeight="400"
        sx={{ marginBottom: '15px' }}
      >
        À la Une
      </Typography>
      <Box sx={{ marginBottom: '20px' }}>
        <Typography variant="mobileBigTitle">{spotlight.prefixed_title}</Typography>
      </Box>
      <Box marginBottom="40px">
        <CountryTile
          countryTitle={spotlight.prefixed_title}
          srcImg={`https://storage.googleapis.com/explomaker-data-stateless/${spotlight.picture_titled.src.original}`}
          altImg="test img"
          link={spotlight.slug}
          category={metaContinentRef[parseInt(spotlight.meta_continent[0], 10)].name}
          isLarge
        />
      </Box>
      <Box>
        <Typography variant="h2" className={classes.fewWordsTitle}>
          En quelques mots
        </Typography>
        <Typography dangerouslySetInnerHTML={{ __html: spotlight.few_words }} />
      </Box>
    </Box>
  )
}
export default MobileIntro
