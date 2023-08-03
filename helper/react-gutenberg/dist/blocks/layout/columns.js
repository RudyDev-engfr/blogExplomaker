Object.defineProperty(exports, '__esModule', { value: true })
const React = require('react')
const uuidv4_1 = require('uuidv4')
const index_1 = require('../../index')
const WPGColumnsBlock = props => {
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
  const columns = innerBlocks.map((col, ci) =>
    React.createElement(
      'div',
      { className: `wp-block-column ${ci + 1}-column`, key: (0, uuidv4_1.uuid)() },
      col.innerBlocks.map((block, bi) =>
        React.createElement(index_1.WPGBlock, { key: bi, block: block })
      )
    )
  )
  return React.createElement('div', { className: `wp-block-columns has-${cols}-columns` }, columns)
}
exports.default = WPGColumnsBlock
//# sourceMappingURL=columns.js.map
