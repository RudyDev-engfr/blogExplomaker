import { Box } from '@mui/material'

const AlgoliaPanel = ({
  children,
  header,
  footer,
  panelClassName,
  headerClassName,
  footerClassName,
}) => (
  <Box className={panelClassName}>
    {header && <Box className={headerClassName}>{header}</Box>}
    <Box className="ais-Panel-body">{children}</Box>
    {footer && <Box className={footerClassName}>{footer}</Box>}
  </Box>
)
export default AlgoliaPanel
