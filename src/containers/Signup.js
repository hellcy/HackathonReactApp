import React, { useState } from 'react'
import Form from 'react-bootstrap/Form'
import { useHistory } from 'react-router-dom'
import LoaderButton from '../components/LoaderButton'
import { useAppContext } from '../lib/contextLib'
import { useFormFields } from '../lib/hooksLib'
import { onError } from '../lib/errorLib'
import './Signup.css'
import { Auth } from 'aws-amplify'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { CardActionArea } from '@mui/material'
import practitionerIcon from './../images/practitioner-icon.png'
import assessorIcon from './../images/assessor-icon.png'

export default function Signup() {
  const [fields, handleFieldChange] = useFormFields({
    email: '',
    password: '',
    confirmPassword: '',
    confirmationCode: '',
  })
  const history = useHistory()
  const [newUser, setNewUser] = useState(null)
  const { userHasAuthenticated } = useAppContext()
  const [isLoading, setIsLoading] = useState(false)
  const [userType, setUserType] = useState(null)

  function validateForm() {
    return (
      fields.email.length > 0 &&
      fields.password.length > 0 &&
      fields.password === fields.confirmPassword
    )
  }

  function validateConfirmationForm() {
    return fields.confirmationCode.length > 0
  }

  async function handleSubmit(event) {
    event.preventDefault()

    setIsLoading(true)

    try {
      const newUser = await Auth.signUp({
        username: fields.email,
        password: fields.password,
        attributes: {
          email: fields.email,
          name: userType,
        },
      })
      setIsLoading(false)
      setNewUser(newUser)
    } catch (e) {
      onError(e)
      setIsLoading(false)
    }
  }

  async function handleConfirmationSubmit(event) {
    event.preventDefault()

    setIsLoading(true)

    try {
      await Auth.confirmSignUp(fields.email, fields.confirmationCode)
      await Auth.signIn(fields.email, fields.password)

      userHasAuthenticated(true)
      history.push('/main')
    } catch (e) {
      onError(e)
      setIsLoading(false)
    }
  }

  function handleUserTypeSelection(selectedValue) {
    setUserType(selectedValue)
  }

  function renderChooseUserType() {
    return (
      <>
        <div className="d-flex justify-content-center">
          <div className="p-2 col-example text-left">
            <Card sx={{ maxWidth: 275 }}>
              <CardActionArea
                onClick={() => handleUserTypeSelection('Practitioner')}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={practitionerIcon}
                  alt="practitioner"
                />
                <CardContent>
                  <Typography
                    sx={{ fontSize: 20 }}
                    color="text.secondary"
                    gutterBottom
                  >
                    Practitioner
                  </Typography>
                  <Typography variant="body2">Some description</Typography>
                </CardContent>
              </CardActionArea>
              <CardActions>
                <Button
                  size="small"
                  onClick={() => handleUserTypeSelection('Practitioner')}
                >
                  Select
                </Button>
              </CardActions>
            </Card>
          </div>
          <div className="p-2 col-example text-left">
            <Card sx={{ maxWidth: 275 }}>
              <CardActionArea
                onClick={() => handleUserTypeSelection('Assessor')}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={assessorIcon}
                  alt="practitioner"
                />
                <CardContent>
                  <Typography
                    sx={{ fontSize: 20 }}
                    color="text.secondary"
                    gutterBottom
                  >
                    Assessor
                  </Typography>
                  <Typography variant="body2">Some description</Typography>
                </CardContent>
              </CardActionArea>
              <CardActions>
                <Button
                  size="small"
                  onClick={() => handleUserTypeSelection('Assessor')}
                >
                  Select
                </Button>
              </CardActions>
            </Card>
          </div>
        </div>
      </>
    )
  }

  function renderConfirmationForm() {
    return (
      <Form onSubmit={handleConfirmationSubmit}>
        <Form.Group controlId="confirmationCode" size="lg">
          <Form.Label>Confirmation Code</Form.Label>
          <Form.Control
            autoFocus
            type="tel"
            onChange={handleFieldChange}
            value={fields.confirmationCode}
          />
          <Form.Text muted>Please check your email for the code.</Form.Text>
        </Form.Group>
        <LoaderButton
          block
          size="lg"
          type="submit"
          variant="success"
          isLoading={isLoading}
          disabled={!validateConfirmationForm()}
        >
          Verify
        </LoaderButton>
      </Form>
    )
  }

  function renderForm() {
    return (
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="email" size="lg">
          <Form.Label>Email</Form.Label>
          <Form.Control
            autoFocus
            type="email"
            value={fields.email}
            onChange={handleFieldChange}
          />
        </Form.Group>
        <Form.Group controlId="password" size="lg">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={fields.password}
            onChange={handleFieldChange}
          />
        </Form.Group>
        <Form.Group controlId="confirmPassword" size="lg">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            onChange={handleFieldChange}
            value={fields.confirmPassword}
          />
        </Form.Group>
        <LoaderButton
          block
          size="lg"
          type="submit"
          variant="success"
          isLoading={isLoading}
          disabled={!validateForm()}
        >
          Signup
        </LoaderButton>
      </Form>
    )
  }

  return (
    <div className="Signup">
      {userType === null
        ? renderChooseUserType()
        : newUser === null
        ? renderForm()
        : renderConfirmationForm()}
    </div>
  )
}
