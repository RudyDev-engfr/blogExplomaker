import { useRouter } from 'next/router'
import { Button, Typography } from '@mui/material'
import Box from '@mui/material/Box'
import { makeStyles } from '@mui/styles'
import Image from 'next/image'

import CountryTile from '../../atoms/CountryTile'
import logo from '../../../images/icons/logo.svg'

const useStyles = makeStyles(theme => ({
  fewWordsTitle: {
    fontSize: '28px',
    lineHeight: '32px',
    fontWeight: '700',
    marginBottom: '10px',
    fontFamily: theme.typography.fontFamily,
  },
  buttonPrimary: {
    padding: `${theme.spacing(2.5)} 25px`,
    borderRadius: '50px',
    width: 'calc(100vw - 60px)',
    boxShadow: '0 3px 15px 0 #009D8C33',
    textTransform: 'none',
  },
  buttonUltraLight: {
    width: 'calc(100vw - 60px)',
    backgroundColor: theme.palette.primary.ultraLight,
    color: theme.palette.primary.main,
    textTransform: 'none',
    padding: `${theme.spacing(2.5)} 25px`,
    borderRadius: '50px',
  },
}))
const MobileIntro = ({ spotlight, metaContinentRef }) => {
  const classes = useStyles()
  const router = useRouter()
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
      <Box sx={{ marginBottom: '40px' }}>
        <Typography variant="h2" className={classes.fewWordsTitle}>
          En quelques mots
        </Typography>
        <Typography dangerouslySetInnerHTML={{ __html: spotlight.few_words }} />
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Button
          startIcon={<Image src={logo} height={25} width={20} />}
          variant="contained"
          className={classes.buttonPrimary}
          sx={{ marginBottom: '15px' }}
          onClick={() => router.push('https://app.explomaker.fr')}
        >
          Créer un séjour
        </Button>
        <Button
          className={classes.buttonUltraLight}
          onClick={() => router.push(`/spot/${spotlight.slug}`)}
        >
          Découvrir {spotlight.prefixed_title}
        </Button>
      </Box>
    </Box>
  )
}
export default MobileIntro
