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
import SearchIcon from '@mui/icons-material/Search'
import TravelExplore from '@mui/icons-material/TravelExplore'
import { useRouter } from 'next/dist/client/router'

import Modals from './molecules/auth/AuthModals'

import home from '../images/icons/accueil.svg'
import inspi from '../images/icons/inspiLine.svg'
import profil from '../images/icons/notConnectedProfile.svg'
import logoFull from '../images/icons/logoFull.svg'
import logoGrey from '../images/icons/logoGrey.svg'
import ConnectedNav from './ConnectedNav'
import SearchField from './atoms/SearchField'
import { SessionContext } from '../contexts/session'
import SearchModal from './molecules/SearchModal'
import ButtonSearch from './atoms/ButtonSearch'

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
    padding: '10px',
    zIndex: '100',
  },
  tabs: {
    '& button': { textTransform: 'none' },
  },
  icons: {
    fontSize: '9px',
    fontWeight: '800',
  },
  nextLink: {
    textDecoration: 'none',
    fontSize: '9px',
    color: 'unset',
  },
}))

const Nav = () => {
  const classes = useStyles()
  const { user, isAuthModalOpen, setIsAuthModalOpen, searchModal, setSearchModal } =
    useContext(SessionContext)
  const theme = useTheme()
  const matchesXs = useMediaQuery(theme.breakpoints.down('sm'))
  const router = useRouter()

  const [isBgTransparent, setIsBgTransparent] = useState(false)
  const [currentMobileNavTab, setCurrentMobileNavTab] = useState()

  useEffect(() => {
    if (router.pathname === '/favorites') {
      setIsBgTransparent(true)
    }
    if (router.pathname === '/') {
      setCurrentMobileNavTab(0)
    } else if (router.pathname.includes('/inspiration')) {
      setCurrentMobileNavTab(1)
    } else if (router.pathname.includes('/exploration')) {
      setCurrentMobileNavTab(2)
    } else {
      setCurrentMobileNavTab(false)
    }
  }, [router.pathname])
  // eslint-disable-next-line react-hooks/exhaustive-deps

  return (
    <>
      {user.isLoggedIn ? (
        <ConnectedNav isBgTransparent={isBgTransparent} />
      ) : matchesXs ? (
        <Paper variant="outlined" square className={classes.xsNav}>
          <Tabs value={currentMobileNavTab} centered variant="fullWidth" className={classes.tabs}>
            <Link passHref href="/" className={classes.nextLink}>
              <Tab
                icon={
                  <Image
                    src={home}
                    width={30}
                    height={30}
                    alt="home_logo"
                    style={{
                      maxWidth: '100%',
                      height: '30px',
                    }}
                  />
                }
                label={
                  <Box component="span" className={classes.icons}>
                    Présentation
                  </Box>
                }
                sx={{ maxWidth: 'calc(20vw - 2px)', minWidth: '70px' }}
                value={0}
              />
            </Link>
            <Link passHref href="/inspiration" className={classes.nextLink}>
              <Tab
                icon={
                  <Image
                    src={inspi}
                    width={30}
                    height={30}
                    alt="Inspiration_logo"
                    style={{
                      maxWidth: '100%',
                      height: '30px',
                    }}
                  />
                }
                value={1}
                label={
                  <Box component="span" className={classes.icons}>
                    Inspi
                  </Box>
                }
                sx={{ maxWidth: 'calc(20vw - 2px)', minWidth: '70px' }}
              />
            </Link>
            <Link passHref href="/exploration" className={classes.nextLink}>
              <Tab
                icon={<TravelExplore sx={{ fontSize: '30px' }} />}
                label={
                  <Box component="span" className={classes.icons}>
                    Explo
                  </Box>
                }
                sx={{ maxWidth: 'calc(20vw - 2px)', minWidth: '70px' }}
                value={2}
              />
            </Link>
            <Link passHref href="https://app.explomaker.fr" className={classes.nextLink}>
              <Tab
                icon={
                  <Image
                    src={logoGrey}
                    width={30}
                    height={30}
                    alt="MyTrips_logo"
                    style={{
                      maxWidth: '100%',
                      height: '30px',
                    }}
                  />
                }
                label={
                  <Box component="span" className={classes.icons}>
                    Séjours
                  </Box>
                }
                sx={{ maxWidth: 'calc(20vw - 2px)', minWidth: '70px' }}
                value={3}
              />
            </Link>
            <Tab
              icon={
                <Image
                  src={profil}
                  width={30}
                  height={30}
                  alt="profile_logo"
                  style={{
                    maxWidth: '100%',
                    height: 'auto',
                  }}
                />
              }
              label={
                <Box component="span" className={classes.icons}>
                  Connexion
                </Box>
              }
              sx={{ maxWidth: 'calc(20vw - 2px)', minWidth: '70px' }}
              onClick={() => setIsAuthModalOpen('login')}
              value={4}
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
                  <Image
                    src={logoFull}
                    width="180"
                    alt="main_logo"
                    style={{
                      maxWidth: '100%',
                      height: 'auto',
                    }}
                  />
                </Box>
              </Link>
              {/* {router.pathname.indexOf('/exploration') === -1 &&
                router.pathname.indexOf('/inspiration') !==
                  router.pathname.split('').length - 12 && <SearchField isNavbar />} */}
              <ButtonSearch setSearchModal={setSearchModal} />
              <Box className={classes.headerInnerRight}>
                <Link href="/exploration" passHref>
                  <Button disableRipple className={clsx(classes.navLink)}>
                    Exploration
                  </Button>
                </Link>
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
          {searchModal && <SearchModal open={searchModal} setOpen={setSearchModal} />}
        </Box>
      )}
      <Modals modalState={isAuthModalOpen} modalStateSetter={setIsAuthModalOpen} />
    </>
  )
}

export default Nav
