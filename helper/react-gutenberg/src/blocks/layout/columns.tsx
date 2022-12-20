import * as React from 'react'
import { uuid } from 'uuidv4'
import { WPGBlock } from '../../index'
import { IWPGBlock } from '../../types'

const WPGColumnsBlock: React.SFC<IWPGBlock> = props => {
  const {
    // attrs,
    innerBlocks,
    // innerHTML
  } = props

  if (!Array.isArray(innerBlocks)) {
    console.warn('Columns should have innerBlocks')
    return null
  }

  const cols = innerBlocks.length

  const columns = innerBlocks.map((col, ci) => (
    <div className={`wp-block-column ${ci + 1}-column`} key={uuid()}>
      {col.innerBlocks.map((block, bi) => (
        <WPGBlock key={bi} block={block} />
      ))}
    </div>
  ))

  return <div className={`wp-block-columns has-${cols}-columns`}>{columns}</div>
}

export default WPGColumnsBlock
