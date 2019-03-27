const request = require('request');
const keys = require('./key');
const address = process.argv[2];

if(!address){
   return  console.log('Please provide the address');
}

const geocode = (address,callback) => {
    const url = keys.geocodeURI(address);
    request(url,(error, response) => {
        const data = JSON.parse(response.body);
        if(error){
            callback('Unable to connect to location services',undefined);
        }else if(data.features.length === 0){
            callback('Unable to find location.Try another search',undefined);
        }else{
            callback(undefined,{
                latitude: data.features[0].center[1],
                longitude: data.features[0].center[0],
                location: data.features[0].place_name
            });
        }
    });
};

const forecast = (latitude, longitude, callback) => {
    const url = keys.forecastURI(latitude,longitude);
    request({url, json: true }, (error, response) => {
    if(error){
        callback('Unable to connect to weather service!',undefined);
    }else if(response.body.error) {
        callback('Unable to fine location',undefined);
    }else{
        callback(undefined, response.body.daily.data[0].summary + ' It is currently ' + response.body.currently.temperature + ' degress out. There is a ' + response.body.currently.precipProbability + '% chance of rain.');
    }
});
};

geocode(address,(error, data) => {
    if(error){
        return console.log(error);
    }
    forecast(data.latitude, data.longitude, (error, forecastData) => {
        if(error){
            return console.log(error);
        }
        console.log(data.location);
        console.log(forecastData);
    });
});








