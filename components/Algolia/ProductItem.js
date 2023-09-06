import Link from 'next/link'
import Box from '@mui/material/Box'
import React from 'react'

export default function ProductItem({ hit, components }) {
  return (
    <Link href={hit.url_link} className="aa-ItemLink">
      <Box className="aa-ItemContent">
        <Box className="aa-ItemTitle">
          <components.Highlight hit={hit} attribute="titre" />
        </Box>
      </Box>
    </Link>
  )
}
