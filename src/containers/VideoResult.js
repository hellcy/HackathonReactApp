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
import './VideoResult.css'
import LoaderButton from '../components/LoaderButton'
import ListItemButton from '@mui/material/ListItemButton'
import Chart from 'react-apexcharts'
import Grid from '@mui/material/Grid'
import CommentApp from './CommentApp'
import { API } from 'aws-amplify'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

export default function VideoList(props) {
  const { filename } = props
  const [speechAnalysis, setSpeechAnalysis] = useState(null)
  const [speechAnalysisIntensityChart, setSpeechAnalysisIntensityChart] =
    useState(null)
  const history = useHistory()

  useEffect(() => {
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
          console.log(response)
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
              title: {
                text: filename,
                align: 'center',
              },
              legend: {
                position: 'bottom',
                horizontalAlign: 'center',
                floating: true,
                offsetY: -25,
                offsetX: -5,
              },
            },
          })
        })
        .catch((error) => {
          console.log(error.response)
        })
    }
    getSpeechAnalysis()
  }, [])

  function handleBack() {
    history.push('/videoList')
  }

  return (
    <div className="wrapper">
      <Grid>
        <LoaderButton className="comment-field-button" onClick={handleBack}>
          <ArrowBackIcon />
          Back
        </LoaderButton>{' '}
      </Grid>
      <Grid>
        {speechAnalysisIntensityChart ? (
          <>
            <Chart
              options={speechAnalysisIntensityChart.options}
              series={speechAnalysisIntensityChart.series}
              type="line"
              width="100%"
            />
          </>
        ) : (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
          </Box>
        )}
      </Grid>
      <Grid>
        <CommentApp filename={filename} />
      </Grid>
    </div>
  )
}
