import React, { useState, useEffect } from 'react'
import { Storage } from 'aws-amplify'
import { useHistory } from 'react-router-dom'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import Divider from '@mui/material/Divider'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import './VideoList.css'
import Button from '@mui/material/Button'
import ListItemButton from '@mui/material/ListItemButton'
import Grid from '@mui/material/Grid'
import LoaderButton from '../components/LoaderButton'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

export default function VideoList() {
  const history = useHistory()
  const [videoList, setVideoList] = useState([])

  useEffect(() => {
    getVideoListForUser()
  }, [])

  function getVideoListForUser() {
    Storage.list('', { level: 'public' })
      .then((result) => {
        console.log(result)
        setVideoList(result)
      })
      .catch((err) => console.log(err))
  }

  function handleVideoClick(video) {
    history.push('/videoResult?filename=' + video.key)
  }

  function handleBack() {
    history.push('/main')
  }

  return (
    <>
      <Grid>
        <LoaderButton className="comment-field-button" onClick={handleBack}>
          <ArrowBackIcon />
          Back
        </LoaderButton>{' '}
      </Grid>
      <List
        sx={{
          width: '100%',
          bgcolor: 'background.paper',
        }}
      >
        {videoList.map((video) => (
          <>
            <ListItem alignItems="flex-start">
              <ListItemButton onClick={() => handleVideoClick(video)}>
                <ListItemText
                  primary={video.key}
                  secondary={
                    <React.Fragment>
                      <Typography
                        sx={{ display: 'inline' }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        Size: {(video.size / 1024 / 1024).toFixed(1)} MB
                      </Typography>
                      <br />
                      Last Modified: {video.lastModified.toString()}
                    </React.Fragment>
                  }
                />
              </ListItemButton>
            </ListItem>
            <Divider variant="inset" component="li" />
          </>
        ))}
      </List>
    </>
  )
}
