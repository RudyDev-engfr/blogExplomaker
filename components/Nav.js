import { useContext, useEffect, useState } from 'react'
import { useTheme } from '@mui/material'
import useMediaQuery from '@mui/material/useMediaQuery'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Paper from '@mui/material/Paper'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import makeStyles from '@mui/styles/makeStyles'
import Link from 'next/link'
import Image from 'next/image'
import clsx from 'clsx'
import { useRouter } from 'next/dist/client/router'

import Modals from './molecules/auth/AuthModals'

import home from '../images/icons/accueil.svg'
import inspi from '../images/icons/inspiLine.svg'
import profil from '../images/icons/profil.svg'
import logoFull from '../images/icons/logoFull.svg'
import ConnectedNav from './ConnectedNav'
import SearchField from './atoms/SearchField'
import { SessionContext } from '../contexts/session'

const useStyles = makeStyles(theme => ({
  navLink: {
    position: 'relative',
    fontSize: '14px',
    letterSpacing: '0.03em',
    color: theme.palette.grey.grey33,
    transition: '0.2s linear',
    marginRight: '35px',
    textDecoration: 'none',
    textTransform: 'none',
    '&::before': {
      transition: '0.3s linear',
      top: '110%',
      left: '0',
      borderRadius: '20px',
      height: '2px',
      width: '0',
      position: 'absolute',
      content: '""',
      background: '#006a75',
    },
    '&:hover': {
      color: '#006a75',
      backgroundColor: 'unset !important',
    },
    '&:hover::before': {
      width: '100%',
    },
  },
  colorPrimaryMain: {
    color: theme.palette.primary.main,
    '&::before': {
      transition: '0.3s linear',
      top: '110%',
      left: '0',
      borderRadius: '20px',
      height: '2px',
      width: '0',
      position: 'absolute',
      content: '""',
      background: theme.palette.primary.main,
    },
    '&:hover': {
      color: theme.palette.primary.main,
      backgroundColor: 'unset !important',
    },
    '&:hover::before': {
      width: '100%',
    },
  },
  createAccountBtn: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.secondary.contrastText,
    padding: '13px 18px',
    transition: '.2s all',
    borderRadius: '40px',
    fontSize: '14px',
    '&:hover': {
      backgroundColor: theme.palette.primary.light,
    },
    textTransform: 'none',
  },
  header: {
    backgroundColor: '#fff',
    padding: '20px 0',
    transition: '0.3s all linear',
    position: 'fixed',
    top: '0',
    left: '0',
    right: '0',
    zIndex: '1000',
    boxShadow: '0px 4px 30px rgba(0, 0, 0, 0.04), 0px 2px 8px rgba(0, 0, 0, 0.03)',
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  headerBgcGreen: {
    backgroundColor: theme.palette.grey.ultraLight,
    boxShadow: 'unset',
  },
  headerGrey: {
    backgroundColor: theme.palette.grey.e5,
    boxShadow: 'unset',
  },
  autocontainerNav: {
    maxWidth: '1140px',
    margin: '0 auto',
  },
  headerInner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerInnerRight: {
    display: 'flex',
    alignItems: 'center',
  },
  xsNav: {
    backgroundColor: 'white',
    position: 'fixed',
    bottom: '0',
    width: '100%',
    height: '90px',
    padding: theme.spacing(1.5),
    zIndex: '100',
  },
  tabs: {
    '& button': { textTransform: 'none' },
  },
  icons: {
    color: 'rgba(79, 79, 79, 0.5)',
    fontSize: '9px',
    fontWeight: '800',
  },
}))

const Nav = () => {
  const classes = useStyles()
  const { user, isAuthModalOpen, setIsAuthModalOpen } = useContext(SessionContext)
  const theme = useTheme()
  const matchesXs = useMediaQuery(theme.breakpoints.down('sm'))
  const router = useRouter()

  const [isBgTransparent, setIsBgTransparent] = useState(false)

  useEffect(() => {
    if (router.pathname === '/favorites') {
      setIsBgTransparent(true)
    }
  }, [router.pathname])
  // eslint-disable-next-line react-hooks/exhaustive-deps

  return (
    <>
      {user.isLoggedIn ? (
        <ConnectedNav isBgTransparent={isBgTransparent} />
      ) : matchesXs ? (
        <Paper variant="outlined" square className={classes.xsNav}>
          <Tabs centered variant="fullWidth" className={classes.tabs}>
            <Tab
              icon={<Image src={home} width={25} height={25} />}
              label={
                <Link passHref href="/">
                  <Box component="span" className={classes.icons}>
                    Accueil
                  </Box>
                </Link>
              }
            />
            <Tab
              icon={<Image src={inspi} width={25} height={25} />}
              label={
                <Link passHref href="/inspiration">
                  <Box component="span" className={classes.icons}>
                    Inspi
                  </Box>
                </Link>
              }
            />
            <Tab
              icon={<Image src={profil} width={25} height={25} />}
              label={
                <Box component="span" className={classes.icons}>
                  Connexion
                </Box>
              }
              onClick={() => setIsAuthModalOpen('login')}
            />
          </Tabs>
        </Paper>
      ) : (
        <Box
          className={clsx(classes.header, {
            [classes.headerBgcGreen]: !isBgTransparent && router.pathname === '/',
            [classes.headerGrey]: router.pathname === '/favorites',
          })}
        >
          <Box className={classes.autocontainerNav}>
            <Box className={classes.headerInner}>
              <Link href="/" passHref>
                <Box sx={{ cursor: 'pointer' }}>
                  <Image src={logoFull} width="180" />
                </Box>
              </Link>
              {!router.pathname.includes('/results') && <SearchField isNavbar />}
              <Box className={classes.headerInnerRight}>
                <Link href="/inspiration" passHref>
                  <Button disableRipple className={clsx(classes.navLink)}>
                    Inspiration
                  </Button>
                </Link>
                <Link href="https://app.explomaker.fr" passHref>
                  <Button disableRipple className={clsx(classes.navLink)}>
                    Séjours
                  </Button>
                </Link>
                <Button
                  disableRipple
                  className={clsx(classes.navLink, classes.colorPrimaryMain)}
                  onClick={() => setIsAuthModalOpen('login')}
                >
                  Connexion
                </Button>
                <Button
                  disableElevation
                  className={classes.createAccountBtn}
                  onClick={() => setIsAuthModalOpen('signup')}
                >
                  Créer mon compte
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      )}
      <Modals modalState={isAuthModalOpen} modalStateSetter={setIsAuthModalOpen} />
    </>
  )
}

export default Nav
