import React from 'react'
import { Box } from '@mui/material'
import { makeStyles } from '@mui/styles'

const useStyles = makeStyles(theme => ({
  container: {
    width: '100%',
    height: '100vh',
    backgroundColor: theme.palette.primary.main,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    '& svg': { height: '180px' },
  },
}))

const Loader = () => {
  const classes = useStyles()

  return (
    <Box className={classes.container}>
      <svg viewBox="0 0 21 25" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M20.6114 9.51582C20.6114 12.3768 19.4973 15.0665 17.4744 17.0894C15.6451 18.9185 13.313 19.9462 10.919 20.1729V22.7422C12.4855 22.9967 13.8628 23.8225 14.8271 25L4.97142 24.9871C5.93807 23.813 7.3163 22.991 8.88272 22.7401V20.1729C6.48841 19.9463 4.15698 18.9189 2.32728 17.0894C1.54673 16.3088 0.893382 15.4142 0.38501 14.4306L2.19399 13.4958C2.44703 13.9857 2.74959 14.4441 3.08798 14.8745C3.49886 15.35 4.04974 15.9667 4.52506 16.3173C7.92667 19.0096 12.8941 18.7901 16.0344 15.6494C17.6729 14.0111 18.5751 11.8329 18.5751 9.51582C18.5751 7.19895 17.6729 5.0205 16.0344 3.38223C15.4024 2.75017 14.6777 2.22076 13.8808 1.80897L14.8152 0C15.799 0.508121 16.6936 1.16171 17.4744 1.94226C19.4973 3.9652 20.6114 6.65505 20.6114 9.51582Z"
          fill="#4F4F4F"
          fillOpacity="0.5"
        />
        <path
          d="M20.6114 9.51582C20.6114 12.3768 19.4973 15.0665 17.4744 17.0894C15.6451 18.9185 13.313 19.9462 10.919 20.1729V22.7422C12.4855 22.9967 13.8628 23.8225 14.8271 25L4.97142 24.9871C5.93807 23.813 7.3163 22.991 8.88272 22.7401V20.1729C6.48841 19.9463 4.15698 18.9189 2.32728 17.0894C1.54673 16.3088 0.893382 15.4142 0.38501 14.4306L2.19399 13.4958C2.44703 13.9857 2.74959 14.4441 3.08798 14.8745C3.49886 15.35 4.04974 15.9667 4.52506 16.3173C7.92667 19.0096 12.8941 18.7901 16.0344 15.6494C17.6729 14.0111 18.5751 11.8329 18.5751 9.51582C18.5751 7.19895 17.6729 5.0205 16.0344 3.38223C15.4024 2.75017 14.6777 2.22076 13.8808 1.80897L14.8152 0C15.799 0.508121 16.6936 1.16171 17.4744 1.94226C19.4973 3.9652 20.6114 6.65505 20.6114 9.51582Z"
          fill="#FFFFFF"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M9.90077 15.876C8.5424 15.876 7.24905 15.4539 6.17012 14.6722C6.10635 14.6176 6.04507 14.566 5.98529 14.5157C5.59591 14.1877 5.26987 13.9131 4.73083 13.2315C2.93215 10.7416 3.15289 7.23446 5.3933 4.99405C7.879 2.50882 11.9225 2.50882 14.4082 4.99405C14.6643 5.25462 14.8403 5.45556 15.0722 5.77367L7.63768 13.2046C8.45602 13.7068 9.42588 13.9254 10.4244 13.8092C11.1878 13.7204 11.9195 13.4241 12.5284 12.9552C13.6247 12.1108 14.2389 10.8533 14.2389 9.50152H16.2752C16.2752 11.2041 15.6121 12.805 14.4082 14.009C13.2042 15.2128 11.6034 15.876 9.90077 15.876ZM9.90077 5.16546C8.78981 5.16546 7.67883 5.58824 6.83327 6.43404C5.38956 7.87751 5.17817 10.0938 6.19864 11.7639L12.1632 5.79939C11.4715 5.37661 10.686 5.16546 9.90077 5.16546Z"
          fill="#4F4F4F"
          fillOpacity="0.5"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M9.90077 15.876C8.5424 15.876 7.24905 15.4539 6.17012 14.6722C6.10635 14.6176 6.04507 14.566 5.98529 14.5157C5.59591 14.1877 5.26987 13.9131 4.73083 13.2315C2.93215 10.7416 3.15289 7.23446 5.3933 4.99405C7.879 2.50882 11.9225 2.50882 14.4082 4.99405C14.6643 5.25462 14.8403 5.45556 15.0722 5.77367L7.63768 13.2046C8.45602 13.7068 9.42588 13.9254 10.4244 13.8092C11.1878 13.7204 11.9195 13.4241 12.5284 12.9552C13.6247 12.1108 14.2389 10.8533 14.2389 9.50152H16.2752C16.2752 11.2041 15.6121 12.805 14.4082 14.009C13.2042 15.2128 11.6034 15.876 9.90077 15.876ZM9.90077 5.16546C8.78981 5.16546 7.67883 5.58824 6.83327 6.43404C5.38956 7.87751 5.17817 10.0938 6.19864 11.7639L12.1632 5.79939C11.4715 5.37661 10.686 5.16546 9.90077 5.16546Z"
          fill="#FFFFFF"
        />
      </svg>
    </Box>
  )
}

export default Loader
