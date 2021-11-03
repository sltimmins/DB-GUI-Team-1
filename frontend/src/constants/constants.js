export const MainBackgroundColor = "#f5f5f5";
export const MainTitle = "Politimaps";
// ENTER YOUR EC2 PUBLIC IP/URL HERE
export const ec2_url = "";
// CHANGE THIS TO TRUE IF HOSTING ON EC2, MAKE SURE TO ADD IP/URL ABOVE
export const ec2 = false;
// USE localhost OR ec2_url ACCORDING TO ENVIRONMENT
export const baseURL = ec2 ? ec2_url : "http://localhost:8000";