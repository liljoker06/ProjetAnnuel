// Verification des status des domaines avec l'API de SiteRelic (A REVOIR)
// ESSAYER DE FAIRE UNE API PERSONNELLE POUR VERIFIER LES STATUS DES DOMAINES
const checkDomainStatus = async (domain) => {
    try {
      const response = await axios.post('https://api.siterelic.com/ping', {
        "url": domain
      }, {
        headers: {
          'x-api-key': 'd8f897cf-84a1-405c-b891-e370ef1028af',
          'Content-Type': 'application/json'
        }
      });
      return response.data.loss === 0 ? 'Operational' : 'Down';
    } catch (error) {
      console.error('Error checking domain status:', error);
      return 'Unknown';
    }
  };
  
  async function checkMultipleDomains(domains) {
    const results = {};
    const promises = domains.map(async (domain) => {
      results[domain] = await checkDomainStatus(domain);
    });
    await Promise.all(promises);
    return results;
  }