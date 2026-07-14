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





const title =
$("title").text().trim();





const metaDescription =
$('meta[name="description"]').attr("content")
||
"Meta description not found";







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









const images=[];


$("img").each((i,el)=>{


images.push({

src:$(el).attr("src") || "",

alt:$(el).attr("alt") || ""

});


});








const parsedUrl = new URL(url);



const httpsCheck={

isHttps:
parsedUrl.protocol==="https:"

};






const robotsCheck =
await checkRobots(url);



const sitemapCheck =
await checkSitemap(url);







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







let score=0;

let suggestions=[];




// Title

if(title.length>=30 && title.length<=60){

score+=15;

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

score+=15;

}

else{

suggestions.push(
"Meta description should be between 120-160 characters."
);

}







// Heading

if(headings.h1.length===1){

score+=15;

}

else{

suggestions.push(
"Use only one H1 heading on page."
);

}







// Images

const missingAlt =
images.filter(
img=>!img.alt
).length;



if(missingAlt===0){

score+=15;

}

else{

suggestions.push(
`${missingAlt} images are missing alt tags.`
);

}






// HTTPS

if(httpsCheck.isHttps){

score+=20;

}

else{

suggestions.push(
"Enable HTTPS for website security."
);

}







// Robots

if(robotsCheck.exists){

score+=5;

}

else{

suggestions.push(
"Add robots.txt file."
);

}






// Sitemap

if(sitemapCheck.exists){

score+=5;

}

else{

suggestions.push(
"Add sitemap.xml file."
);

}







// Links

if(internalLinks.length>0){

score+=5;

}

else{

suggestions.push(
"Add internal links."
);

}





if(externalLinks.length>0){

score+=5;

}







return{


score,


suggestions,



analysis:{


title,

metaDescription,


headings,


images,


missingAlt,


responseTime,



httpsCheck,


robotsCheck,


sitemapCheck,



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