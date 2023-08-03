import React, { useState } from 'react'
import Modal from '@mui/material/Modal'
import Paper from '@mui/material/Paper'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material'
import Image from 'next/image'
import makeStyles from '@mui/styles/makeStyles'
import ArrowBackIos from '@mui/icons-material/ArrowBackIos'
import Close from '@mui/icons-material/Close'
import { useRouter } from 'next/dist/client/router'
import { toast } from 'react-toastify'
import Carousel from 'react-multi-carousel'
import 'react-multi-carousel/lib/styles.css'

import Login from './Login'
import { StyledFirebaseAuth } from '../../../helper/react-firebaseui'
// import { SessionContext } from '../../contexts/session'
import { auth, firestore, uiConfig } from '../../../lib/firebase'

import authImg from '../../../images/loginImg.png'
import lineMobile from '../../../images/lineMobile.svg'

const useStyles = makeStyles(theme => ({
  paper: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    [theme.breakpoints.down('sm')]: {
      width: '100vw',
      position: 'relative',
      top: '70vh',
      left: 'unset',
      transform: 'unset',
      borderRadius: '20px 20px 0 0',
      paddingBottom: '24px',
    },
  },
  modalTitle: {
    fontWeight: '700',
    fontSize: '28px',
    lineHeight: '32px',
  },
  invisibleButton: {
    textTransform: 'none',
    '&:hover': {
      backgroundColor: 'unset',
      color: '#008481',
    },
  },
  carouselImg: {
    width: '100vw',
    height: '100vh',
  },
  carouselDescriptionBox: {
    backgroundColor: theme.palette.primary.ultraLight,
    height: '30px',
    position: 'absolute',
    top: 'calc(70vh - 52px)',
    left: '20%',
    zIndex: '2',
    padding: '1px 15px 1px 15px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '30px',
  },
  carouselDescription: {
    color: theme.palette.primary.main,
    fontSize: '12px',
    lneHeight: '18px',
    fontWeight: '400',
  },
  carouselBox: {
    position: 'fixed',
    width: '100vw',
    height: '100vh',
  },
  carouselItemClass: {
    maxWidth: '100vw',
  },
  carouselContainerClass: {
    maxWidth: '100vw',
    height: 'auto',
  },
}))

const imgGallery = [
  {
    srcImg: authImg,
    description: 'Grande muraille de Chine - Nanlou, Chine',
  },
  {
    srcImg: authImg,
  },
  {
    srcImg: authImg,
  },
  {
    srcImg: authImg,
  },
]

