# censusapi2csv
A tool for downloading Census/ACS data from the API and parsing to CSV

### Installation
`npm install censusapi2csv -g`

### Usage
`censusapi2csv -f <census field codes>`

### Arguments
* `-f, --fields` (_REQUIRED_) Comma-separated list of [desired ACS fields](https://api.census.gov/data/2015/acs/acs5/variables.html) or [decennial census fields](https://api.census.gov/data/2010/sf1/variables.html) (e.g. `B01001` = Total population)
* `-e, --endpoint` (_OPTIONAL_) Desired endpoint, one of `acs` (American Community Survey) or `dc` (Decennial Census); default = `acs`
* `-l, --level` (_OPTIONAL_) Geographic level of desired results, one of `state`, `county`, `place`, `county subdivision`, `zip code tabulation area`, `tract`, `block group`, or `block`. (default: 'zip code tabulation area')
* `-o, --out` (_OPTIONAL_) Output filename and path if desired. Default is to STDOUT.
* `-k, --key` (_OPTIONAL_) Census [API key](https://api.census.gov/data/key_signup.html) (limited use without one)
* `-s, --state` (_OPTIONAL_) FIPS code of a state to which you want the request restricted (e.g. '06' = California)
* `-c, --county` (_OPTIONAL_) FIPS code of a county to which you want the request restricted (e.g. '007' = Chittenden county, within Vermont)

### Notes
* Some request levels must be restricted by state or county. For example, the `block group` level will only be returned if both state and county are specified

### License

MIT
