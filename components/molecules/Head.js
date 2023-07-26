/* eslint-disable @next/next/no-page-custom-font */
import HeadNext from 'next/head'
import { useRouter } from 'next/router'
import Script from 'next/script'
import { useContext, useEffect } from 'react'
import { HeadContext } from '../../contexts/head'
// import favicon from '../../images/favicon.svg'
import theme from '../../styles/theme'

const Head = ({ tags }) => {
  // const { headData: tags } = useContext(HeadContext)

  useEffect(() => {
    console.log(document.querySelector('meta[name="viewport"]'))
    console.log(document.querySelector('meta[name="description"]'))
    console.log(document.querySelector('meta[name="agd-partner-manual-verification"]'))
    console.log(document.querySelector('meta[property="og:title"]'))
    console.log(document.querySelector('meta[property="og:type"]'))
    console.log(document.querySelector('meta[property="og:description"]'))
    console.log(document.querySelector('meta[property="og:url"]'))
    console.log(document.querySelector('meta[property="og:site_name"]'))
    console.log(document.querySelector('meta[property="og:image"]'))
    console.log(document.querySelector('meta[name="theme-color"]'))
  }, [])

  return (
    <div>
      <HeadNext>
        <meta charset="utf-8" />
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
        <link rel="icon" href="/favicon.ico" />
        <link
          href="https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Vesper+Libre:wght@400;500;700&display=swap"
          rel="stylesheet"
          crossOrigin="anonymous"
        />

        {/* Google Tag Manager */}
        <Script id="google-tag-manager" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','GTM-M655582');`}
        </Script>
        {/* End Google Tag Manager */}
        <meta name="agd-partner-manual-verification" />

        <>
          <title>
            {tags?.title || 'Explomaker - Planification de voyage simplifiée et personnalisée'}
          </title>
          <meta
            name="description"
            content={
              tags.description ||
              'Avec Explomaker, planifiez votre voyage parfait en quelques clics. Collaborez avec des amis, découvrez des destinations inspirantes et gérez toutes vos informations en un seul endroit. Essayez notre assistant de voyage virtuel pour une expérience encore plus enrichissante.'
            }
          />

          {/* Open Graph metadata */}
          <meta
            property="og:title"
            content={
              tags['og:title'] || 'Explomaker - Votre assistant de planification de voyage ultime'
            }
          />
          <meta property="og:type" content={tags['og:type'] || 'website'} />
          <meta
            property="og:description"
            content={
              tags['og:description'] ||
              'Découvrez Explomaker, une application de planification de voyage innovante qui simplifie le processus de planification, offre des suggestions personnalisées et centralise toutes vos informations de voyage.'
            }
          />
          <meta property="og:url" content={encodeURI(tags['og:url'])} />
          <meta property="og:site_name" content={tags['og:site_name'] || 'Explomaker'} />
          <meta
            property="og:image"
            content={
              tags['og:image'] ||
              'https://storage.googleapis.com/explomaker-data-stateless/2018/12/5f6f7f1e-explomaker-app-logo.jpg'
            }
          />

          {/* Other metadata */}
          <meta name="theme-color" content={theme.palette.primary.main} />
        </>
        {console.log('showmetags', tags)}
      </HeadNext>
    </div>
  )
}

export default Head
