/* eslint-disable @next/next/no-page-custom-font */
import HeadNext from 'next/head'
import Script from 'next/script'
import { useContext } from 'react'
import { HeadContext } from '../../contexts/head'
import favicon from '../../images/favicon.svg'
import theme from '../../styles/theme'

const Head = () => {
  const { headData: tags } = useContext(HeadContext)

  return (
    <div>
      <HeadNext>
        {typeof tags !== 'undefined' && (
          <>
            <meta charset="utf-8" />
            <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
            <title>{tags?.title}</title>
            <meta name="description" content={tags.description} />

            {/* Open Graph metadata */}
            <meta property="og:title" content={`${tags['og:title']} | Explomaker`} />
            <meta property="og:type" content={tags['og:type']} />
            <meta property="og:description" content={tags['og:description']} />
            <meta property="og:url" content={encodeURI(tags['og:url'])} />
            <meta property="og:site_name" content={tags['og:site_name']} />
            <meta property="og:image" content={tags['og:image']} />

            {/* Other metadata */}
            <meta name="theme-color" content={theme.palette.primary.main} />
            <link rel="icon" type="image/svg" href="../favicon.svg" />
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
          </>
        )}
        {console.log('showmetags', tags)}
      </HeadNext>
    </div>
  )
}

export default Head
