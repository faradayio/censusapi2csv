#!/usr/bin/env node

"use strict"
let fs = require('fs')
let request = require('request')
let commandLineArgs = require('command-line-args')
 
let optionDefinitions = [
  { name: 'level', alias: 'l', type: String, defaultValue: 'state' },
  { name: 'state', alias: 's', type: String },
  { name: 'endpoint', alias: 'e', type: String, defaultValue: 'acs' },
  { name: 'county', alias: 'c', type: String },
  { name: 'out', alias: 'o', type: String },
  { name: 'year', alias: 'y', type: String, defaultValue: '2017' },
  { name: 'fields', alias: 'f', type: String },
  { name: 'key', alias: 'k', type: String }
]

function parseFields(f) {
  let fieldsArray = f.split(',')
  let parsedFields = []
  for (let i = 0; i < fieldsArray.length; i++) {
    if (fieldsArray[i].length == 6 ) {
      parsedFields.push(fieldsArray[i] + '_001E')
    } else {
      parsedFields.push(fieldsArray[i])
    }
  }
  return parsedFields.join(',')
}

let options = commandLineArgs(optionDefinitions)

let year = options.year
let endpoint = options.endpoint
let inArgs = ''
let apiKey = ''
let endpointUrl = ''
let fields = ''
if (options.state && !options.county) {
  inArgs = '&in=state:' + options.state
} else if (options.state && options.county) {
  inArgs = '&in=state:' + options.state + '%20county:' + options.county
} else if (!options.state && options.county) {
  console.log('Please specify a state FIPS code using the -s argument')
}

if (options.key) {
  apiKey = '&key=' + options.key
}

if (options.endpoint === 'acs') {
  endpointUrl = 'acs/acs5'
  fields = parseFields(options.fields)
} else if (options.endpoint === 'dc') {
  endpointUrl = 'dec/sf1'
  if (year === '2000' || year === '2010') {
    year = options.year
    fields = options.fields
  } else {
    console.log('Please specify a valid Census year (multiples of 10, yo)')
    process.exit(1);
  }
}

let requestUrl = 'https://api.census.gov/data/' + year + '/' + endpointUrl + '?get=' + fields + '&for=' + options.level + ':*' + inArgs + apiKey

request(requestUrl, function (error, response, body) {
  if (error) {
    console.log(error)
  } else if (!error && response.statusCode == 200) {
    let payload = JSON.parse(body)
    if (options.out) {
      fs.writeFileSync(options.out, payload.map(row => row.join(',')).join('\n'))
    } else {
      console.log(payload.map(row => row.join(',')).join('\n'))
    }
  } else {
    console.log(body)
  }
})