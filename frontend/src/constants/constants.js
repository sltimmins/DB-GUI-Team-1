export const MAIN_BACKGROUND_COLOR = "#f5f5f5";
export const MAIN_TITLE = "Politimaps";
// ENTER YOUR EC2 PUBLIC IP/URL HERE
export const EC2_URL = "ec2-3-144-137-73.us-east-2.compute.amazonaws.com";
// CHANGE THIS TO TRUE IF HOSTING ON EC2, MAKE SURE TO ADD IP/URL ABOVE
export const EC2 = false;
// USE localhost OR ec2_url ACCORDING TO ENVIRONMENT
export const BASE_URL = EC2 ? EC2_URL : "http://localhost:8000";

export const MAPBOX_API_KEY = 'pk.eyJ1Ijoic2Vuc2Vpc3ViIiwiYSI6ImNrdjE1OHAxbzNxcnMydnBnY3BycHdob3oifQ.xuqTng_6PKWKkW59Us5aXA';

export const REPUBLICAN = 'Republican';

export const DEMOCRAT = 'Democrat';

export const LIBERTARIAN = 'Libertarian';

export const GREEN = 'Green';

export const statusMap = {
    "Democrat": "Democrat",
    "Republican": "Republican",
    "Green": "Green",
    "Libertarian": "Libertarian"
}