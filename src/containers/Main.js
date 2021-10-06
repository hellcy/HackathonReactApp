import React, { useState, useEffect } from 'react'
import './Main.css'
import { Storage, API } from 'aws-amplify'
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
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'

export default function Main() {
  const history = useHistory()
  const [files, setFiles] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [grammarList, setGrammarList] = useState([])
  const [fillerWordsList, setFillerWordsList] = useState([])
  const useStyles = makeStyles((theme) => ({
    card: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginBottom: '20px',
      marginLeft: '30px',
      width: '300px',
      height: '260px',
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

  useEffect(() => {
    async function getGrammar() {
      const grammarResponse = await API.get(
        'digitalToastmasterFrontendAPI',
        '/getGrammar',
        {
          queryStringParameters: {
            fileid: 'processed-transcripts/MLK.HourOfPower.json.txt',
          },
        }
      )
        .then((response) => {
          setGrammarList(response.Item.corrections)
          setFillerWordsList(response.Item['filler-words'])
        })
        .catch((error) => {
          console.log(error.response)
        })
    }

    getGrammar()
  }, [])

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
    <div className="Main" style={{ backgroundColor: '#dbdbdb' }}>
      <div className="lander">
        <Grid container spacing={2}>
          <Grid item xs={4}>
            <Card sx={{ maxWidth: 400 }} className={classes.card}>
              <Avatar
                alt="user avatar"
                src={practitionerIcon}
                sx={{ width: 100, height: 100 }}
              />
              <CardContent>
                <Typography
                  sx={{ fontSize: 20 }}
                  color="text.secondary"
                  gutterBottom
                >
                  Yuan Cheng
                </Typography>
                <Typography variant="body2">Practitioner</Typography>
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
                <Typography variant="body2">
                  You can upload new Audio or Video files here
                </Typography>
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
                  <CloudUploadIcon style={{ marginRight: '10px' }} /> Upload
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
                  Filler words detected
                </Typography>
                <Typography variant="body2">
                  {fillerWordsList.length === 0
                    ? `You don't have any filler words, congratulations!`
                    : 'test'}
                </Typography>
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
                    {grammarList && (
                      <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 500 }} aria-label="simple table">
                          <TableHead>
                            <TableRow>
                              <TableCell style={{ fontWeight: 'bold' }}>
                                Timestamp
                              </TableCell>
                              <TableCell
                                align="right"
                                style={{ fontWeight: 'bold' }}
                              >
                                Definition
                              </TableCell>
                              <TableCell
                                align="right"
                                style={{ fontWeight: 'bold' }}
                              >
                                Correct
                              </TableCell>
                              <TableCell
                                align="right"
                                style={{ fontWeight: 'bold' }}
                              >
                                Text
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {grammarList.map((grammar) => (
                              <TableRow
                                key={grammar.setCharttestState}
                                sx={{
                                  '&:last-child td, &:last-child th': {
                                    border: 0,
                                  },
                                }}
                              >
                                <TableCell component="th" scope="row">
                                  {grammar.start}
                                </TableCell>
                                <TableCell align="right">
                                  {grammar.definition}
                                </TableCell>
                                <TableCell align="right">
                                  {grammar.correct}
                                </TableCell>
                                <TableCell align="right">
                                  {grammar.text}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    )}
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
