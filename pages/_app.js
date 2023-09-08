import { useEffect } from 'react'
import { ThemeProvider } from '@mui/material/styles'
import StyledEngineProvider from '@mui/material/StyledEngineProvider'
import CssBaseline from '@mui/material/CssBaseline'
import { useLoadScript } from '@react-google-maps/api'

import theme from '../styles/theme'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import GlobalClassGenerator from '../styles/GlobalClassGenerator'

import HeadContextProvider from '../contexts/head'
import SessionContextProvider from '../contexts/session'

import '../styles/firebaseui-styling.global.css'
import '../styles/global.css'
import '../styles/algolia.css'
import '../helper/react-gutenberg/default.css'
import Loader from '../components/atoms/Loader'

const mapsLibraries = ['places']

const MyApp = props => {
  const { Component, pageProps } = props
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: 'AIzaSyBJepvl7rY64ocX_24S1FnqYFyEHTRNBFU',
    libraries: mapsLibraries,
  })

  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles)
    }
  }, [])

  if (isLoaded) {
    return (
      <>
        <GlobalClassGenerator>
          <StyledEngineProvider injectFirst>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <HeadContextProvider>
                <SessionContextProvider>
                  <Nav />
                  <Component {...pageProps} />
                  <Footer />
                </SessionContextProvider>
              </HeadContextProvider>
            </ThemeProvider>
          </StyledEngineProvider>
        </GlobalClassGenerator>
      </>
    )
  }
  return <h2>{loadError || <Loader />}</h2>
}

export default MyApp
