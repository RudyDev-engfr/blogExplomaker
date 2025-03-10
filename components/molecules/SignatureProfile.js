import { Avatar, Box, Typography } from '@mui/material'
import { useTheme } from '@mui/styles'
import { format, parse } from 'date-fns'
import Link from 'next/link'

const SignatureProfile = ({
  avatarSrc = '../../images/emma.png',
  avatarAlt = 'avatar',
  profileName = 'Team explomaker',
  date = '06 Mai 2020',
  readingTime = '12 min',
  tags,
  likes = 47,
  comments = 4,
}) => {
  const theme = useTheme()

  return (
    <Box sx={{ paddingRight: '50px' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '60px' }}>
        <Box sx={{ maxWidth: '280px' }}>
          <Avatar alt={avatarAlt} src={avatarSrc} sx={{ height: '60px', width: '60px' }} />
        </Box>
        <Box sx={{ paddingLeft: '15px' }}>
          <Typography sx={{ fontSize: '22px', lineHeight: '26px', fontWeight: '500' }}>
            {profileName}
          </Typography>
          <Typography sx={{ fontSize: '17px', lineHeight: '25px', fontWeight: '400' }}>
            {format(parse(date, 'yyyy-MM-dd HH:mm:ss', new Date()), 'dd MMM yyyy')} |
            {` ${readingTime} `}
          </Typography>
        </Box>
      </Box>
      <Box>
        {tags && tags.length < 0 && (
          <>
            <Box sx={{ marginBottom: '20px' }}>
              <Typography sx={{ fontSize: '20px', fontWeight: '500', lineHeight: '24px' }}>
                Tags de l&apos;article
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'flex-start', flexWrap: 'wrap' }}>
              {tags.map(tag => (
                <Link
                  passHref
                  href={`/exploration?SearchFront%5BrefinementList%5D%5Benvies%5D%5B0%5D=${encodeURI(
                    tag.name
                  )}`}
                >
                  <Box
                    key={tag.name}
                    sx={{
                      padding: '6px 12px',
                      backgroundColor: theme.palette.grey.f7,
                      borderRadius: '30px',
                      gap: '10px',
                      maxWidth: 'fit-content',
                      marginRight: '10px',
                      marginBottom: '10px',
                    }}
                  >
                    <Typography component="span" sx={{ fontWeight: '400' }}>
                      {tag.name}
                    </Typography>
                  </Box>
                </Link>
              ))}
            </Box>
          </>
        )}
      </Box>
    </Box>
  )
}
export default SignatureProfile
