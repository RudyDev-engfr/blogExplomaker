Object.defineProperty(exports, '__esModule', { value: true })
const React = require('react')
const CustomAudioBlock = props => {
  const { attrs, innerHTML } = props
  return React.createElement('div', {
    className: 'custom-audio',
    dangerouslySetInnerHTML: { __html: innerHTML },
  })
}
exports.default = CustomAudioBlock
//# sourceMappingURL=customAudio.js.map
