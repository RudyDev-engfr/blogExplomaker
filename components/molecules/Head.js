import HeadNext from 'next/head'

import favicon from '../../images/favicon.svg'

const Head = ({
  title = 'ABc',
  description = '',
  url = 'https://app.explomaker.fr',
  thumbnail,
  OG = '',
}) => (
  <div>
    <HeadNext>
      <meta charset="utf-8" />
      {/* <link rel="icon" type="image/svg+xml" href={favicon} /> */}
      <div dangerouslySetInnerHTML={{ __html: title }} />
      {/* <meta property="og:title" content={`${title} | Explomaker`} /> */}
      <meta property="og:type" content="website" />
      <div dangerouslySetInnerHTML={{ __html: description }} />
      {/* <meta name="description" content={description} />
      <meta property="og:description" content={description} /> */}
      <meta property="og:url" content={url} />
      <div dangerouslySetInnerHTML={{ __html: OG }} />
      {/* <meta property="og:image" content={favicon} /> */}
      {/* <meta property="og:image" content={thumbnail} /> */}
      {/* <meta property="og:site_name" content="Explomaker" /> */}
    </HeadNext>
  </div>
)

export default Head
