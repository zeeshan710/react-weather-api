import React, { useState } from 'react';
import { Grid, TextField, Button, Select, InputLabel, FormControl } from '@material-ui/core'
import { makeStyles } from "@material-ui/core/styles";
import { Search } from "@material-ui/icons";
import { useFetch } from '../../utils';
import WeatherCard from '../../components/WeatherCard';


const useStyles = makeStyles((theme) => ({

    TopBar: {
        color: 'white',
        backgroundColor: '#464571',
    },
    title: {
        padding: theme.spacing(2),
    },
    searchField: {
        width: '100%'
    },
    iconButton: {
        backgroundColor: 'white',
        color: 'gray',
        width: '100%',
        height: '100%'
    },
    weatherCard: {
        marginTop: '3em',
        marginLeft: '2em'
    }
}));



function SearchBar(props) {

    const [searchBy, setSearchBy] = useState();
    const [searchValue, setSearchValue] = useState();
    const classes = useStyles();
    const [data, setData] = useState();
    const [displayCard, setDisplayCard] = useState(false)


    const handleSearchBy = (event) => { setSearchBy(event.target.value) };

    const handleSearchValue = (event) => { setSearchValue(event.target.value); }

    const handleSearchClick = () => {
        setDisplayCard(false)
        switch (searchBy) {
            case '10': FetchWeatherData('q', searchValue.trim()); break
            case '20': FetchWeatherData('id', searchValue.trim()); break
            case '30': FetchWeatherData('zip', searchValue.trim()); break
            default: alert('default')
        }
    }
    const FetchWeatherData = async (searchBy, searchValue) => {
        const data = await useFetch(`http://api.openweathermap.org/data/2.5/forecast?${searchBy}=${searchValue}&units=metric&appid=c73aa228bfba692462f96e89080aa39a`, { method: "get" });
        console.log(data);
        if (data.error === null) {
            setData(data.response)
            console.log("My data", data.response);
            if (data.response.cod == "200") {
                setDisplayCard(true)
            }
            else {
                setDisplayCard(false)
                alert(data.response.message)
            }


        }
    }



    return (
        <div>
            <Grid container justify="center">

                <Grid item xs={3}>

                    <FormControl variant="outlined" className={classes.searchField}>
                        <InputLabel htmlFor="outlined-search-native-simple">Search By</InputLabel>
                        <Select
                            native
                            value={searchBy}
                            onChange={handleSearchBy}
                            label="Search By"
                            inputProps={{
                                name: "search",
                                id: "outlined-search-native-simple"
                            }}
                        >
                            <option aria-label="None" value="" />
                            <option value={10}>City Name</option>
                            <option value={20}>City Id</option>
                            <option value={30}>Zip Code</option>
                        </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={6}>
                    <TextField value={searchValue} onChange={handleSearchValue} id="outlined-search" label="Search.." type="search" variant="outlined" className={classes.searchField} />
                </Grid>

                <Grid item xs={3}>
                    <Button variant="outlined" className={classes.iconButton} onClick={handleSearchClick}>
                        <Search />
                    </Button>
                </Grid>

            </Grid>
            {
                displayCard ?
                    <Grid container className={classes.weatherCard}  >
                        <Grid item xs={12} >
                            <WeatherCard data={data} />
                        </Grid>
                    </Grid> : null
            }



        </div>
    );
}

export default SearchBar;