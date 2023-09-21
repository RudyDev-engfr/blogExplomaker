import React, { useContext, createElement } from 'react'
import { getAlgoliaResults } from '@algolia/autocomplete-js'
import algoliasearch from 'algoliasearch'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Box from '@mui/material/Box'
import Badge from '@mui/material/Badge'
import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'
import { useTheme, useMediaQuery } from '@mui/material'
import Paper from '@mui/material/Paper'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import makeStyles from '@mui/styles/makeStyles'
import AccountCircleOutlined from '@mui/icons-material/AccountCircleOutlined'
import ContactSupportOutlined from '@mui/icons-material/ContactSupportOutlined'
import FavoriteBorderOutlined from '@mui/icons-material/FavoriteBorderOutlined'
import LogoutOutlined from '@mui/icons-material/LogoutOutlined'
import MenuIcon from '@mui/icons-material/Menu'
import clsx from 'clsx'
import Image from 'next/image'
import { useRouter } from 'next/dist/client/router'
import Link from 'next/link'

import logoFull from '../images/logoFull.svg'
import logoGrey from '../images/icons/logoGrey.svg'
import inspi from '../images/icons/inspiLine.svg'
import profil from '../images/icons/profil.svg'
import favorite from '../images/icons/favorite.svg'
import SearchField from './atoms/SearchField'
import home from '../images/icons/accueil.svg'
import { auth } from '../lib/firebase'
import { SessionContext } from '../contexts/session'
import Autocomplete from './Algolia/Autocomplete'
import ProductItem from './Algolia/ProductItem'
import SearchModal from './molecules/SearchModal'
import ButtonSearch from './atoms/ButtonSearch'

const useStyles = makeStyles(theme => ({
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
  headerInner: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerInnerRight: {
    display: 'flex',
    alignItems: 'center',
  },
  autocontainerNav: {
    maxWidth: '1140px',
    padding: '0px 15px',
    margin: '0 auto',
  },
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
  profilBtn: {
    display: 'flex',
    alignItems: 'center',
    padding: '5px 20px 5px 10px',
    borderRadius: '50px',
    zIndex: '1',
    position: 'relative',
    textTransform: 'unset',
    height: '40px',
    border: '1px solid #E0E0E0',
  },
  headerBgcGreen: {
    backgroundColor: theme.palette.grey.ultraLight,
    boxShadow: 'unset',
  },
  headerGrey: {
    backgroundColor: theme.palette.grey.e5,
    boxShadow: 'unset',
  },
  greyBgc: {
    backgroundColor: theme.palette.grey.f7,
  },
  whiteBgc: {
    backgroundColor: theme.palette.secondary.contrastText,
  },
  // mobile Part
  xsNav: {
    backgroundColor: 'white',
    position: 'fixed',
    bottom: '0',
    width: '100vw',
    height: '80px',
    zIndex: '100',
  },
  icons: {
    color: 'rgba(79, 79, 79, 0.5)',
    fontSize: '9px',
    fontWeight: '800',
  },
  tabs: {
    '& button': { textTransform: 'none', padding: '9px' },
  },
  nextLink: {
    textDecoration: 'none',
  },
  rootInput: {
    width: '250px',
    borderRadius: '50px',
    backgroundColor: '#FFFFFF',
  },
}))

const appId = 'QFT8LZMQXO'
const apiKey = '59e83f8d0cfafe2c0887fe8516f51fec'
const searchClient = algoliasearch(appId, apiKey)

