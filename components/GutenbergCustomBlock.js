import loadable from '@loadable/component'
import CustomBlock from './CustomBlock'

const Employee = loadable(() => import('./CustomBlock'))

const GutenbergCustomBlock = ({ blockName }) => {
  switch (blockName) {
    case 'meta-box/blog-log-one':
      return CustomBlock
    default:
      return null
  }
}
export default GutenbergCustomBlock
