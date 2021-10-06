import React, { useState } from 'react'
import './CommentApp.css'
import { useFormFields } from '../lib/hooksLib'
import Form from 'react-bootstrap/Form'
import LoaderButton from '../components/LoaderButton'
import { API } from 'aws-amplify'
import uuid from 'react-uuid'
import moment from 'moment'
import AddCommentIcon from '@mui/icons-material/AddComment'

export default function CommentInput(props) {
  const { handleNewComment, userInfo, filename } = props
  const [comment, setComment] = useState('')
  const [fields, handleFieldChange] = useFormFields({
    comment: '',
  })
  const [isLoading, setIsLoading] = useState(false)

  async function handleCommentSubmit(event) {
    event.preventDefault()

    setIsLoading(true)

    const CurrentDate = moment(new Date()).format('DD/MM/YYYY HH:mm:ss')
    console.log(CurrentDate)

    try {
      console.log(fields.comment)
      handleNewComment(fields.comment)
      setIsLoading(false)
      // insert new comment to DynamoDB
      const params = {
        headers: {},
        body: {
          id: uuid(),
          userid: userInfo.username,
          username: userInfo.attributes.email,
          usertype: 'Practitioner',
          comment: fields.comment,
          fileid: filename,
          timestamp: CurrentDate,
        },
      }
      const apiResponse = await API.post(
        'digitalToastmasterFrontendAPI',
        '/addComment',
        params
      )
      fields.comment = ''
    } catch (e) {
      console.log(e)
      setIsLoading(false)
    }
  }

  return (
    <div className="comment-input">
      <Form onSubmit={handleCommentSubmit}>
        <Form.Group controlId="comment" size="lg">
          <Form.Label>Content:</Form.Label>
          <Form.Control
            autoFocus
            type="tel"
            onChange={handleFieldChange}
            value={fields.comment}
          />
          <Form.Text muted>Please leave your comments.</Form.Text>
        </Form.Group>
        <LoaderButton
          className="comment-field-button"
          type="submit"
          variant="success"
          isLoading={isLoading}
        >
          <AddCommentIcon style={{ marginRight: '5px' }} />
          Comment
        </LoaderButton>
      </Form>
    </div>
  )
}
