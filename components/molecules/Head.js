import HeadNext from 'next/head'

import favicon from '../../images/favicon.svg'

const Head = ({
  title = 'Explomaker',
  description = '',
  url = 'https://app.explomaker.fr',
  thumbnail,
}) => (
  <HeadNext>
    <meta charset="utf-8" />
    <link rel="icon" type="image/svg+xml" href={favicon} />
    <title>{title} | Explomaker</title>
    <meta property="og:title" content={`${title} | Explomaker`} />
    <meta property="og:type" content="website" />
    {description && <meta name="description" content={description} />}
    {description && <meta property="og:description" content={description} />}
    <meta property="og:url" content={url} />
    <meta property="og:image" content={favicon} />
    {thumbnail && <meta property="og:image" content={thumbnail} />}
    <meta property="og:site_name" content="Explomaker" />
  </HeadNext>
)

export default Head
