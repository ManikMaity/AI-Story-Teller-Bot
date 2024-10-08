const fs = require('fs');
async function  getImage(prompt, filename) {
    try{
        const width = 400;
        const height = 400;
        const response = await fetch(`https://image.pollinations.ai/prompt/${prompt}?width=${width}&height=${height}`);
        const data = await response.text();
        const imagelink =  response.url;
        return imagelink;

    }
    catch(err){
        console.log(err);
    }
   
}


module.exports = getImage;