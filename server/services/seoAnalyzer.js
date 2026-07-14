const axios = require("axios");
const cheerio = require("cheerio");


const checkRobots = async (url)=>{

try{

const robotsUrl = new URL("/robots.txt",url).href;

await axios.get(robotsUrl);

return {
exists:true,
url:robotsUrl
};


}catch{

return {
exists:false
};

}

};





const checkSitemap = async(url)=>{


try{

const sitemapUrl = new URL("/sitemap.xml",url).href;

await axios.get(sitemapUrl);


return {

exists:true,
url:sitemapUrl

};


}catch{

return {

exists:false

};

}

};








const analyzeSEO = async(url)=>{


const startTime = Date.now();



const response = await axios.get(url,{

headers:{

"User-Agent":
"Mozilla/5.0 Chrome/120 Safari/537.36"

},

timeout:15000

});



const responseTime = Date.now() - startTime;



const html = response.data;


const $ = cheerio.load(html);




// Title

const title =
$("title").text().trim();




// Meta Description

const metaDescription =
$('meta[name="description"]').attr("content")
||
"Meta description not found";




// Headings

const headings={

h1:[],
h2:[],
h3:[]

};



$("h1").each((i,el)=>{

headings.h1.push(
$(el).text().trim()
);

});



$("h2").each((i,el)=>{

headings.h2.push(
$(el).text().trim()
);

});



$("h3").each((i,el)=>{

headings.h3.push(
$(el).text().trim()
);

});




// Images

const images=[];


$("img").each((i,el)=>{


images.push({

src:$(el).attr("src") || "",

alt:$(el).attr("alt") || ""

});


});





const missingAlt =
images.filter(
img=>!img.alt
).length;




const parsedUrl = new URL(url);




// HTTPS

const httpsCheck={

isHttps:
parsedUrl.protocol==="https:"

};




// Robots Sitemap

const robotsCheck =
await checkRobots(url);


const sitemapCheck =
await checkSitemap(url);
// Canonical Check

const canonicalCheck={

exists:
$('link[rel="canonical"]').length > 0

};





// Mobile Friendly

const mobileFriendly={

exists:
$('meta[name="viewport"]').length > 0

};





// Social SEO

const socialTags={


ogTitle:
$('meta[property="og:title"]').length > 0,


ogImage:
$('meta[property="og:image"]').length > 0,


twitterCard:
$('meta[name="twitter:card"]').length > 0


};








// Links

const internalLinks=[];

const externalLinks=[];



$("a").each((i,el)=>{


const href=$(el).attr("href");


if(!href) return;



if(
href.startsWith("/") ||
href.includes(parsedUrl.hostname)
){

internalLinks.push(href);

}

else if(
href.startsWith("http")
){

externalLinks.push(href);

}


});






// SCORE

let onPageScore = 0;

let technicalScore = 0;

let performanceScore = 0;

let socialScore = 0;


let suggestions=[];





// Title

if(title.length>=30 && title.length<=60){

onPageScore += 15;

}

else{

suggestions.push(
"Title should be between 30-60 characters."
);

}






// Meta

if(
metaDescription.length>=120 &&
metaDescription.length<=160
){

onPageScore += 15;

}

else{

suggestions.push(
"Meta description should be between 120-160 characters."
);

}






// Heading

if(headings.h1.length===1){

onPageScore += 15;

}

else{

suggestions.push(
"Use only one H1 heading on page."
);

}







// Images

if(missingAlt===0){

onPageScore += 15;

}

else{

suggestions.push(
`${missingAlt} images are missing alt tags.`
);

}






// HTTPS

if(httpsCheck.isHttps){

technicalScore += 15;

}

else{

suggestions.push(
"Enable HTTPS for website security."
);

}






// Robots

if(robotsCheck.exists){

technicalScore += 5;

}

else{

suggestions.push(
"Add robots.txt file."
);

}






// Sitemap

if(sitemapCheck.exists){

technicalScore += 5;

}

else{

suggestions.push(
"Add sitemap.xml file."
);

}






// Canonical

if(canonicalCheck.exists){

technicalScore += 5;

}

else{

suggestions.push(
"Add canonical tag."
);

}





// Mobile

if(mobileFriendly.exists){

technicalScore += 5;

}

else{

suggestions.push(
"Add viewport meta tag for mobile optimization."
);

}
// Performance Score

if(responseTime <= 2000){

performanceScore += 10;

}

else{

suggestions.push(
"Improve website loading speed."
);

}





// Social Score

if(socialTags.ogTitle){

socialScore += 5;

}

else{

suggestions.push(
"Add Open Graph title."
);

}



if(socialTags.ogImage){

socialScore += 5;

}

else{

suggestions.push(
"Add Open Graph image."
);

}



if(socialTags.twitterCard){

socialScore += 5;

}

else{

suggestions.push(
"Add Twitter Card."
);

}






const score =
onPageScore +
technicalScore +
performanceScore +
socialScore;






return{


score,
categoryScore:{

onPage: onPageScore,

technical: technicalScore,

performance: performanceScore,

social: socialScore

},



suggestions,



analysis:{


title,


titleLength:title.length,


metaDescription,


metaDescriptionLength:
metaDescription.length,



headings,


images,


missingAlt,



responseTime,



httpsCheck,


robotsCheck,


sitemapCheck,


canonicalCheck,


mobileFriendly,


socialTags,



internalLinks,


externalLinks,



urlStructure:{


fullUrl:url,

protocol:parsedUrl.protocol,

hostname:parsedUrl.hostname,

pathname:parsedUrl.pathname


}


}



};


};






module.exports={

analyzeSEO

};