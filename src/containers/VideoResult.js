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
import Button from '@mui/material/Button'
import ListItemButton from '@mui/material/ListItemButton'
import Chart from 'react-apexcharts'
import Grid from '@mui/material/Grid'
import CommentApp from './CommentApp'
import { API } from 'aws-amplify'

export default function VideoList(props) {
  const { filename } = props
  const [speechAnalysis, setSpeechAnalysis] = useState(null)
  const [speechAnalysisChart, setSpeechAnalysisChart] = useState(null)
  const history = useHistory()

  useEffect(() => {
    async function getSpeechAnalysis() {
      const analysisResponse = await API.get(
        'digitalToastmasterFrontendAPI',
        '/getSpeechAnalysis',
        {
          queryStringParameters: {
            fileid: 'wav//test.wav',
          },
        }
      )
        .then((response) => {
          console.log(response)
          setSpeechAnalysis(response.Item)
          const intensityValue = []
          const intensityTimestamp = []
          response.Item.intensity_timeseries.forEach((array, index) => {
            if (index % 100 === 0) {
              intensityValue.push(array[1])
              intensityTimestamp.push(array[0])
            }
          })
          setSpeechAnalysisChart({
            series: [
              {
                name: 'Intensity',
                data: intensityValue,
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
                categories: intensityTimestamp,
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
        })
        .catch((error) => {
          console.log(error.response)
        })
    }
    getSpeechAnalysis()
  }, [])

  return (
    <>
      <Grid>
        {speechAnalysisChart && (
          <Chart
            options={speechAnalysisChart.options}
            series={speechAnalysisChart.series}
            type="line"
            width="100%"
          />
        )}
      </Grid>
      <Grid>
        <CommentApp filename={filename} />
      </Grid>
    </>
  )
}
