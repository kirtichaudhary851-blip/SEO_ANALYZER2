const axios = require("axios");
const cheerio = require("cheerio");



const checkRobots = async(url)=>{

try{

const parsedUrl = new URL(url);

const robotsUrl =
`${parsedUrl.protocol}//${parsedUrl.hostname}/robots.txt`;


const response = await axios.get(robotsUrl,{
timeout:10000,
maxRedirects:5,
headers:{
"User-Agent":"Mozilla/5.0"
}
});


return {

exists:
response.status === 200 &&
typeof response.data === "string" &&
response.data.includes("User-agent"),

url:robotsUrl

};


}
catch(error){

console.log("ROBOTS ERROR:", error.message);

return {

exists:false,
url:null

};

}

};
const checkSitemap = async(url)=>{


try{

const parsedUrl = new URL(url);

const sitemapUrls = [
`${parsedUrl.protocol}//${parsedUrl.hostname}/sitemap.xml`,
`${parsedUrl.protocol}//${parsedUrl.hostname}/sitemap_index.xml`,
`${parsedUrl.protocol}//${parsedUrl.hostname}/wiki/sitemap.xml`
];

let sitemapExists = false;
let foundSitemap = "";

for (const sitemapUrl of sitemapUrls) {

try {

const response = await axios.get(sitemapUrl,{
timeout:10000,
maxRedirects:5,
headers:{
"User-Agent":"Mozilla/5.0"
}
});

if(
response.status === 200 &&
typeof response.data === "string" &&
response.data.includes("urlset")
){

sitemapExists = true;
foundSitemap = sitemapUrl;
break;

}

}
catch(error){

continue;

}

}

return {

exists: sitemapExists,

url: foundSitemap

};


}
catch(error){


console.log("SITEMAP ERROR:",error.message);


return{

exists:false,
url:null

};


}

};

const analyzeSEO = async(url)=>{
if(!url.endsWith("/")){
url=url+"/";
}

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


console.log(
"CANONICAL:",
$('link[rel="canonical"]').attr("href")
);

console.log(
"TWITTER:",
$('meta[name="twitter:card"]').attr("content")
);




// Title

const title =
$("title").first().text().trim();
const metaDescription =
$('meta[name="description"]').attr("content")?.trim()
||
"";




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
img=>!img.alt.trim()
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

const canonicalHref =
$('link[rel="canonical"], link[rel="Canonical"], link[rel="CANONICAL"]')
.first()
.attr("href") || null;

const canonicalCheck = {
    exists: canonicalHref !== null,
    url: canonicalHref
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
$('meta[name="twitter:card"], meta[property="twitter:card"]').length > 0

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