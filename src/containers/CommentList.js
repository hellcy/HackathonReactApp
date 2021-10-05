import React, { useState, useEffect } from 'react'
import Comment from './Comment'
import './CommentApp.css'

export default function CommentList(props) {
  const { commentList } = props

  return (
    <div>
      {commentList.map((comment, index) => (
        <Comment comment={comment} key={index} />
      ))}
    </div>
  )
}
