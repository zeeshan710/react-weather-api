import React, { useEffect, useState } from 'react';
import { Grid, Typography, Avatar } from '@material-ui/core';
import { makeStyles } from "@material-ui/core/styles";
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import drilldown from 'highcharts/modules/drilldown';
drilldown(Highcharts);

const useStyles = makeStyles((theme) => ({

    weatherCard: {
        color: 'gray'
    },
    avatar: {
        width: theme.spacing(8),
        height: theme.spacing(8),
    },
    temperatureContainer: {
        display: 'flex',
        paddingTop: '1em'
    },
    temperatureSymbol: {
        cursor: 'pointer',


    },
    temperatureUnderline: {
        cursor: 'pointer',
        textDecoration: 'underline'
    },
    temparatureValue: {
        marginLeft: '0.3em',
        color: 'black'
    },
    weatherInfoDetail: {

        paddingTop: '1em',

    },
    week_avatar_icon: {
        marginLeft: '1.2em',
        width: theme.spacing(8),
        height: theme.spacing(8),
    },
    weekCards: {
        textAlign: 'center',
        cursor: 'pointer',
        '&:active': {
            textAlign: 'center',
            cursor: 'pointer',
            border: '2px solid gray',
            backgroundColor: '#E7E7E7'
        }
    },
    activeWeekCard: {
        textAlign: 'center',
        cursor: 'pointer',
        border: '2px solid gray'
    }

}));