const ConnectedNav = ({ isBgTransparent }) => {
  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)
  const [tabValue, setTabValue] = React.useState(0)
  const [searchModal, setSearchModal] = React.useState(false)
  const { user, setUser } = useContext(SessionContext)
  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  const handleChange = (event, newValue) => {
    setTabValue(newValue)
  }
  const logoutHandler = () => {
    auth.signOut().then(() => {
      setUser({ isLoggedIn: false })
    })
  }

  const classes = useStyles()
  const router = useRouter()
  const theme = useTheme()
  const matchesXs = useMediaQuery(theme.breakpoints.down('sm'))

  return matchesXs ? (
    <Paper variant="outlined" square className={classes.xsNav}>
      <Tabs
        centered
        variant="fullWidth"
        className={classes.tabs}
        value={tabValue}
        onChange={handleChange}
      >
        <Tab
          icon={
            <Image
              src={home}
              width={25}
              height={25}
              alt="home_logo"
              style={{
                maxWidth: '100%',
                height: 'auto',
              }}
            />
          }
          label={
            <Link passHref href="/">
              <Box component="span" className={classes.icons}>
                Home
              </Box>
            </Link>
          }
          sx={{ justifyContent: 'space-evenly', minWidth: 'unset' }}
        />

        <Tab
          icon={
            <Image
              src={inspi}
              width={25}
              height={25}
              alt="Inspiration_logo"
              style={{
                maxWidth: '100%',
                height: 'auto',
              }}
            />
          }
          label={
            <Link passHref href="/inspiration" className={classes.nextLink}>
              <Box component="span" className={classes.icons}>
                Inspi
              </Box>
            </Link>
          }
          sx={{ justifyContent: 'space-evenly', minWidth: 'unset' }}
        />
        <Tab
          icon={
            <Image
              src={logoGrey}
              width={25}
              height={25}
              alt="homePage_logo"
              style={{
                maxWidth: '100%',
                height: 'auto',
              }}
            />
          }
          label={
            <Link passHref href="https://app.explomaker.fr" className={classes.nextLink}>
              <Box component="span" className={classes.icons}>
                Séjours
              </Box>
            </Link>
          }
          sx={{ justifyContent: 'space-evenly', minWidth: 'unset' }}
        />
        <Tab
          icon={
            <Image
              src={favorite}
              width={25}
              height={25}
              alt="favorite_logo"
              style={{
                maxWidth: '100%',
                height: 'auto',
              }}
            />
          }
          label={
            <Link passHref href="/favorites" rel="nofollow" className={classes.nextLink}>
              <Box component="span" className={classes.icons}>
                Favoris
              </Box>
            </Link>
          }
          sx={{ justifyContent: 'space-evenly', minWidth: 'unset' }}
        />
        <Tab
          icon={
            <Image
              src={profil}
              width={25}
              height={25}
              alt="profile_logo"
              style={{
                maxWidth: '100%',
                height: 'auto',
              }}
            />
          }
          label={
            <Link passHref href="https://app.explomaker.fr/profile" className={classes.nextLink}>
              <Box component="span" className={classes.icons}>
                Profil
              </Box>
            </Link>
          }
          sx={{ justifyContent: 'space-evenly', minWidth: 'unset' }}
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
          <Link href="/" passHref className={classes.nextLink}>
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
            router.pathname.indexOf('/inspiration') !== router.pathname.split('').length - 12 && (
              <SearchField isNavbar />
            )} */}
          <ButtonSearch setSearchModal={setSearchModal} />
          <Box className={classes.headerInnerRight}>
            <Box>
              <Link href="/exploration" passHref>
                <Button disableRipple className={clsx(classes.navLink)}>
                  Exploration
                </Button>
              </Link>
              <Link href="/inspiration" passHref className={classes.nextLink}>
                <Button disableRipple className={classes.navLink}>
                  Inspiration
                </Button>
              </Link>
              <Link href="https://app.explomaker.fr" passHref className={classes.nextLink}>
                <Button disableRipple className={classes.navLink}>
                  Séjours
                </Button>
              </Link>
            </Box>
            <Box sx={{ position: 'relative' }} display="flex">
              <Badge badgeContent={0} color="secondary" overlap="circular">
                <div>
                  <Button
                    className={clsx(classes.profilBtn, {
                      [classes.greyBgc]: anchorEl,
                      [classes.whiteBgc]: isBgTransparent,
                    })}
                    startIcon={<Avatar src={user.avatar} sx={{ width: 30, height: 30 }} />}
                    endIcon={<MenuIcon sx={{ color: theme.palette.grey['4f'] }} />}
                    id="connected-button"
                    aria-controls="connected-menu"
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleClick}
                  />
                  <Menu
                    id="connected-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    disableScrollLock
                    MenuListProps={{
                      'aria-labelledby': 'connected-button',
                    }}
                    anchorPosition={{ left: 100, top: 100 }}
                  >
                    <Link href="/exploration" passHref rel="nofollow" className={classes.nextLink}>
                      <MenuItem onClick={handleClose}>
                        <Box
                          component="span"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          marginRight="14px"
                        >
                          <Image
                            src={logoGrey}
                            width={24}
                            height={24}
                            quality={100}
                            alt="search_logo"
                            style={{
                              maxWidth: '100%',
                              height: 'auto',
                            }}
                          />
                        </Box>
                        Recherche
                      </MenuItem>
                    </Link>
                    <Link href="/favorites" passHref rel="nofollow" className={classes.nextLink}>
                      <MenuItem onClick={handleClose}>
                        <Box
                          component="span"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          marginRight="14px"
                        >
                          <FavoriteBorderOutlined
                            sx={{
                              color: theme.palette.grey['4f'],
                              opacity: '0.5',
                            }}
                          />
                        </Box>
                        Favoris
                      </MenuItem>
                    </Link>
                    <Link
                      href="https://app.explomaker.fr/profile"
                      passHref
                      className={classes.nextLink}
                    >
                      <MenuItem onClick={handleClose}>
                        <Box
                          component="span"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          marginRight="14px"
                        >
                          <AccountCircleOutlined
                            sx={{
                              color: theme.palette.grey['4f'],
                              opacity: '0.5',
                            }}
                          />
                        </Box>
                        Profil
                      </MenuItem>
                    </Link>
                    <MenuItem
                      onClick={() => {
                        handleClose()
                        logoutHandler()
                      }}
                      sx={{ color: theme.palette.secondary.main }}
                    >
                      <Box
                        component="span"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        marginRight="14px"
                      >
                        <LogoutOutlined />
                      </Box>
                      Déconnexion
                    </MenuItem>
                    <Divider />
                    <Link href="https://app.explomaker.fr/help" passHref>
                      <MenuItem onClick={handleClose}>
                        <Box
                          component="span"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          marginRight="14px"
                        >
                          <ContactSupportOutlined
                            sx={{
                              color: theme.palette.grey['4f'],
                              opacity: '0.5',
                            }}
                          />
                        </Box>
                        Aide
                      </MenuItem>
                    </Link>
                  </Menu>
                </div>
              </Badge>
            </Box>
          </Box>
        </Box>
      </Box>
      {searchModal && <SearchModal open={searchModal} setOpen={setSearchModal} />}
    </Box>
  )
}
export default ConnectedNav
