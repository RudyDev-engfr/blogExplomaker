import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import WPGBlocks from 'react-gutenberg'
import 'react-gutenberg/default.css'

import { testArticle } from '../../helper/testArticle'

export default function Article() {
  return (
    <Box
      sx={{
        width: '1000px',
        margin: 'auto',
        marginTop: '125px',
      }}
    >
      <Typography variant="h1" align="center">
        Salut
      </Typography>
      <WPGBlocks blocks={testArticle.blocks} />
    </Box>
  )
}
