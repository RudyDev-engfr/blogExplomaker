import { useEffect } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { ThemeProvider } from '@mui/material/styles'
import StyledEngineProvider from '@mui/material/StyledEngineProvider'
import CssBaseline from '@mui/material/CssBaseline'
import { useLoadScript } from '@react-google-maps/api'

import theme from '../styles/theme'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import GlobalClassGenerator from '../styles/GlobalClassGenerator'
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
    googleMapsApiKey: 'AIzaSyCKC9_XX60E1at2qp_90SU07-d-22pDydM',
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
        <Head>
          {/* <title>Explomaker</title> */}
          <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
        </Head>
        <GlobalClassGenerator>
          <StyledEngineProvider injectFirst>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <SessionContextProvider>
                <Nav />
                <Component {...pageProps} />
                <Footer />
              </SessionContextProvider>
            </ThemeProvider>
          </StyledEngineProvider>
        </GlobalClassGenerator>
      </>
    )
  }
  return <h2>{loadError || <Loader />}</h2>
}

export default MyApp
