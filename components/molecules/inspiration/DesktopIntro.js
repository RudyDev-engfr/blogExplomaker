import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { makeStyles } from '@mui/styles'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'

import logo from '../../../images/icons/logo.svg'
import CountryTile from '../../atoms/CountryTile'

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
    boxShadow: '0 3px 15px 0 #009D8C33',
    textTransform: 'none',
  },
  buttonUltraLight: {
    backgroundColor: theme.palette.primary.ultraLight,
    color: theme.palette.primary.main,
    textTransform: 'none',
    padding: `${theme.spacing(2.5)} 25px`,
    borderRadius: '50px',
  },
  nextLink: {
    textDecoration: 'none',
  },
}))
const DesktopIntro = ({ spotlight, metaContinentRef }) => {
  const classes = useStyles()
  const router = useRouter()
  return (
    <Box display="flex" marginBottom="60px">
      <Box marginRight="50px">
        <CountryTile
          countryTitle={spotlight.prefixed_title}
          srcImg={`https://storage.googleapis.com/explomaker-data-stateless/${spotlight.picture_titled.src.original}`}
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
        <Box sx={{ display: 'flex', paddingTop: '30px' }}>
          <Link
            passHref
            href="https://app.explomaker.fr"
            target="_blank"
            className={classes.nextLink}
          >
            <Button
              startIcon={
                <Image
                  src={logo}
                  height={25}
                  width={20}
                  alt="main_logo"
                  style={{
                    maxWidth: '100%',
                    height: 'auto',
                  }}
                />
              }
              variant="contained"
              className={classes.buttonPrimary}
              sx={{ marginRight: '15px' }}
            >
              Créer un séjour
            </Button>
          </Link>
          <Button
            className={classes.buttonUltraLight}
            onClick={() => router.push(`/spot/${spotlight.slug}`)}
          >
            Découvrir {spotlight.prefixed_title}
          </Button>
        </Box>
      </Box>
    </Box>
  )
}
export default DesktopIntro
