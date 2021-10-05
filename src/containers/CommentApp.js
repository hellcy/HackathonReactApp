import React, { useState, useEffect } from 'react'
import CommentInput from './CommentInput'
import CommentList from './CommentList'
import './CommentApp.css'
import { Auth, API } from 'aws-amplify'
import moment from 'moment'

export default function CommentApp(props) {
  const { filename } = props
  const [comments, setComments] = useState([])
  const [currentUser, setCurrentUser] = useState(null)

  // fetch data from DynamoDB
  useEffect(() => {
    async function getCurrentUserInfo() {
      const userInfo = await Auth.currentAuthenticatedUser()
      setCurrentUser(userInfo)
      console.log(userInfo)
    }

    async function getCommentList() {
      const commentListResponse = await API.get(
        'digitalToastmasterFrontendAPI',
        '/addComment',
        {}
      )
        .then((response) => {
          console.log(response.data)

          setComments(
            response.data.filter(
              (comment) => comment.fileid.toString() === filename.toString()
            )
          )
        })
        .catch((error) => {
          console.log(error.response)
        })
    }

    getCurrentUserInfo()
    getCommentList()
    console.log(filename)
  }, [])

  function handleNewComment(newComment) {
    const newList = comments.slice()
    newList.push({
      username: currentUser.attributes.email,
      comment: newComment,
      usertype: 'Practitioner',
      timestamp: moment(new Date()).format('DD/MM/YYYY HH:mm:ss'),
    })
    setComments(newList)
  }

  return (
    <div className="wrapper">
      <CommentInput
        handleNewComment={handleNewComment}
        userInfo={currentUser}
        filename={filename}
      />
      <CommentList commentList={comments} />
    </div>
  )
}
