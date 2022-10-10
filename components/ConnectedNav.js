import React, { useContext } from 'react'
import Button from '@mui/material/Button'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Box from '@mui/material/Box'
import Badge from '@mui/material/Badge'
import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'
import { useTheme } from '@mui/material'
import Paper from '@mui/material/Paper'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import useMediaQuery from '@mui/material/useMediaQuery'
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
import { auth } from '../lib/firebase'
import { SessionContext } from '../contexts/session'

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
    width: '100%',
    height: '90px',
    padding: theme.spacing(1.5),
    zIndex: '100',
  },
  icons: {
    color: 'rgba(79, 79, 79, 0.5)',
    fontSize: '9px',
    fontWeight: '800',
  },
  tabs: {
    '& button': { textTransform: 'none' },
  },
}))

const ConnectedNav = ({ isBgTransparent }) => {
  const [anchorEl, setAnchorEl] = React.useState(null)
  const open = Boolean(anchorEl)
  const { user, setUser } = useContext(SessionContext)
  const handleClick = event => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
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
      <Tabs centered variant="fullWidth" className={classes.tabs}>
        <Tab
          icon={<Image src={inspi} width={25} height={25} />}
          label={
            <Link passHref href="/inspiration">
              <Box component="span" className={classes.icons}>
                Inspi
              </Box>
            </Link>
          }
          sx={{ justifyContent: 'space-evenly' }}
        />
        <Tab
          icon={<Image src={logoGrey} width={25} height={25} />}
          label={
            <Link passHref href="https://app.explomaker.fr">
              <Box component="span" className={classes.icons}>
                Séjours
              </Box>
            </Link>
          }
          sx={{ justifyContent: 'space-evenly' }}
          onClick={() => {
            window.location = 'https://explomaker-3010b.web.app/'
          }}
        />
        <Tab
          icon={<Image src={favorite} width={25} height={25} />}
          label={
            <Link passHref href="/favorites">
              <Box component="span" className={classes.icons}>
                Favoris
              </Box>
            </Link>
          }
          sx={{ justifyContent: 'space-evenly' }}
        />
        <Tab
          icon={<Image src={profil} width={25} height={25} />}
          label={
            <Link passHref href="https://app.explomaker.fr/profile">
              <Box component="span" className={classes.icons}>
                Profil
              </Box>
            </Link>
          }
          sx={{ justifyContent: 'space-evenly' }}
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
          <SearchField isNavbar />
          <Box className={classes.headerInnerRight}>
            <Box>
              <Link href="/" passHref>
                <Button disableRipple className={classes.navLink}>
                  Accueil
                </Button>
              </Link>
              <Link href="https://app.explomaker.fr" passHref>
                <Button disableRipple className={classes.navLink}>
                  Séjours
                </Button>
              </Link>
            </Box>
            <Box position="relative" display="flex">
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
                    <Link href="/inspiration" passHref>
                      <MenuItem onClick={handleClose}>
                        <Box
                          component="span"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          marginRight="14px"
                        >
                          <Image src={logoGrey} width={24} height={24} quality={100} />
                        </Box>
                        Inspiration
                      </MenuItem>
                    </Link>
                    <Link href="/favorites" passHref>
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
                    <Link href="https://app.explomaker.fr/profile" passHref>
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
    </Box>
  )
}
export default ConnectedNav
