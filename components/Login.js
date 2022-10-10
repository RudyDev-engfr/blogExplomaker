import { useEffect, useState } from 'react'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'

import { signInWithEmailAndPassword } from '../lib/firebase'

const Login = ({ isOpen, setOpenModal, children }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState()

  useEffect(() => {
    if (!isOpen) {
      setEmail('')
      setPassword('')
    }
  }, [isOpen])

  const onSubmit = async event => {
    event.preventDefault()
    signInWithEmailAndPassword(email, password)
      .then(() => setOpenModal(''))
      .catch(currentError => {
        if (
          currentError.code === 'auth/wrong-password' ||
          currentError.code === 'auth/invalid-email' ||
          currentError.code === 'auth/user-not-found'
        ) {
          setError('Combinaison login/mot de passe incorrecte')
        } else if (currentError.code === 'auth/user-disabled') {
          setError("L'utilisateur a été désactivé")
        }
      })
  }

  return (
    <form onSubmit={onSubmit}>
      <TextField
        id="email"
        type="email"
        label="Email"
        variant="filled"
        value={email}
        onChange={event => setEmail(event.target.value)}
        fullWidth
      />
      <TextField
        id="password"
        type={showPassword ? 'text' : 'password'}
        label="Mot de passe"
        variant="filled"
        value={password}
        onChange={event => setPassword(event.target.value)}
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={() => setShowPassword(!showPassword)}
                onMouseDown={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          ),
        }}
        error={!!error}
        helperText={error}
      />
      <Box display="flex" flexDirection="column" alignItems="flex-start">
        <Box my={2} width="100%">
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={!(email !== '' && password.length > 5)}
          >
            Se connecter
          </Button>
        </Box>
        <Button onClick={() => setOpenModal('pwdReset')}>Mot de passe oublié ?</Button>
      </Box>
      {children}
    </form>
  )
}

export default Login
