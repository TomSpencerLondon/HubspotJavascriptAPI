const https = require('https');
const hubspot_api = process.env.HUBSPOT_API;
console.log(hubspot_api);

const get = async (after) => {
  return new Promise(resolve => {
    let url = `https://api.hubapi.com/cms/v3/blogs/posts?hapikey=${hubspot_api}`;
    if (after) {
      url += '&after=' + after
    }

    https.get(url, (response) => {
      let data = '';

      response.on('data', (chunk) => {
        data += chunk;
      });

      response.on('end', () => {
        data = JSON.parse(data);
        data.results.forEach(post => {
          if (!post.postBody || !post.postBody.includes("<!--more-->")) {
            console.log(post.id)
          }
        })
        if (data.paging) {
          get(data.paging.next.after)
        }
      });

    });
  })
}

get();
