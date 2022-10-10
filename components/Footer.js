import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Link from '@mui/material/Link'
import IconButton from '@mui/material/IconButton'
import useMediaQuery from '@mui/material/useMediaQuery'
import Flight from '@mui/icons-material/Flight'
import Copyright from '@mui/icons-material/Copyright'
import Facebook from '@mui/icons-material/Facebook'
import Divider from '@mui/material/Divider'
import { useTheme } from '@mui/material'
import makeStyles from '@mui/styles/makeStyles'
import { useRouter } from 'next/dist/client/router'
import clsx from 'clsx'

const useStyles = makeStyles(theme => ({
  footer: {
    backgroundColor: theme.palette.primary.dark,
    color: theme.palette.primary.contrastText,
  },
  footerLink: {
    color: theme.palette.primary.contrastText,
    padding: '5px 0',
  },
  page404: {
    marginTop: '-145px',
  },
  footerTitle: {
    fontSize: '22px',
    fontWeight: '500',
  },
}))

const Footer = () => {
  const classes = useStyles()
  const theme = useTheme()
  const matchesXs = useMediaQuery(theme.breakpoints.down('sm'))
  const router = useRouter()

  return (
    <Paper
      square
      elevation={0}
      className={clsx(classes.footer, { [classes.page404]: router.pathname === '/404' })}
      sx={{
        [theme.breakpoints.down('sm')]: {
          display: router.pathname === '/favorites' ? 'none' : 'block',
        },
      }}
    >
      <Box component="footer" maxWidth="1200px" m="auto" py={10}>
        <Grid container spacing={matchesXs ? 0 : 4} mb={3}>
          <Grid item md={3} sm={6}>
            <Typography variant="h4" className={classes.footerTitle}>
              Explomaker
            </Typography>
            <Typography variant="body2" sx={{ lineHeight: '24px', marginBottom: '30px' }}>
              EXPLOMAKER est une enseigne Digital Project &amp; Transformation Consulting
              immatriculé au RCS Orléans N°833 831 779 00016
            </Typography>
            <Box position="relative">
              <Box
                sx={{
                  height: '45px',
                  width: '45px',
                  backgroundColor: 'rgba(256, 256, 256, 0.1)',
                  borderRadius: '5px',
                }}
              />
              <Link
                component={IconButton}
                href="https://www.facebook.com/explomaker/"
                sx={{
                  position: 'absolute',
                  top: '0',
                  width: '45px',
                  height: '45px',
                  borderRadius: '5px',
                }}
              >
                <Facebook sx={{ opacity: '100%', color: 'white' }} />
              </Link>
            </Box>
          </Grid>
          <Grid item md={3} sm={6}>
            <Box display="flex" flexDirection="column" alignItems="flex-start">
              <Typography variant="h4">Ressources</Typography>
              <Link
                variant="body2"
                href="https://explomaker.fr/security/"
                className={classes.footerLink}
              >
                Sécurité &amp; confidentialité
              </Link>
              <Link variant="body2" href="https://explomaker.fr" className={classes.footerLink}>
                Présentation de l&rsquo;app
              </Link>
              <Link
                variant="body2"
                href="https://explomaker.fr/blog/fonctionnement/"
                className={classes.footerLink}
              >
                Fonctionnement de l&rsquo;app
              </Link>
              <Link
                variant="body2"
                href="https://explomaker.fr/help/debuter-avec-explomaker"
                className={classes.footerLink}
              >
                Débuter avec Explomaker
              </Link>
              <Link
                variant="body2"
                href="https://explomaker.fr/roadmoap/"
                className={classes.footerLink}
              >
                Roadmap
              </Link>
              <Link
                variant="body2"
                href="https://explomaker.fr/help"
                className={classes.footerLink}
              >
                Aide
              </Link>
              <Link variant="body2" href="https://explomaker.fr/cgu" className={classes.footerLink}>
                Conditions générales
              </Link>
            </Box>
          </Grid>
          <Grid item md={3} sm={6}>
            <Box display="flex" flexDirection="column" alignItems="flex-start">
              <Typography variant="h4" className={classes.footerTitle}>
                <Link
                  href="https://explomaker.fr/inspiration/"
                  className={classes.footerLink}
                  underline="none"
                >
                  Le blog Explomaker
                </Link>
              </Typography>
            </Box>
          </Grid>
          <Grid item md={3} sm={6}>
            <Box display="flex" flexDirection="column" alignItems="flex-start">
              <Typography variant="h4" className={classes.footerTitle}>
                Contact
              </Typography>
              <Link
                href="https://explomaker.fr/issues/"
                variant="body2"
                className={classes.footerLink}
              >
                Une erreur sur l&rsquo;app ?
              </Link>
              <Link href="mailto:web@explomaker.fr" variant="body2" className={classes.footerLink}>
                web@explomaker.fr
              </Link>
              <Link
                href="https://explomaker.fr/contact/"
                variant="body2"
                className={classes.footerLink}
              >
                Contact rapide
              </Link>
            </Box>
          </Grid>
        </Grid>
        <Divider sx={{ bgcolor: theme.palette.secondary.contrastText, margin: '22px 0' }} />
        <Box display="inline-flex" alignItems="center" color="white">
          <Flight fontSize="small" style={{ transform: 'rotate(45deg)' }} />
          <Copyright fontSize="small" />
          <Box ml={1}>
            <Typography variant="caption">2021 Explomaker. Tous droits réservés.</Typography>
          </Box>
        </Box>
      </Box>
    </Paper>
  )
}

export default Footer