function WeatherCard(props) {
    const classes = useStyles();
    const { city, list } = props.data
    const { weather, main, dt_txt, wind } = list[0]
    const { name, country } = city

    const [weatherDetail, setweatherDetail] = useState({
        day: '',
        pressure: '',
        humidity: '',
        wind: '',
        status: '',
        icon: '',
        temperature: ''
    })

    const [weekData, setweekData] = useState([])
    const [isCelsius, setIsCelsius] = useState(true);
    const [chartData, setChartData] = useState([]);
    const [chartDayHourDetail, setChartDayHourDetail] = useState([])



    useEffect(() => {
        setHeaderData();
        getFiveDaysCards();


    }, [props.data])

    const getChartData = async (week) => {
        let chartData = []
        week.map((item) => {
            const { dt_txt, main, } = item
            let d = new Date(dt_txt);
            let day = getDayName(d.getDay());

            chartData.push(
                {
                    name: day,
                    y: parseInt(main.temp.toFixed(0)),
                    drilldown: day
                }
            )
        })
        setChartData(chartData);
    }


    const setHeaderData = async () => {

        const d = new Date(dt_txt);

        const day = await getDayName(d.getDay());

        setweatherDetail({
            day: day,
            pressure: main.pressure,
            humidity: main.humidity,
            wind: wind.speed,
            status: weather[0].main,
            icon: weather[0].icon,
            temperature: main.temp.toFixed(0)
        })
    }

    const getDayName = (dayNumber) => {
        switch (dayNumber) {
            case 0: return 'Sunday'
            case 1: return 'Monday'
            case 2: return 'Tuesday'
            case 3: return 'wednesday'
            case 4: return 'Thursday'
            case 5: return 'Friday'
            case 6: return 'Saturday'
            default: return null
        }
    }

    const getDetailChartData = (week) => {
        let weekHourlyInfo = []

        week.map((day) => {
            let timeStamp = new Date(day.dt_txt);
            let date = timeStamp.getDate();
            let dayName = getDayName(timeStamp.getDay());

            let dayDetail = list.filter((item) => {
                const { dt_txt } = item
                let itemTimeStamp = new Date(dt_txt)
                return date == itemTimeStamp.getDate()
            }
            )


            const hourInfo = []
            dayDetail.map((item) => {
                const { main } = item
                let timeStamp = new Date(item.dt_txt);
                let time = `${timeStamp.getHours()}:${timeStamp.getMinutes()}0`;
                hourInfo.push([time, parseInt(main.temp.toFixed(0))])
            })

            let dayHourlyInfo = {
                id: dayName,
                data: hourInfo
            }


            weekHourlyInfo.push(dayHourlyInfo)

        })
        console.log("final hour", weekHourlyInfo);
        setChartDayHourDetail(weekHourlyInfo)
    }

    const getFiveDaysCards = async () => {

        const timeStamp = new Date(dt_txt);
        let date = timeStamp.getDate();
        let temp = []


        await list.map((item) => {

            let itemTimeStamp = new Date(item.dt_txt);
            let itemDate = itemTimeStamp.getDate();

            if (date === itemDate) {

                date++
                temp.push(item);


            }

        })
        setweekData(temp);
        getChartData(temp);
        getDetailChartData(temp);
    }
    const handleOnClick = (detail) => {

        setweatherDetail(detail)
    }

    const celsiusToFahrenheit = (val) => {
        return (val * (9 / 5)) + 32
    }
    const handleCelsiusClick = () => {
        setIsCelsius(true);

    }
    const handleFahrenheitClick = () => {
        setIsCelsius(false);

    }
    const options = {
        chart: {
            type: 'areaspline'
        },
        credits: {
            enabled: false
        },
        tooltip: {
            formatter() {
                return ` Temperature: ${this.y}\u00b0 C`
            }
        },
        title: {
            text: 'Weather Forecast'
        },
        yAxis: {
            title: {
                text: 'Temperature'
            }
        },
        xAxis: {
            type: 'category',


        },
        series: [
            {
                name: 'Days',
                data: chartData

            }
        ],
        drilldown: {
            name: 'Hours',
            series: chartDayHourDetail

        }
    };

    return (
        <div className={classes.weatherCard}>
            <Grid item  >
                <Typography variant="h5" >
                    {`${name} ,${country}`}
                </Typography>

            </Grid>

            <Grid item  >
                <Typography variant="h7" >
                    {weatherDetail.day}
                </Typography>
            </Grid>

            <Grid item  >
                <Typography variant="h7" >
                    {weatherDetail.status}
                </Typography>
            </Grid>

            <Grid container  >

                <Grid item xs={7} className={classes.temperatureContainer}>
                    <Avatar alt="weather" src={`http://openweathermap.org/img/w/${weatherDetail.icon}.png`} className={classes.avatar} />

                    <Typography variant="h3" className={classes.temparatureValue} >
                        {isCelsius ? weatherDetail.temperature : celsiusToFahrenheit(weatherDetail.temperature).toFixed(0)}
                    </Typography>

                    <Typography variant="h5" className={isCelsius ? classes.temperatureUnderline : classes.temperatureSymbol} onClick={handleCelsiusClick}>
                        {`\u00b0`}C
                    </Typography>
                    <Typography variant="h5" onClick={handleCelsiusClick}>
                        {` |`}
                    </Typography>

                    <Typography variant="h5" className={!isCelsius ? classes.temperatureUnderline : classes.temperatureSymbol} onClick={handleFahrenheitClick}>
                        {`\u00b0`}F
                    </Typography>
                </Grid>

                <Grid item xs={5} className={classes.weatherInfoDetail}>
                    <Typography variant="subtitle2" >
                        {`Pressure: ${weatherDetail.pressure} hPa`}
                    </Typography>
                    <Typography variant="subtitle2" >
                        {`Humidity: ${weatherDetail.humidity}%`}
                    </Typography>
                    <Typography variant="subtitle2" >
                        {`Wind Speed: ${weatherDetail.wind} m/s`}
                    </Typography>

                </Grid>
            </Grid>

            <Grid container spacing={1} style={{ marginTop: '1em' }}>
                {weekData.length > 0 ? weekData.slice(0, 5).map((item) => {
                    const { weather, dt_txt, main, wind } = item
                    let d = new Date(dt_txt);
                    let day = getDayName(d.getDay());

                    let max = main.temp_max.toFixed(0);
                    let min = main.temp_min.toFixed(0)

                    const detail = {
                        day: day,
                        pressure: main.pressure,
                        humidity: main.humidity,
                        wind: wind.speed,
                        status: weather[0].main,
                        icon: weather[0].icon,
                        temperature: main.temp.toFixed(0)
                    }

                    return (
                        <Grid item xs={2} className={classes.weekCards} onClick={() => handleOnClick(detail)}>
                            <Typography variant="subtitle2" >
                                {day}
                            </Typography>
                            <Avatar alt="weather" src={`http://openweathermap.org/img/w/${weather[0].icon}.png`} className={classes.week_avatar_icon} />

                            <Typography variant="subtitle2" >
                                {`${isCelsius ? min : celsiusToFahrenheit(min).toFixed(0)}\u00b0 ${isCelsius ? max : celsiusToFahrenheit(max).toFixed(0)}\u00b0`}
                            </Typography>
                        </Grid>


                    )
                }) : null}

            </Grid>
            <Grid xs={12} style={{ marginTop: '6em' }}>
                {
                    chartDayHourDetail.length > 0 ?

                        <HighchartsReact highcharts={Highcharts} options={options} /> : null}
            </Grid>
        </div>
    );
}

export default WeatherCard;