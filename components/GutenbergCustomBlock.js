import loadable from '@loadable/component'
import CustomBlock from './CustomBlock'

const carousel = loadable(() => import('./CustomBlock'))

const GetCustomBlock = ({ blockName }) => {
  switch (blockName) {
    case 'meta-box/blog-log-one':
      return CustomBlock
    default:
      return null
  }
}
export default GetCustomBlock
