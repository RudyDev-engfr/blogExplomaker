import HeadNext from 'next/head'

import favicon from '../../images/favicon.svg'

const Head = ({ tags }) => (
  <div>
    <HeadNext>
      <meta charset="utf-8" />
      <meta property="og:title" content={`${tags['og:title']} | Explomaker`} />
      <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
      <title>{tags.title}</title>
      <meta property="og:type" content={tags['og:type']} key="og:type" />
      <meta name="description" content={tags.description} />
      <meta property="og:description" content={tags['og:description']} />
      <meta property="og:url" content={encodeURI(tags['og:url'])} />
      <meta property="og:site_name" content={tags['og:site_name']} />
      <meta property="og:image" content={tags['og:image']} key="ogimage" />
    </HeadNext>
  </div>
)

export default Head
