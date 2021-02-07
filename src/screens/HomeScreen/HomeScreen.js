import React from 'react';
import { Grid, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import SearchBar from '../../components/SearchBar';
import WeatherCard from '../../components/WeatherCard'

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: "center",
        color: theme.palette.text.secondary
    },
    TopBar: {
        color: 'white',
        backgroundColor: '#464571',
    },
    title: {
        padding: theme.spacing(2),
    },
    weatherCard: {
        marginTop: '3em',
        marginLeft: '5em'
    }
}));

function HomeScreen(props) {
    const classes = useStyles();
    return (
        <div className={classes.root}>
            <Grid container spacing={3} justify="center">
                <Grid item xs={12} className={classes.TopBar}>
                    <Typography variant="h5" className={classes.title} >
                        WEATHER FORECAST (5 DAYS)
                    </Typography>
                </Grid>
                <Grid item xs={6}>
                    <SearchBar />
                </Grid>

            </Grid>

            {/* <Grid container spacing={3} justify="center" className={classes.weatherCard}  >
                <Grid item xs={6} >
                    <WeatherCard />
                </Grid>
            </Grid> */}
        </div>
    );
}

export default HomeScreen;