const LoginModal = ({ modalState, modalStateSetter, handleProviderLogin }) => {
  const classes = useStyles()
  const theme = useTheme()
  const matchesXs = useMediaQuery(theme.breakpoints.down('sm'))
  return (
    <Modal
      disableScrollLock
      open={modalState === 'login'}
      onClose={() => modalStateSetter('')}
      sx={{
        [theme.breakpoints.down('sm')]: {
          maxWidth: '100vw',
          posiion: 'relative',
          overflowY: 'scroll',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
      }}
    >
      {matchesXs ? (
        <>
          <Box className={classes.carouselBox}>
            <Carousel
              swipeable
              showDots={false}
              responsive={{
                mobile: {
                  breakpoint: { max: 464, min: 0 },
                  items: 1,
                },
              }}
              infinite
              autoplay={false}
              keyBoardControl
              arrows={false}
              itemClass={classes.carouselItemClass}
              containerClass={classes.carouselContainerClass}
            >
              {imgGallery.map(({ srcImg, description }) => (
                <>
                  <Box sx={{ width: '100vw', height: '100vh', position: 'relative' }}>
                    <Image
                      src={srcImg}
                      alt="gallery_image"
                      className={classes.carouselImg}
                      key={srcImg}
                      layout="fill"
                    />
                  </Box>
                  <Box className={classes.carouselDescriptionBox}>
                    <Typography
                      dangerouslySetInnerHTML={{ __html: description }}
                      className={classes.carouselDescription}
                    />
                  </Box>
                </>
              ))}
            </Carousel>
          </Box>
          <Paper className={classes.paper}>
            <Box display="flex" justifyContent="center" paddingTop="10px" paddingBottom="40px">
              <Image src={lineMobile} alt="lineMobile_image" />
            </Box>
            <Box position="absolute" top="2%" right="2%">
              <IconButton onClick={() => modalStateSetter('')} size="large">
                <Close />
              </IconButton>
            </Box>
            <Box paddingTop="16px" marginBottom="16px">
              <Typography variant="h3" className={classes.modalTitle} align="center">
                Connexion
              </Typography>
            </Box>
            <Box mx={4} my={3}>
              <Login isOpen={modalState === 'login'} setOpenModal={modalStateSetter}>
                {modalState === 'login' && (
                  <StyledFirebaseAuth
                    uiConfig={{
                      ...uiConfig,
                      callbacks: {
                        signInSuccessWithAuthResult: authResult => {
                          handleProviderLogin(authResult)
                          modalStateSetter('')
                        },
                      },
                    }}
                    firebaseAuth={auth}
                  />
                )}
              </Login>

              <Box display="flex" alignItems="center">
                <Typography>Pas encore de compte ?</Typography>
                <Button
                  size="large"
                  onClick={() => modalStateSetter('signup')}
                  disableRipple
                  startIcon="👉"
                  className={classes.invisibleButton}
                >
                  Inscription
                </Button>
              </Box>
            </Box>
          </Paper>
        </>
      ) : (
        <Paper className={classes.paper}>
          <Box position="absolute" top="2%" right="2%">
            <IconButton onClick={() => modalStateSetter('')} size="large">
              <Close />
            </IconButton>
          </Box>
          <Box my={2}>
            <Typography variant="h3" className={classes.modalTitle} align="center">
              Connexion
            </Typography>
            <Typography variant="subtitle1" align="center">
              Bon retour parmi nous, explorateur !
            </Typography>
          </Box>
          <Divider />
          <Box mx={4} marginTop="24px">
            <Login isOpen={modalState === 'login'} setOpenModal={modalStateSetter}>
              {modalState === 'login' && (
                <StyledFirebaseAuth
                  uiConfig={{
                    ...uiConfig,
                    callbacks: {
                      signInSuccessWithAuthResult: authResult => {
                        handleProviderLogin(authResult)
                        modalStateSetter('')
                      },
                    },
                  }}
                  firebaseAuth={auth}
                />
              )}
            </Login>

            <Box display="flex" alignItems="center">
              <Typography>Pas encore de compte ?</Typography>
              <Button
                size="large"
                onClick={() => modalStateSetter('signup')}
                disableRipple
                startIcon="👉"
                className={classes.invisibleButton}
              >
                Inscription
              </Button>
            </Box>
          </Box>
        </Paper>
      )}
    </Modal>
  )
}

const SignUpModal = ({
  modalState,
  modalStateSetter,
  handleProviderLogin,
  redirectFunction = () => {},
}) => {
  const classes = useStyles()
  const router = useRouter()
  const theme = useTheme()
  const matchesXs = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <Modal
      disableScrollLock
      open={modalState === 'signup'}
      onClose={() => modalStateSetter('')}
      sx={{
        [theme.breakpoints.down('sm')]: {
          overflowY: 'scroll',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
      }}
    >
      {matchesXs ? (
        <>
          <Box position="fixed" width="100vw" height="100vh">
            <Carousel
              swipeable
              showDots={false}
              responsive={{
                mobile: {
                  breakpoint: { max: 464, min: 0 },
                  items: 1,
                },
              }}
              infinite
              autoplay={false}
              keyBoardControl
              arrows={false}
            >
              {imgGallery.map(({ srcImg, description }) => (
                <>
                  <Box sx={{ width: '100vw', height: '100vh', position: 'relative' }}>
                    <Image
                      src={srcImg}
                      alt="gallery_image"
                      className={classes.carouselImg}
                      key={srcImg}
                      layout="fill"
                    />
                  </Box>
                  <Box className={classes.carouselDescriptionBox}>
                    <Typography
                      dangerouslySetInnerHTML={{ __html: description }}
                      className={classes.carouselDescription}
                    />
                  </Box>
                </>
              ))}
            </Carousel>
          </Box>
          <Paper className={classes.paper}>
            <Box display="flex" justifyContent="center" paddingTop="10px" paddingBottom="40px">
              <Image src={lineMobile} alt="lineMobile_image" />
            </Box>
            <Box position="absolute" top="2%" right="2%">
              <IconButton onClick={() => modalStateSetter('')} size="large">
                <Close />
              </IconButton>
            </Box>
            <Box m={3}>
              <Typography variant="h3" align="center" className={classes.modalTitle}>
                Inscription
              </Typography>
            </Box>
            <Divider />
            <Box mx={4} my={3}>
              <Box my={2} display="flex" justifyContent="center">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    redirectFunction()
                    // TODO rediriger vers Explomaker
                    router.push('https://app.explomaker.fr/signup/secondStep')
                  }}
                  sx={{ width: '360px' }}
                >
                  S&apos;inscrire avec un Email
                </Button>
              </Box>
              <Divider>OU</Divider>
              {modalState === 'signup' && (
                <StyledFirebaseAuth
                  uiConfig={{
                    ...uiConfig,
                    callbacks: {
                      signInSuccessWithAuthResult: authResult => {
                        handleProviderLogin(authResult)
                        modalStateSetter('')
                      },
                    },
                  }}
                  firebaseAuth={auth}
                />
              )}
              <Box display="flex" justifyContent="center" alignItems="center">
                <Typography>Déjà membre ?</Typography>
                <Button
                  size="large"
                  onClick={() => modalStateSetter('login')}
                  startIcon="👉"
                  disableRipple
                  className={classes.invisibleButton}
                >
                  Connexion
                </Button>
              </Box>
            </Box>
          </Paper>
        </>
      ) : (
        <Paper className={classes.paper}>
          <Box position="absolute" top="2%" right="2%">
            <IconButton onClick={() => modalStateSetter('')} size="large">
              <Close />
            </IconButton>
          </Box>
          <Box m={3} paddingTop="24px">
            <Typography variant="h3" align="center" className={classes.modalTitle}>
              Inscription
            </Typography>
          </Box>
          <Divider />
          <Box mx={4} my={3}>
            <Box my={2} display="flex" justifyContent="center">
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  redirectFunction()
                  // TODO rediriger vers explomaker
                  router.push('https://app.explomaker.fr/signup/secondStep')
                }}
                sx={{ width: '360px' }}
              >
                S&apos;inscrire avec un Email
              </Button>
            </Box>
            <Divider>OU</Divider>
            {modalState === 'signup' && (
              <StyledFirebaseAuth
                uiConfig={{
                  ...uiConfig,
                  callbacks: {
                    signInSuccessWithAuthResult: authResult => {
                      handleProviderLogin(authResult)
                      modalStateSetter('')
                    },
                  },
                }}
                firebaseAuth={auth}
              />
            )}
            <Box display="flex" justifyContent="center" alignItems="center">
              <Typography>Déjà membre ?</Typography>
              <Button
                size="large"
                onClick={() => modalStateSetter('login')}
                startIcon="👉"
                disableRipple
                className={classes.invisibleButton}
              >
                Connexion
              </Button>
            </Box>
          </Box>
        </Paper>
      )}
    </Modal>
  )
}

