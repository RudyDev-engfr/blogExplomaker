import createGenerateClassName from '@mui/styles/createGenerateClassName'
import StylesProvider from '@mui/styles/StylesProvider'

const generateClassName = createGenerateClassName({
  productionPrefix: 'c',
  disableGlobal: true,
})

const GlobalClassGenerator = ({ children }) => (
  <StylesProvider generateClassName={generateClassName}>{children}</StylesProvider>
)

export default GlobalClassGenerator
