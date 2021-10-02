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

export default function Main() {
    const [files, setFiles] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const useStyles = makeStyles((theme) => ({
        card: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            margin: '30px',
            width: '300px',
            height: '200px',
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
                                <Typography variant="body2">
                                    Some description
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button size="small">Share</Button>
                                <Button size="small">View Profile</Button>
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
                                    Some description
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <label htmlFor="contained-button-file">
                                    <Input
                                        accept="image/*"
                                        id="contained-button-file"
                                        multiple
                                        type="file"
                                    />
                                    <Button
                                        variant="contained"
                                        component="span"
                                        startIcon={<PhotoCamera />}
                                    >
                                        Upload New Video
                                    </Button>
                                </label>
                            </CardActions>
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
                                <Typography variant="body2">
                                    Some description
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
                                        <Chart
                                            options={chartState.options}
                                            series={chartState.series}
                                            type="line"
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