const PasswordResetModal = ({ modalState, modalStateSetter }) => {
  const classes = useStyles()
  const theme = useTheme()
  const matchesXs = useMediaQuery(theme.breakpoints.down('sm'))

  const [emailReset, setEmailReset] = useState('')
  const [error, setError] = useState()

  const handlePwdReset = event => {
    event.preventDefault()
    auth
      .sendPasswordResetEmail(emailReset)
      .then(() => {
        modalStateSetter('')
        toast.success('Email de changement de mot de passe envoyé', {
          position: 'bottom-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        })
      })
      .catch(() => {
        setError("Cet utilisateur n'existe pas")
      })
  }

  return (
    <Modal
      disableScrollLock
      open={modalState === 'pwdReset'}
      onClose={() => modalStateSetter('')}
      sx={{
        [theme.breakpoints.down('sm')]: {
          overflowY: 'scroll',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },
      }}
    >
      {matchesXs ? (
        <>
          <Box position="fixed" width="100vw" height="100vh">
            <Carousel
              swipeable
              showDots={false}
              responsive={{
                mobile: {
                  breakpoint: { max: 640, min: 0 },
                  items: 1,
                },
              }}
              infinite
              autoplay={false}
              keyBoardControl
              arrows={false}
            >
              {imgGallery.map(({ srcImg, description }) => (
                <>
                  <Box sx={{ width: '100vw', height: '100vh', position: 'relative' }}>
                    <Image
                      src={srcImg}
                      alt="gallery_image"
                      className={classes.carouselImg}
                      key={srcImg}
                      layout="fill"
                    />
                  </Box>
                  <Box className={classes.carouselDescriptionBox}>
                    <Typography
                      dangerouslySetInnerHTML={{ __html: description }}
                      className={classes.carouselDescription}
                    />
                  </Box>
                </>
              ))}
            </Carousel>
          </Box>
          <Paper className={classes.paper}>
            <Box display="flex" justifyContent="center" paddingTop="10px" paddingBottom="40px">
              <Image src={lineMobile} alt="lineMobile_image" />
            </Box>
            <Box position="absolute" top="2%" left="2%">
              <IconButton onClick={() => modalStateSetter('login')} size="large">
                <ArrowBackIos style={{ transform: 'translate(5px ,0)' }} />
              </IconButton>
            </Box>
            <Box position="absolute" top="2%" right="2%">
              <IconButton onClick={() => modalStateSetter('')} size="large">
                <Close />
              </IconButton>
            </Box>
            <Box m={2} paddingTop="24px">
              <Typography variant="h3" align="center" className={classes.modalTitle}>
                Oubli de mot de passe
              </Typography>
              <Typography variant="subtitle1" align="center">
                Donnes nous l&apos;email de ton compte et nous t&apos;enverrons le lien pour changer
                ton mot de passe
              </Typography>
            </Box>
            <Divider />
            <form onSubmit={handlePwdReset}>
              <Box m={4}>
                <TextField
                  id="emailReset"
                  type="email"
                  label="Email"
                  variant="filled"
                  value={emailReset}
                  onChange={event => setEmailReset(event.target.value)}
                  error={!!error}
                  helperText={error}
                  fullWidth
                />
                <Box my={2} />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={emailReset.length < 3}
                >
                  Continuer
                </Button>
              </Box>
            </form>
          </Paper>
        </>
      ) : (
        <Paper className={classes.paper}>
          <Box position="absolute" top="2%" left="2%">
            <IconButton onClick={() => modalStateSetter('login')} size="large">
              <ArrowBackIos style={{ transform: 'translate(5px ,0)' }} />
            </IconButton>
          </Box>
          <Box position="absolute" top="2%" right="2%">
            <IconButton onClick={() => modalStateSetter('')} size="large">
              <Close />
            </IconButton>
          </Box>
          <Box m={2}>
            <Typography variant="h3" align="center" className={classes.modalTitle}>
              Oubli de mot de passe
            </Typography>
            <Typography variant="subtitle1" align="center">
              Donnes nous l&apos;email de ton compte et nous t&apos;enverrons le lien pour changer
              ton mot de passe
            </Typography>
          </Box>
          <Divider />

          <form onSubmit={handlePwdReset}>
            <Box m={4}>
              <TextField
                id="emailReset"
                type="email"
                label="Email"
                variant="filled"
                value={emailReset}
                onChange={event => setEmailReset(event.target.value)}
                error={!!error}
                helperText={error}
                fullWidth
              />
              <Box my={2} />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={emailReset.length < 3}
                sx={{ textTransform: 'none' }}
              >
                Continuer
              </Button>
            </Box>
          </form>
        </Paper>
      )}
    </Modal>
  )
}

const AuthModals = ({ modalState, modalStateSetter }) => {
  // const { setUser } = useContext(SessionContext)

  const handleProviderLogin = authResult => {
    const tempUser = {}
    const name = authResult.user.displayName.split(' ')
    tempUser.email = authResult.user.email
    tempUser.firstname = name[0]
    tempUser.lastname = name[1]
    tempUser.avatar = authResult.user.photoURL
    tempUser.id = authResult.user.uid
    firestore
      .collection('users')
      .doc(tempUser.id)
      .set({ ...tempUser, newsletter: false })
    tempUser.isLoggedIn = true
    // setUser({ ...tempUser })
  }

  return (
    <>
      <LoginModal
        modalState={modalState}
        modalStateSetter={modalStateSetter}
        handleProviderLogin={handleProviderLogin}
      />
      <SignUpModal
        modalState={modalState}
        modalStateSetter={modalStateSetter}
        handleProviderLogin={handleProviderLogin}
      />
      <PasswordResetModal modalState={modalState} modalStateSetter={modalStateSetter} />
    </>
  )
}

export default AuthModals
