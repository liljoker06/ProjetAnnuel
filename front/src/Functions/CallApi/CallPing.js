import axios from 'axios';

const SITE_RELIC_API_URL = '/ping';
// const API_KEY = 'd8f897cf-84a1-405c-b891-e370ef1028af'; 
const API_KEY = 'xxx';

const pingServer = async (url) => {
  try {
    const response = await axios.post(SITE_RELIC_API_URL, {
      url: url
    }, {
      headers: {
        'x-api-key': API_KEY,
        'Content-Type': 'application/json'
      }
    });

    if (response.data.apiStatus === 'success') {
      const data = response.data.data;
      console.log(`Server ${url} is Operational`);
      console.log(`Requests: ${data.requests}, Loss: ${data.loss}, Latency: ${data.latency}ms`);
      console.log(`Min: ${data.min}ms, Max: ${data.max}ms, Avg: ${data.avg}ms, StdDev: ${data.stdDev}ms`);
      console.log(`IP: ${data.ip}`);
      return {
        status: 'Operational',
        details: data
      };
    } else {
      console.log(`Server ${url} is Down`);
      return {
        status: 'Down',
        details: null
      };
    }
  } catch (error) {
    console.log(`Error pinging server ${url}:`, error);
    return {
      status: 'Down',
      details: null
    };
  }
};

export const checkApiStatus = async (apiStatus) => {
  const checkStatus = apiStatus.map(async (api) => {
    const result = await pingServer(api.url);
    return { ...api, status: result.status, details: result.details };
  });

  return await Promise.all(checkStatus);
};

export const checkServerStatus = async (serverStatus) => {
  const checkStatus = serverStatus.map(async (server) => {
    const result = await pingServer(server.url);
    return { ...server, status: result.status, details: result.details };
  });

  return await Promise.all(checkStatus);
};