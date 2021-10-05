import React, { useState, useEffect } from 'react'
import './Main.css'
import { Storage } from 'aws-amplify'
import { BsPencilSquare } from 'react-icons/bs'
import { LinkContainer } from 'react-router-bootstrap'
import ListGroup from 'react-bootstrap/ListGroup'
import LoaderButton from '../components/LoaderButton'
import Grid from '@mui/material/Grid'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import { CardActionArea } from '@mui/material'
import practitionerIcon from './../images/practitioner-icon.png'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import { makeStyles } from '@mui/styles'
import Chart from 'react-apexcharts'
import { styled } from '@mui/material/styles'
import PhotoCamera from '@mui/icons-material/PhotoCamera'
import LinearProgress from '@mui/material/LinearProgress'
import CircularProgress from '@mui/material/CircularProgress'
import { useHistory } from 'react-router-dom'
import moment from 'moment'

export default function Main() {
  const history = useHistory()
  const [files, setFiles] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const useStyles = makeStyles((theme) => ({
    card: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginBottom: '20px',
      marginLeft: '30px',
      width: '300px',
      height: '240px',
    },
    content: {
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    chartWrapper: {
      width: '95%',
      height: '100%',
      overflow: 'hidden',
    },
  }))

  const Input = styled('input')({
    display: 'none',
  })

  const classes = useStyles()

  const [chartState, setChartState] = useState({
    series: [
      {
        name: 'Score',
        data: [50, 60, 90, 80, 70, 85],
      },
    ],
    options: {
      chart: {
        toolbar: {
          show: false,
        },
        type: 'bar',
        height: 430,
      },
      plotOptions: {
        bar: {
          horizontal: false,
          dataLabels: {
            position: 'top',
          },
        },
      },
      dataLabels: {
        enabled: true,
        offsetX: -6,
        style: {
          fontSize: '12px',
          colors: ['#000000'],
        },
        formatter(val) {
          return val.toFixed(1)
        },
      },
      stroke: {
        show: true,
        width: 3,
        colors: ['#0394fc'],
      },
      tooltip: {
        shared: true,
        intersect: false,
      },
      xaxis: {
        categories: [1, 2, 3, 4, 5, 6],
      },
      yaxis: {
        labels: {
          formatter(val) {
            return val.toFixed(1)
          },
        },
      },
      colors: ['#0394fc'],
    },
  })

  const [charttestState, setCharttestState] = useState({
    series: [
      {
        name: 'Bob',
        data: [
          {
            x: 'Design',
            y: [
              new Date('2019-03-05').getTime(),
              new Date('2019-03-08').getTime(),
            ],
          },
          {
            x: 'Code',
            y: [
              new Date('2019-03-08').getTime(),
              new Date('2019-03-11').getTime(),
            ],
          },
          {
            x: 'Test',
            y: [
              new Date('2019-03-11').getTime(),
              new Date('2019-03-16').getTime(),
            ],
          },
        ],
      },
      {
        name: 'Joe',
        data: [
          {
            x: 'Design',
            y: [
              new Date('2019-03-02').getTime(),
              new Date('2019-03-05').getTime(),
            ],
          },
          {
            x: 'Code',
            y: [
              new Date('2019-03-06').getTime(),
              new Date('2019-03-09').getTime(),
            ],
          },
          {
            x: 'Test',
            y: [
              new Date('2019-03-10').getTime(),
              new Date('2019-03-19').getTime(),
            ],
          },
        ],
      },
    ],
    options: {
      chart: {
        height: 350,
        type: 'rangeBar',
      },
      plotOptions: {
        bar: {
          horizontal: true,
        },
      },
      dataLabels: {
        enabled: true,
        formatter: function (val) {
          var a = moment(val[0])
          var b = moment(val[1])
          var diff = b.diff(a, 'days')
          return diff + (diff > 1 ? ' days' : ' day')
        },
      },
      fill: {
        type: 'gradient',
        gradient: {
          shade: 'light',
          type: 'vertical',
          shadeIntensity: 0.25,
          gradientToColors: undefined,
          inverseColors: true,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [50, 0, 100, 100],
        },
      },
      xaxis: {
        type: 'datetime',
      },
      legend: {
        position: 'top',
      },
    },
  })

  const [file, setFile] = useState(null)
  const [name, setName] = useState('')
  const [response, setResponse] = useState('')
  const [isUploading, setIsUploading] = useState(false)

  const [progress, setProgress] = React.useState(0)

  async function listS3Buckets() {
    setIsLoading(true)

    try {
      const returnedFiles = await Storage.list('')
      console.log(returnedFiles)
      setFiles(returnedFiles)
      setIsLoading(false)
    } catch (e) {
      setIsLoading(false)
    }
  }

  function onChange(e) {
    console.log(e)
    if (e.target.files[0] !== null) {
      setFile(e.target.files[0])
      setName(e.target.files[0].name)
    }
  }

  function onSubmit() {
    if (file) {
      setIsUploading(true)
      Storage.vault
        .put(name, file, {
          contentType: file.type,
          progressCallback(progress) {
            const uploadPercentage = (progress.loaded / progress.total) * 100
            console.log('Uploaded: ' + uploadPercentage)
            setProgress(uploadPercentage)
          },
        })
        .then((result) => {
          console.log(result)
          setResponse('File uploaded!')
          setIsUploading(false)
        })
        .then(() => {
          document.getElementById('contained-button-file').value = null
          setFile(null)
        })
        .catch((err) => {
          console.log(err)
          setResponse('Cannot upload file: ' + err)
        })
    }
  }

  function LinearProgressWithLabel(props) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ width: '100%', mr: 1 }}>
          <LinearProgress variant="determinate" {...props} />
        </Box>
        <Box sx={{ minWidth: 35 }}>
          <Typography variant="body2" color="text.secondary">{`${Math.round(
            props.value
          )}%`}</Typography>
        </Box>
      </Box>
    )
  }

  function handleViewProfile() {
    history.push('/videoList')
  }

  return (
    <div className="Main" style={{ backgroundColor: '#c9c9c9' }}>
      <div className="lander">
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Card sx={{ maxWidth: 400 }} className={classes.card}>
              <Avatar alt="user avatar" src={practitionerIcon} />
              <CardContent>
                <Typography
                  sx={{ fontSize: 20 }}
                  color="text.secondary"
                  gutterBottom
                >
                  David Kang
                </Typography>
                <Typography variant="body2">Some description</Typography>
              </CardContent>
              <CardActions>
                <Button size="small">Share</Button>
                <Button size="small" onClick={() => handleViewProfile()}>
                  View Profile
                </Button>
              </CardActions>
            </Card>
            <Card sx={{ maxWidth: 400 }} className={classes.card}>
              <CardContent>
                <Typography
                  sx={{ fontSize: 20 }}
                  color="text.secondary"
                  gutterBottom
                >
                  Records and Assesses
                </Typography>
                <Typography variant="body2">Some description</Typography>
              </CardContent>
              <CardActions>
                <label htmlFor="contained-button-file">
                  <Input
                    accept="video/*, audio/*"
                    id="contained-button-file"
                    multiple
                    type="file"
                    onChange={(e) => onChange(e)}
                  />
                  <Button
                    variant="contained"
                    component="span"
                    startIcon={<PhotoCamera />}
                  >
                    Select New Video
                  </Button>
                </label>
              </CardActions>
              <>{file === null ? '' : name}</>
              <CardActions>
                <Button
                  type="submit"
                  variant="contained"
                  component="span"
                  disabled={isUploading}
                  onClick={() => onSubmit()}
                >
                  Upload
                </Button>
                {isUploading && (
                  <CircularProgress
                    size={24}
                    sx={{
                      color: '#279621',
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      marginTop: '-12px',
                      marginLeft: '-12px',
                    }}
                  />
                )}
              </CardActions>
              <Box sx={{ width: '100%' }}>
                {file === null ? (
                  response
                ) : (
                  <LinearProgressWithLabel value={progress} />
                )}
              </Box>
            </Card>
            <Card sx={{ maxWidth: 400 }} className={classes.card}>
              <CardContent>
                <Typography
                  sx={{ fontSize: 20 }}
                  color="text.secondary"
                  gutterBottom
                >
                  Review Elevator Pitch
                </Typography>
                <Typography variant="body2">Some description</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={7}>
            <Card>
              <CardContent>
                <div className={classes.content}>
                  <div className={classes.chartWrapper}>
                    <Chart
                      options={chartState.options}
                      series={chartState.series}
                      type="bar"
                      width="500"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <div className={classes.content}>
                  <div className={classes.chartWrapper}>
                    {/* <Chart
                      options={chartState.options}
                      series={chartState.series}
                      type="line"
                      width="500"
                    /> */}
                    <Chart
                      options={charttestState.options}
                      series={charttestState.series}
                      type="rangeBar"
                      width="500"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>
    </div>
  )
}
