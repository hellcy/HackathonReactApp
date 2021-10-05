import React from 'react'
import './CommentApp.css'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

export default function Comment(props) {
  const { comment } = props

  return (
    <Card sx={{ maxWidth: '100%' }}>
      <CardContent>
        <Typography
          sx={{ fontSize: 14 }}
          style={{ color: '#00a3cf' }}
          component="div"
        >
          {comment.username} ({comment.usertype}):
        </Typography>
        <div style={{ display: 'flex' }}>
          <Typography
            style={{ marginLeft: '10px', marginTop: '10px' }}
            variant="title"
            color="inherit"
            noWrap
          >
            {comment.comment}
          </Typography>
        </div>
        <div style={{ display: 'flex', flexDirection: 'row-reverse' }}>
          <Typography variant="subheading" color="inherit" noWrap>
            {comment.timestamp}
          </Typography>
        </div>
      </CardContent>
    </Card>
  )
}
