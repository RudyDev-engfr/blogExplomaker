const AlgoliaPanel = ({
  children,
  header,
  footer,
  panelClassName,
  headerClassName,
  footerClassName,
}) => (
  <div className={panelClassName}>
    {header && <div className={headerClassName}>{header}</div>}
    <div className="ais-Panel-body">{children}</div>
    {footer && <div className={footerClassName}>{footer}</div>}
  </div>
)
export default AlgoliaPanel
