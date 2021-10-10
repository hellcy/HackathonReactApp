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
  const [gazeList, setGazeList] = useState([])
  const [gazeTimeList, setGazeTimeList] = useState([])
  const [gazeChartState, setGazeChartState] = useState(null)
  const [speechAnalysis, setSpeechAnalysis] = useState(null)
  const [speechAnalysisIntensityChart, setSpeechAnalysisIntensityChart] =
    useState(null)
  const [sentimentData, setSentimentData] = useState(null)
  const [sentimentChartState, setSentimentChartState] = useState(null)
  const [transcribeData, setTranscribeData] = useState(null)
  const [transcribeText, setTranscribeText] = useState(null)
  const [transcribeChartState, setTranscribeChartState] = useState(null)

  const [speechAnalysisHasResponse, setSpeechAnalysisHasResponse] =
    useState(false)
  const [grammarHasResponse, setGrammarHasResponse] = useState(false)
  const [gazeHasResponse, setGazeHasResponse] = useState(false)
  const [sentimentHasResponse, setSentimentHasResponse] = useState(false)
  const [transcribeHasResponse, setTranscribeHasResponse] = useState(false)

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
    TranscribeCard: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginBottom: '20px',
      marginLeft: '30px',
      width: '300px',
      height: '460px',
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
            fileid: 'demo-2',
          },
        }
      )
        .then((response) => {
          console.log('grammar')
          setGrammarHasResponse(true)
          if (response.Item !== null) {
            console.log(response.Item.corrections[0].correct)
            setGrammarList(response.Item.corrections)
            const fillerList = []
            Object.keys(response.Item['filler-words']).map((key) => {
              fillerList.push(key)
            })
            setFillerWordsList(fillerList)
          } else {
          }
        })
        .catch((error) => {
          console.log(error)
        })
    }

    async function getGaze() {
      const grammarResponse = await API.get(
        'digitalToastmasterFrontendAPI',
        '/getGaze',
        {
          queryStringParameters: {
            fileid: 'demo',
          },
        }
      )
        .then((response) => {
          console.log('Gaze')
          setGazeHasResponse(true)

          if (response.Item === null) {
          } else {
            setGazeList(response.Item.gaze_list)
            setGazeTimeList(response.Item.time)

            const chartData = []
            const fillColors = {
              'EYE CONTACT': '#0394fc',
              'NO EYE CONTACT': '#f54242',
              'NO EYES IN FRAME': '#0fb800',
            }
            var lastTimestamp = 0
            response.Item.gaze_list.map((gazeValue, index) => {
              if (true || index % 10 === 0) {
                const currentData = {
                  x: gazeValue,
                  y: [lastTimestamp, response.Item.time[index]],
                  fillColor: fillColors[gazeValue],
                }
                lastTimestamp = response.Item.time[index]
                chartData.push(currentData)
              }
            })

            setGazeChartState({
              series: [
                {
                  name: 'Yuan',
                  data: chartData,
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
                  formatter: function (val) {
                    return val
                  },
                },
                tooltip: {
                  enabled: false,
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
                  tickPlacement: 'on',
                },
                legend: {
                  position: 'top',
                },
                chart: {
                  zoom: {
                    enabled: true,
                  },
                },
                title: {
                  text: 'Eye Contect Metric',
                  align: 'center',
                },
              },
            })
          }
        })
        .catch((error) => {
          console.log(error)
        })
    }

    async function getSpeechAnalysis() {
      const analysisResponse = await API.get(
        'digitalToastmasterFrontendAPI',
        '/getSpeechAnalysis',
        {
          queryStringParameters: {
            fileid: 'demo-2',
          },
        }
      )
        .then((response) => {
          console.log('SpeechAnalysis')
          setSpeechAnalysisHasResponse(true)
          if (response.Item === null) {
          } else {
            setSpeechAnalysis(response.Item)
            const intensityValue = []
            const intensityTimestamp = []
            const pitchValue = []
            const pitchTimestamp = []
            const minLength = Math.min(
              response.Item.intensity_timeseries.length,
              response.Item.pitch_timeseries.length
            )
            console.log(minLength)
            response.Item.intensity_timeseries.forEach((array, index) => {
              if (index % 100 === 0 && index < minLength) {
                intensityValue.push(array[1])
                intensityTimestamp.push(array[0])
              }
            })
            response.Item.pitch_timeseries.forEach((array, index) => {
              if (index % 100 === 0 && index < minLength) {
                pitchValue.push(array[1])
                pitchTimestamp.push(array[0])
              }
            })
            setSpeechAnalysisIntensityChart({
              series: [
                {
                  name: 'Intensity',
                  data: intensityValue,
                },
                {
                  name: 'Pitch',
                  data: pitchValue,
                },
              ],
              chart: {
                group: 'speechAnalysis',
                type: 'line',
                stacked: false,
              },
              options: {
                chart: {
                  toolbar: {
                    show: false,
                  },
                  type: 'line',
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
                  width: 2,
                  colors: ['#0394fc', '#f54242'],
                },
                tooltip: {
                  shared: true,
                  intersect: false,
                },
                xaxis: {
                  categories: intensityTimestamp,
                  tickPlacement: 'on',
                  tickAmount: 10,
                  title: {
                    text: 'Seconds',
                  },
                },
                yaxis: [
                  {
                    axisTicks: {
                      show: true,
                    },
                    axisBorder: {
                      show: true,
                      color: '#0394fc',
                    },
                    labels: {
                      style: {
                        colors: '#0394fc',
                      },
                    },
                    title: {
                      text: 'Intensity',
                      style: {
                        color: '#0394fc',
                      },
                    },
                  },
                  {
                    opposite: true,
                    axisTicks: {
                      show: true,
                    },
                    axisBorder: {
                      show: true,
                      color: '#f54242',
                    },
                    labels: {
                      style: {
                        colors: '#f54242',
                      },
                    },
                    title: {
                      text: 'Pitch',
                      style: {
                        color: '#f54242',
                      },
                    },
                  },
                ],
                colors: ['#0394fc', '#f54242'],
                legend: {
                  position: 'bottom',
                  horizontalAlign: 'center',
                  floating: true,
                  offsetY: -25,
                  offsetX: -5,
                },
                title: {
                  text: 'Intensity and Pitch Metric',
                  align: 'center',
                },
              },
            })
          }
        })
        .catch((error) => {
          console.log(error.response)
        })
    }

    async function getSentimentData() {
      const sentimentResponse = await API.get(
        'digitalToastmasterFrontendAPI',
        '/getSentiment',
        {
          queryStringParameters: {
            fileid: 'demo-2',
          },
        }
      )
        .then((response) => {
          console.log('sentiment')
          setSentimentHasResponse(true)
          if (response.Item === null) {
          } else {
            const sentimentScoreList = []
            const sentimentNameList = [
              'Mixed',
              'Negative',
              'Neutral',
              'Positive',
            ]
            sentimentScoreList.push(response.Item.SentimentScore['Mixed'])
            sentimentScoreList.push(response.Item.SentimentScore['Negative'])
            sentimentScoreList.push(response.Item.SentimentScore['Neutral'])
            sentimentScoreList.push(response.Item.SentimentScore['Positive'])

            const sentiment = response.Item.Sentiment

            setSentimentChartState({
              series: [
                {
                  name: 'Sentiment',
                  data: sentimentScoreList,
                },
              ],
              options: {
                chart: {
                  height: 350,
                  type: 'bar',
                },
                plotOptions: {
                  bar: {
                    borderRadius: 10,
                    dataLabels: {
                      position: 'top', // top, center, bottom
                    },
                  },
                },
                dataLabels: {
                  enabled: true,
                  formatter: function (val) {
                    return (val * 100).toFixed(3) + '%'
                  },
                  offsetY: -20,
                  style: {
                    fontSize: '12px',
                    colors: ['#304758'],
                  },
                },

                xaxis: {
                  categories: sentimentNameList,
                  position: 'bottom',
                  axisBorder: {
                    show: false,
                  },
                  axisTicks: {
                    show: false,
                  },
                  crosshairs: {
                    fill: {
                      type: 'gradient',
                      gradient: {
                        colorFrom: '#D8E3F0',
                        colorTo: '#BED1E6',
                        stops: [0, 100],
                        opacityFrom: 0.4,
                        opacityTo: 0.5,
                      },
                    },
                  },
                  tooltip: {
                    enabled: true,
                  },
                },
                yaxis: {
                  axisBorder: {
                    show: false,
                  },
                  axisTicks: {
                    show: false,
                  },
                  labels: {
                    show: false,
                    formatter: function (val) {
                      return (val * 100).toFixed(3) + '%'
                    },
                  },
                },
                title: {
                  text: 'Sentiment Metric',
                  floating: true,
                  offsetY: 0,
                  align: 'center',
                  style: {
                    color: '#444',
                  },
                },
              },
            })
          }
        })
        .catch((error) => {
          console.log(error.response)
        })
    }

    async function getTranscribeData() {
      const transcribeResponse = await API.get(
        'digitalToastmasterFrontendAPI',
        '/getTranscribe',
        {
          queryStringParameters: {
            fileid: 'demo-2',
          },
        }
      )
        .then((response) => {
          console.log('transcribe')
          console.log(response.Item)
          setTranscribeHasResponse(true)

          var test = []

          const obj1 = {
            name: 'word1',
            data: [
              {
                x: 'words',
                y: [0, 1],
              },
            ],
          }
          const obj2 = {
            name: 'word2',
            data: [
              {
                x: 'words',
                y: [2, 3],
              },
            ],
          }

          test.push(obj1)
          test.push(obj2)
          const dataList = []

          const response2 = {
            Item: {
              'file-id': 'demo-2',
              file_data: {
                jobName: 'PowerPuff-Filler_Words',
                accountId: '571747411449',
                results: {
                  transcripts: [
                    {
                      transcript:
                        "okay? So long ago. That was a scientist called Professor you, Tony. Um and he undertook this experiment to create the perfect little girls for which he used, uh, Sugar, Spice and everything. Nice. But, professor, you Tony, um, accidentally added an extra ingredient to the concoction Chemical X, and thus the Powerpuff Girls were born. Um, you're using their awesome and super powers bubbles, blossom and buttercup fight crime and the forces of evil. Um, that the thing, that's it.",
                    },
                  ],
                  items: [
                    {
                      end_time: '1.68',
                      start_time: '1.14',
                      alternatives: [{ content: 'okay', confidence: '0.903' }],
                      type: 'pronunciation',
                    },
                    {
                      type: 'punctuation',
                      alternatives: [{ content: '?', confidence: '0.0' }],
                    },
                    {
                      end_time: '2.46',
                      start_time: '1.69',
                      alternatives: [{ content: 'So', confidence: '1.0' }],
                      type: 'pronunciation',
                    },
                    {
                      end_time: '3.99',
                      start_time: '3.54',
                      alternatives: [{ content: 'long', confidence: '1.0' }],
                      type: 'pronunciation',
                    },
                    {
                      end_time: '4.44',
                      start_time: '3.99',
                      alternatives: [{ content: 'ago', confidence: '1.0' }],
                      type: 'pronunciation',
                    },
                    {
                      type: 'punctuation',
                      alternatives: [{ content: '.', confidence: '0.0' }],
                    },
                    {
                      end_time: '4.63',
                      start_time: '4.45',
                      alternatives: [{ content: 'That', confidence: '0.8356' }],
                      type: 'pronunciation',
                    },
                    {
                      end_time: '5.06',
                      start_time: '4.63',
                      alternatives: [{ content: 'was', confidence: '1.0' }],
                      type: 'pronunciation',
                    },
                    {
                      end_time: '5.16',
                      start_time: '5.07',
                      alternatives: [{ content: 'a', confidence: '0.5315' }],
                      type: 'pronunciation',
                    },
                    {
                      end_time: '5.66',
                      start_time: '5.17',
                      alternatives: [
                        { content: 'scientist', confidence: '0.8504' },
                      ],
                      type: 'pronunciation',
                    },
                    {
                      end_time: '5.82',
                      start_time: '5.66',
                      alternatives: [
                        { content: 'called', confidence: '0.9744' },
                      ],
                      type: 'pronunciation',
                    },
                    {
                      end_time: '6.21',
                      start_time: '5.82',
                      alternatives: [
                        { content: 'Professor', confidence: '0.9991' },
                      ],
                      type: 'pronunciation',
                    },
                    {
                      end_time: '6.34',
                      start_time: '6.21',
                      alternatives: [{ content: 'you', confidence: '0.8945' }],
                      type: 'pronunciation',
                    },
                    {
                      type: 'punctuation',
                      alternatives: [{ content: ',', confidence: '0.0' }],
                    },
                    {
                      end_time: '6.61',
                      start_time: '6.34',
                      alternatives: [{ content: 'Tony', confidence: '0.9032' }],
                      type: 'pronunciation',
                    },
                    {
                      type: 'punctuation',
                      alternatives: [{ content: '.', confidence: '0.0' }],
                    },
                    {
                      end_time: '6.9',
                      start_time: '6.61',
                      alternatives: [{ content: 'Um', confidence: '0.9906' }],
                      type: 'pronunciation',
                    },
                    {
                      end_time: '7.1',
                      start_time: '6.91',
                      alternatives: [{ content: 'and', confidence: '1.0' }],
                      type: 'pronunciation',
                    },
                    {
                      end_time: '7.51',
                      start_time: '7.1',
                      alternatives: [{ content: 'he', confidence: '1.0' }],
                      type: 'pronunciation',
                    },
                    {
                      end_time: '8.18',
                      start_time: '7.52',
                      alternatives: [
                        { content: 'undertook', confidence: '0.9982' },
                      ],
                      type: 'pronunciation',
                    },
                    {
                      end_time: '8.32',
                      start_time: '8.18',
                      alternatives: [{ content: 'this', confidence: '0.998' }],
                      type: 'pronunciation',
                    },
                    {
                      end_time: '9.02',
                      start_time: '8.32',
                      alternatives: [
                        { content: 'experiment', confidence: '1.0' },
                      ],
                      type: 'pronunciation',
                    },
                    {
                      end_time: '9.15',
                      start_time: '9.03',
                      alternatives: [{ content: 'to', confidence: '1.0' }],
                      type: 'pronunciation',
                    },
                    {
                      end_time: '9.89',
                      start_time: '9.15',
                      alternatives: [{ content: 'create', confidence: '1.0' }],
                      type: 'pronunciation',
                    },
                    {
                      end_time: '10.1',
                      start_time: '9.9',
                      alternatives: [{ content: 'the', confidence: '1.0' }],
                      type: 'pronunciation',
                    },
                    {
                      end_time: '10.49',
                      start_time: '10.1',
                      alternatives: [
                        { content: 'perfect', confidence: '0.9983' },
                      ],
                      type: 'pronunciation',
                    },
                    {
                      end_time: '10.71',
                      start_time: '10.49',
                      alternatives: [{ content: 'little', confidence: '1.0' }],
                      type: 'pronunciation',
                    },
                    {
                      end_time: '11.33',
                      start_time: '10.71',
                      alternatives: [
                        { content: 'girls', confidence: '0.9507' },
                      ],
                      type: 'pronunciation',
                    },
                    {
                      end_time: '11.52',
                      start_time: '11.34',
                      alternatives: [{ content: 'for', confidence: '0.9958' }],
                      type: 'pronunciation',
                    },
                    {
                      end_time: '11.72',
                      start_time: '11.52',
                      alternatives: [{ content: 'which', confidence: '1.0' }],
                      type: 'pronunciation',
                    },
                    {
                      end_time: '11.85',
                      start_time: '11.72',
                      alternatives: [{ content: 'he', confidence: '1.0' }],
                      type: 'pronunciation',
                    },
                    {
                      end_time: '12.53',
                      start_time: '11.85',
                      alternatives: [{ content: 'used', confidence: '1.0' }],
                      type: 'pronunciation',
                    },
                    {
                      type: 'punctuation',
                      alternatives: [{ content: ',', confidence: '0.0' }],
                    },
                    {
                      end_time: '13.05',
                      start_time: '12.54',
                      alternatives: [{ content: 'uh', confidence: '0.9386' }],
                      type: 'pronunciation',
                    },
                    {
                      type: 'punctuation',
                      alternatives: [{ content: ',', confidence: '0.0' }],
                    },
                    {
                      end_time: '15.01',
                      start_time: '14.14',
                      alternatives: [{ content: 'Sugar', confidence: '1.0' }],
                      type: 'pronunciation',
                    },
                    {
                      type: 'punctuation',
                      alternatives: [{ content: ',', confidence: '0.0' }],
                    },
                    {
                      end_time: '16.36',
                      start_time: '15.23',
                      alternatives: [{ content: 'Spice', confidence: '1.0' }],
                      type: 'pronunciation',
                    },
                    {
                      end_time: '17.77',
                      start_time: '16.49',
                      alternatives: [{ content: 'and', confidence: '1.0' }],
                      type: 'pronunciation',
                    },
                    {
                      end_time: '18.34',
                      start_time: '17.78',
                      alternatives: [
                        { content: 'everything', confidence: '1.0' },
                      ],
                      type: 'pronunciation',
                    },
                    {
                      type: 'punctuation',
                      alternatives: [{ content: '.', confidence: '0.0' }],
                    },
                    {
                      end_time: '18.85',
                      start_time: '18.34',
                      alternatives: [{ content: 'Nice', confidence: '1.0' }],
                      type: 'pronunciation',
                    },
                    {
                      type: 'punctuation',
                      alternatives: [{ content: '.', confidence: '0.0' }],
                    },
                    {
                      end_time: '20.03',
                      start_time: '19.44',
                      alternatives: [{ content: 'But', confidence: '1.0' }],
                      type: 'pronunciation',
                    },
                    {
                      type: 'punctuation',
                      alternatives: [{ content: ',', confidence: '0.0' }],
                    },
                    {
                      end_time: '20.47',
                      start_time: '20.04',
                      alternatives: [
                        { content: 'professor', confidence: '1.0' },
                      ],
                      type: 'pronunciation',
                    },
                    {
                      type: 'punctuation',
                      alternatives: [{ content: ',', confidence: '0.0' }],
                    },
                    {
                      end_time: '20.59',
                      start_time: '20.47',
                      alternatives: [{ content: 'you', confidence: '0.9626' }],
                      type: 'pronunciation',
                    },
                    {
                      end_time: '20.84',
                      start_time: '20.59',
                      alternatives: [{ content: 'Tony', confidence: '0.9048' }],
                      type: 'pronunciation',
                    },
                    {
                      type: 'punctuation',
                      alternatives: [{ content: ',', confidence: '0.0' }],
                    },
                    {
                      end_time: '20.96',
                      start_time: '20.84',
                      alternatives: [{ content: 'um', confidence: '0.9896' }],
                      type: 'pronunciation',
                    },
                    {
                      type: 'punctuation',
                      alternatives: [{ content: ',', confidence: '0.0' }],
                    },
                    {
                      end_time: '21.74',
                      start_time: '20.97',
                      alternatives: [
                        { content: 'accidentally', confidence: '0.9898' },
                      ],
                      type: 'pronunciation',
                    },
                    {
                      end_time: '22.19',
                      start_time: '21.74',
                      alternatives: [{ content: 'added', confidence: '1.0' }],
                      type: 'pronunciation',
                    },
                    {
                      end_time: '22.74',
                      start_time: '22.34',
                      alternatives: [{ content: 'an', confidence: '1.0' }],
                      type: 'pronunciation',
                    },
                    {
                      end_time: '23.12',
                      start_time: '22.74',
                      alternatives: [{ content: 'extra', confidence: '1.0' }],
                      type: 'pronunciation',
                    },
                    {
                      end_time: '23.52',
                      start_time: '23.12',
                      alternatives: [
                        { content: 'ingredient', confidence: '1.0' },
                      ],
                      type: 'pronunciation',
                    },
                    {
                      end_time: '23.6',
                      start_time: '23.52',
                      alternatives: [{ content: 'to', confidence: '0.9826' }],
                      type: 'pronunciation',
                    },
                    {
                      end_time: '23.73',
                      start_time: '23.6',
                      alternatives: [{ content: 'the', confidence: '1.0' }],
                      type: 'pronunciation',
                    },
                    {
                      end_time: '24.56',
                      start_time: '23.73',
                      alternatives: [
                        { content: 'concoction', confidence: '1.0' },
                      ],
                      type: 'pronunciation',
                    },
                    {
                      end_time: '25.65',
                      start_time: '24.94',
                      alternatives: [
                        { content: 'Chemical', confidence: '1.0' },
                      ],
                      type: 'pronunciation',
                    },
                    {
                      end_time: '26.26',
                      start_time: '25.65',
                      alternatives: [{ content: 'X', confidence: '0.9988' }],
                      type: 'pronunciation',
                    },
                    {
                      type: 'punctuation',
                      alternatives: [{ content: ',', confidence: '0.0' }],
                    },
                    {
                      end_time: '27.18',
                      start_time: '26.94',
                      alternatives: [{ content: 'and', confidence: '1.0' }],
                      type: 'pronunciation',
                    },
                    {
                      end_time: '27.85',
                      start_time: '27.18',
                      alternatives: [{ content: 'thus', confidence: '0.9995' }],
                      type: 'pronunciation',
                    },
                    {
                      end_time: '28.2',
                      start_time: '27.97',
                      alternatives: [{ content: 'the', confidence: '1.0' }],
                      type: 'pronunciation',
                    },
                    {
                      end_time: '28.82',
                      start_time: '28.2',
                      alternatives: [
                        { content: 'Powerpuff', confidence: '0.8364' },
                      ],
                      type: 'pronunciation',
                    },
                    {
                      end_time: '29.21',
                      start_time: '28.83',
                      alternatives: [{ content: 'Girls', confidence: '1.0' }],
                      type: 'pronunciation',
                    },
                    {
                      end_time: '29.44',
                      start_time: '29.21',
                      alternatives: [{ content: 'were', confidence: '0.9945' }],
                      type: 'pronunciation',
                    },
                    {
                      end_time: '30.13',
                      start_time: '29.44',
                      alternatives: [{ content: 'born', confidence: '1.0' }],
                      type: 'pronunciation',
                    },
                    {
                      type: 'punctuation',
                      alternatives: [{ content: '.', confidence: '0.0' }],
                    },
                    {
                      end_time: '30.95',
                      start_time: '30.18',
                      alternatives: [{ content: 'Um', confidence: '0.9905' }],
                      type: 'pronunciation',
                    },
                    {
                      type: 'punctuation',
                      alternatives: [{ content: ',', confidence: '0.0' }],
                    },
                    {
                      end_time: '31.48',
                      start_time: '30.96',
                      alternatives: [
                        { content: "you're", confidence: '0.7685' },
                      ],
                      type: 'pronunciation',
                    },
                    {
                      end_time: '31.87',
                      start_time: '31.48',
                      alternatives: [{ content: 'using', confidence: '1.0' }],
                      type: 'pronunciation',
                    },
                    {
                      end_time: '32.21',
                      start_time: '31.87',
                      alternatives: [
                        { content: 'their', confidence: '0.6814' },
                      ],
                      type: 'pronunciation',
                    },
                    {
                      end_time: '32.8',
                      start_time: '32.22',
                      alternatives: [{ content: 'awesome', confidence: '1.0' }],
                      type: 'pronunciation',
                    },
                    {
                      end_time: '33.0',
                      start_time: '32.8',
                      alternatives: [{ content: 'and', confidence: '1.0' }],
                      type: 'pronunciation',
                    },
                    {
                      end_time: '33.3',
                      start_time: '33.0',
                      alternatives: [
                        { content: 'super', confidence: '0.9007' },
                      ],
                      type: 'pronunciation',
                    },
                    {
                      end_time: '34.05',
                      start_time: '33.3',
                      alternatives: [
                        { content: 'powers', confidence: '0.9004' },
                      ],
                      type: 'pronunciation',
                    },
                    {
                      end_time: '35.87',
                      start_time: '34.54',
                      alternatives: [
                        { content: 'bubbles', confidence: '0.9981' },
                      ],
                      type: 'pronunciation',
                    },
                    {
                      type: 'punctuation',
                      alternatives: [{ content: ',', confidence: '0.0' }],
                    },
                    {
                      end_time: '36.64',
                      start_time: '35.88',
                      alternatives: [{ content: 'blossom', confidence: '1.0' }],
                      type: 'pronunciation',
                    },
                    {
                      end_time: '36.95',
                      start_time: '36.65',
                      alternatives: [{ content: 'and', confidence: '1.0' }],
                      type: 'pronunciation',
                    },
                    {
                      end_time: '37.46',
                      start_time: '36.95',
                      alternatives: [
                        { content: 'buttercup', confidence: '0.9948' },
                      ],
                      type: 'pronunciation',
                    },
                    {
                      end_time: '38.64',
                      start_time: '38.14',
                      alternatives: [{ content: 'fight', confidence: '1.0' }],
                      type: 'pronunciation',
                    },
                    {
                      end_time: '39.19',
                      start_time: '38.65',
                      alternatives: [{ content: 'crime', confidence: '1.0' }],
                      type: 'pronunciation',
                    },
                    {
                      end_time: '40.62',
                      start_time: '39.19',
                      alternatives: [{ content: 'and', confidence: '1.0' }],
                      type: 'pronunciation',
                    },
                    {
                      end_time: '41.19',
                      start_time: '40.78',
                      alternatives: [{ content: 'the', confidence: '1.0' }],
                      type: 'pronunciation',
                    },
                    {
                      end_time: '41.64',
                      start_time: '41.19',
                      alternatives: [{ content: 'forces', confidence: '1.0' }],
                      type: 'pronunciation',
                    },
                    {
                      end_time: '41.84',
                      start_time: '41.64',
                      alternatives: [{ content: 'of', confidence: '1.0' }],
                      type: 'pronunciation',
                    },
                    {
                      end_time: '42.47',
                      start_time: '41.85',
                      alternatives: [{ content: 'evil', confidence: '1.0' }],
                      type: 'pronunciation',
                    },
                    {
                      type: 'punctuation',
                      alternatives: [{ content: '.', confidence: '0.0' }],
                    },
                    {
                      end_time: '43.36',
                      start_time: '42.69',
                      alternatives: [{ content: 'Um', confidence: '0.9811' }],
                      type: 'pronunciation',
                    },
                    {
                      type: 'punctuation',
                      alternatives: [{ content: ',', confidence: '0.0' }],
                    },
                    {
                      end_time: '45.66',
                      start_time: '45.34',
                      alternatives: [{ content: 'that', confidence: '0.9123' }],
                      type: 'pronunciation',
                    },
                    {
                      end_time: '45.75',
                      start_time: '45.66',
                      alternatives: [{ content: 'the', confidence: '0.9908' }],
                      type: 'pronunciation',
                    },
                    {
                      end_time: '45.87',
                      start_time: '45.75',
                      alternatives: [
                        { content: 'thing', confidence: '0.9916' },
                      ],
                      type: 'pronunciation',
                    },
                    {
                      type: 'punctuation',
                      alternatives: [{ content: ',', confidence: '0.0' }],
                    },
                    {
                      end_time: '46.07',
                      start_time: '45.87',
                      alternatives: [{ content: "that's", confidence: '0.99' }],
                      type: 'pronunciation',
                    },
                    {
                      end_time: '46.66',
                      start_time: '46.07',
                      alternatives: [{ content: 'it', confidence: '0.9992' }],
                      type: 'pronunciation',
                    },
                    {
                      type: 'punctuation',
                      alternatives: [{ content: '.', confidence: '0.0' }],
                    },
                  ],
                },
                status: 'COMPLETED',
              },
            },
          }

          if (response.Item === null) {
          } else {
            response.Item.file_data.results.items.map((item, index) => {
              if (item.end_time !== null) {
                // const dataObj1 = {
                //   x: 'Words',
                //   y: [item.start_time, tiem.end_time],
                // }

                // const dataObj2 = {
                //   name: item.alternatives[0].content,
                //   data: [dataObj1],
                // }

                const dataObj = {
                  name: item.alternatives[0].content,
                  data: [
                    {
                      x: 'words',
                      y: [item.start_time, item.end_time],
                    },
                  ],
                }
                dataList.push(dataObj)
              }
            })

            console.log(test)
            setTranscribeText(
              response.Item.file_data.results.transcripts[0].transcript
            )
            setTranscribeChartState({
              series: dataList,
              options: {
                chart: {
                  height: 50,
                  type: 'rangeBar',
                },
                plotOptions: {
                  bar: {
                    horizontal: true,
                    barHeight: '50%',
                    rangeBarGroupRows: true,
                  },
                },
                fill: {
                  type: 'solid',
                },
                xaxis: {
                  type: 'datetime',
                },
                legend: {
                  position: 'right',
                  horizontalAlign: 'left',
                },
                tooltip: {
                  custom: function (opts) {
                    // const fromYear = new Date(opts.y1).getFullYear()
                    // const toYear = new Date(opts.y2).getFullYear()
                    const values = opts.ctx.rangeBar.getTooltipValues(opts)
                    console.log(values.seriesName)
                    return values.seriesName
                  },
                },
                title: {
                  text: 'Transcribe Text',
                  align: 'center',
                },
              },
            })
          }
        })
        .catch((error) => {
          console.log(error)
        })
    }

    getSpeechAnalysis()
    getGrammar()
    getGaze()
    getSentimentData()
    getTranscribeData()
  }, [])

  const [file, setFile] = useState(null)
  const [name, setName] = useState('')
  const [response, setResponse] = useState('')
  const [isUploading, setIsUploading] = useState(false)

  const [progress, setProgress] = React.useState(0)

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
      Storage.put(name, file, {
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
                  Krishnendu Das
                </Typography>
                <Typography variant="body2">Student</Typography>
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
                  Select file to Analyse
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
                    Select New file
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
                  <CloudUploadIcon style={{ marginRight: '10px' }} /> Analyse
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
            <Card sx={{ maxWidth: 400 }} className={classes.TranscribeCard}>
              <CardContent>
                <Typography
                  sx={{ fontSize: 20 }}
                  color="text.secondary"
                  gutterBottom
                >
                  Transcribe Text
                </Typography>
                <Typography variant="body2">{transcribeText}</Typography>
                <Typography
                  variant="body2"
                  style={{ marginTop: '20px', fontWeight: 'bold' }}
                >
                  Filler Words:
                  {fillerWordsList.map((word) => (
                    <div>
                      <b>{word}</b>
                    </div>
                  ))}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={7}>
            <Card>
              <CardContent>
                <div className={classes.content}>
                  <div className={classes.chartWrapper}>
                    {speechAnalysisHasResponse ? (
                      speechAnalysisIntensityChart ? (
                        <Chart
                          options={speechAnalysisIntensityChart.options}
                          series={speechAnalysisIntensityChart.series}
                          type="line"
                          width="100%"
                        />
                      ) : (
                        <div>
                          Analysis is not available, please check again later
                        </div>
                      )
                    ) : (
                      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <CircularProgress />
                      </Box>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <div className={classes.content}>
                  <div className={classes.chartWrapper}>
                    {grammarHasResponse ? (
                      grammarList ? (
                        <TableContainer component={Paper}>
                          <Table
                            sx={{ minWidth: 400 }}
                            aria-label="simple table"
                          >
                            <TableHead>
                              <TableRow>
                                <TableCell style={{ fontWeight: 'bold' }}>
                                  Timestamp
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
                                  key={grammar.start}
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
                      ) : (
                        <div>Data not ready</div>
                      )
                    ) : (
                      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <CircularProgress />
                      </Box>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <div className={classes.content}>
                  <div className={classes.chartWrapper}>
                    {gazeHasResponse ? (
                      gazeChartState ? (
                        <Chart
                          options={gazeChartState.options}
                          series={gazeChartState.series}
                          type="rangeBar"
                          width="100%"
                        />
                      ) : (
                        <div></div>
                      )
                    ) : (
                      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <CircularProgress />
                      </Box>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <div className={classes.content}>
                  <div className={classes.chartWrapper}>
                    {sentimentHasResponse ? (
                      sentimentChartState ? (
                        <Chart
                          options={sentimentChartState.options}
                          series={sentimentChartState.series}
                          type="bar"
                          width="100%"
                        />
                      ) : (
                        <div></div>
                      )
                    ) : (
                      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <CircularProgress />
                      </Box>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* <Card>
              <CardContent>
                <div className={classes.content}>
                  <div className={classes.chartWrapper}>
                    {transcribeHasResponse ? (
                      transcribeChartState ? (
                        <Chart
                          options={transcribeChartState.options}
                          series={transcribeChartState.series}
                          type="rangeBar"
                          width="100%"
                        />
                      ) : (
                        <div></div>
                      )
                    ) : (
                      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <CircularProgress />
                      </Box>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card> */}
          </Grid>
        </Grid>
      </div>
    </div>
  )
}
