Object.defineProperty(exports, '__esModule', { value: true })
const component_1 = require('@loadable/component')
const Code = (0, component_1.default)(() => Promise.resolve().then(() => require('./code')))
const Html = (0, component_1.default)(() => Promise.resolve().then(() => require('./html')))
const Preformatted = (0, component_1.default)(() =>
  Promise.resolve().then(() => require('./preformatted'))
)
const Pullquote = (0, component_1.default)(() =>
  Promise.resolve().then(() => require('./pullquote'))
)
exports.default = {
  Code,
  Html,
  Preformatted,
  Pullquote,
}
//# sourceMappingURL=index.js.map
