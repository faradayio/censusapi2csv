#!/usr/bin/env node

"use strict"
let fs = require('fs')
let request = require('request')
let commandLineArgs = require('command-line-args')
 
let optionDefinitions = [
  { name: 'level', alias: 'l', type: String, defaultValue: 'zip%20code%20tabulation%20area' },
  { name: 'state', alias: 's', type: String },
  { name: 'county', alias: 'c', type: String },
  { name: 'out', alias: 'o', type: String },
  { name: 'year', alias: 'y', type: String, defaultValue: '2015' },
  { name: 'fields', alias: 'f', type: String }
]

function parseFields(f) {
  let fieldsArray = f.split(',')
  let parsedFields = []
  for (let i = 0; i < fieldsArray.length; i++) {
    parsedFields.push(fieldsArray[i] + '_001E')
  }
  return parsedFields.join(',')
}

let options = commandLineArgs(optionDefinitions)

let year = options.year
let fields = parseFields(options.fields)
let inArgs = ''
if (options.state && !options.county) {
  inArgs = '&in=state:' + options.state
} else if (options.state && options.county) {
  inArgs = '&in=state:' + options.state + '%20county:' + options.county
} else if (!options.state && options.county) {
  console.log('Please specify a state FIPS code using the -s argument')
}

let requestUrl = 'https://api.census.gov/data/2015/acs5?get=' + fields + '&for=' + options.level + ':*' + inArgs


request(requestUrl, function (error, response, body) {
  if (error) {
    console.log(error)
  } else if (!error && response.statusCode == 200) {
    let payload = JSON.parse(body)
    if (options.out) {
      fs.writeFileSync('acs_' + year + '_' + options.fields.split(',').join('_') + '_' + options.level + '.csv' )
    } else {
      console.log(payload.map(row => row.join(',')).join('\n'))
    }
  } else {
    console.log(body)
  }
})