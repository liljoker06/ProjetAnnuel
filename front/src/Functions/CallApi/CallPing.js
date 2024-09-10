import axios from 'axios';

const SITE_RELIC_API_URL = '/ping';
// const API_KEY = '1f896b1c-e9ce-49dc-836e-269c90973830 ';
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

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const checkApiStatus = async (apiStatus) => {
  const checkStatus = [];
  for (const api of apiStatus) {
    const result = await pingServer(api.url);
    checkStatus.push({ ...api, status: result.status, details: result.details });
    await delay(1000); // Délai de 1 seconde
  }
  return checkStatus;
};

export const checkServerStatus = async (serverStatus) => {
  const checkStatus = [];
  for (const server of serverStatus) {
    const result = await pingServer(server.url);
    checkStatus.push({ ...server, status: result.status, details: result.details });
    await delay(1000); // Délai de 1 seconde
  }
  return checkStatus;
};