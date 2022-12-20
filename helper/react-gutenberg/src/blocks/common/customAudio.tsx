import * as React from 'react'
import { IWPGBlock } from '../../types'

const CustomAudioBlock: React.SFC<IWPGBlock> = props => {
  const { attrs, innerHTML } = props

  return <div className="custom-audio" dangerouslySetInnerHTML={{ __html: innerHTML }} />
}

export default CustomAudioBlock
