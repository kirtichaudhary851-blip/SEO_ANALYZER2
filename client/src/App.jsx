import Report from "./pages/Report";
import { useState } from "react";
import "./App.css";

import {
  FaSearch,
  FaHistory,
  FaGlobe,
  FaChartLine,
  FaLink,
  FaImage,
  FaHeading,
  FaShieldAlt,
  FaMobileAlt,
  FaRobot,
  FaSitemap,
  FaCheckCircle
} from "react-icons/fa";


function App() {


const [url,setUrl] = useState("");
const [result,setResult] = useState(null);
const [reports,setReports] = useState([]);
const [loading,setLoading] = useState(false);
const [selectedReport,setSelectedReport] = useState(null);





const analyzeWebsite = async()=>{


if(!url.trim()){

alert("Please enter website URL");
return;

}



let websiteUrl = url;


if(!websiteUrl.startsWith("http")){

websiteUrl = "https://" + websiteUrl;

}



try{

new URL(websiteUrl);

}

catch{

alert("Please enter valid URL");
return;

}





try{


setLoading(true);



const response = await fetch(
"http://localhost:3000/api/analyze",
{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

url:websiteUrl

})

}

);




const data = await response.json();




if(!response.ok){

alert(data.message || "Analysis failed");
return;

}



setResult(data);

setUrl(websiteUrl);

setSelectedReport(null);



}

catch(error){

console.log(error);

alert("Unable to analyze website");

}

finally{

setLoading(false);

}



};








const fetchReports = async()=>{


try{


const response = await fetch(
"http://localhost:3000/api/reports"
);



const data = await response.json();



const uniqueReports =
data.reports.filter(
(report,index,self)=>

index === self.findIndex(
(item)=>item.url === report.url
)

);



setReports(uniqueReports);

setResult(null);



}

catch(error){

console.log(error);

alert("Unable to load history");

}


};









const fetchReportById = async(id)=>{


try{


const response = await fetch(
`http://localhost:3000/api/reports/${id}`
);



const data = await response.json();



if(data.success){

setSelectedReport(data.report);

}



}

catch(error){

console.log(error);

alert("Unable to load report");

}


};







return (

<div className="container">



<nav className="navbar">


<div className="logo">

<FaChartLine/>

<span>
SEO Analyzer
</span>

</div>



<div className="navLinks">

<span>
Dashboard
</span>


<span onClick={fetchReports}>
History
</span>


</div>


</nav>







<div className="hero">


<h1>
Website SEO Checker & Audit Tool
</h1>


<p>
Analyze website SEO performance with complete technical,
on-page and performance audit.
</p>


</div>







<div className="searchBox">


<div className="inputWrapper">


<FaGlobe className="inputIcon"/>



<input

type="text"

placeholder="https://example.com"

value={url}

onChange={(e)=>setUrl(e.target.value)}

/>


</div>





<button

className="analyzeBtn"

onClick={analyzeWebsite}

disabled={loading}

>


<FaSearch/>

{

loading

?

"Analyzing..."

:

"Analyze"

}


</button>






<button

className="historyBtn"

onClick={fetchReports}

>


<FaHistory/>

History


</button>



</div>






{
result && (


<div className="result">


<Report result={result} />


<div className="scoreBox">
<h2>
SEO Score
</h2>


<div className="score">

{result.score}/100

</div>



<p>

{
result.score >=90

?

"🟢 Excellent"

:

result.score >=75

?

"🟡 Good"

:

result.score >=50

?

"🟠 Average"

:

"🔴 Poor"

}

</p>
<p>
<strong>Website</strong>
<br/>

{result.analysis?.urlStructure?.fullUrl}

</p>



<p>

<strong>
Response Time
</strong>

<br/>

{result.analysis?.responseTime} ms

</p>



</div>
// SEO Details Cards


<div className="detailsGrid">



{/* ON PAGE SEO */}

<div className="sectionTitle">

<h2>
📄 On Page SEO
</h2>

</div>




<div className="card">

<h3>
Title
</h3>


<p>

{result.analysis?.title || "Not Available"}

</p>


<p>

Length:

{result.analysis?.titleLength || 0}

Characters

</p>


</div>






<div className="card">

<h3>
Meta Description
</h3>


<p>

{
result.analysis?.metaDescription
||
"Not Available"

}

</p>



<p>

Length:

{
result.analysis?.metaDescriptionLength || 0
}

Characters

</p>


</div>








<div className="card">

<h3>
<FaHeading/> Headings
</h3>



<p>

H1:

{
result.analysis?.headings?.h1?.length || 0
}

</p>



<p>

H2:

{
result.analysis?.headings?.h2?.length || 0
}

</p>



<p>

H3:

{
result.analysis?.headings?.h3?.length || 0
}

</p>


</div>







<div className="card">

<h3>
<FaImage/> Images
</h3>



<p>

Total Images:

{
result.analysis?.images?.length || 0
}

</p>



<p>

Missing ALT:

{
result.analysis?.missingAlt || 0
}

</p>


</div>







{/* TECHNICAL SEO */}



<div className="sectionTitle">

<h2>
⚙️ Technical SEO
</h2>


</div>







<div className="card">

<h3>
<FaShieldAlt/> HTTPS
</h3>



<p className={

result.analysis?.httpsCheck?.isHttps

?

"success"

:

"error"

}>


{

result.analysis?.httpsCheck?.isHttps

?

"✅ HTTPS Enabled"

:

"❌ HTTPS Not Enabled"

}


</p>


</div>







<div className="card">

<h3>
<FaRobot/> Robots.txt
</h3>


<p className={

result.analysis?.robotsCheck?.exists

?

"success"

:

"error"

}>


{

result.analysis?.robotsCheck?.exists

?

"✅ Available"

:

"❌ Missing"

}


</p>


</div>








<div className="card">

<h3>
<FaSitemap/> Sitemap.xml
</h3>


<p className={

result.analysis?.sitemapCheck?.exists

?

"success"

:

"error"

}>


{

result.analysis?.sitemapCheck?.exists

?

"✅ Available"

:

"❌ Missing"

}


</p>


</div>



<div className="card">

<h3>
Canonical Tag
</h3>



<p className={

result.analysis?.canonicalCheck?.exists

?

"success"

:

"error"

}>


{

result.analysis?.canonicalCheck?.exists

?

"✅ Available"

:

"❌ Missing"

}


</p>


</div>







<div className="card">

<h3>
<FaMobileAlt/> Mobile Friendly
</h3>


<p className={

result.analysis?.mobileFriendly?.exists

?

"success"

:

"error"

}>


{

result.analysis?.mobileFriendly?.exists

?

"✅ Optimized"

:

"❌ Not Optimized"

}


</p>


</div>







{/* PERFORMANCE */}



<div className="sectionTitle">

<h2>
🚀 Performance
</h2>

</div>





<div className="card">

<h3>
Response Time
</h3>


<p>

{
result.analysis?.responseTime
}

ms

</p>


</div>







{/* SOCIAL SEO */}



<div className="sectionTitle">

<h2>
🌐 Social SEO
</h2>


</div>






<div className="card">


<h3>
Social Tags
</h3>


<p>

OG Title:

{

result.analysis?.socialTags?.ogTitle

?

"✅"

:

"❌"

}

</p>



<p>

OG Image:

{

result.analysis?.socialTags?.ogImage

?

"✅"

:

"❌"

}

</p>




<p>

Twitter Card:

{

result.analysis?.socialTags?.twitterCard

?

"✅"

:

"❌"

}

</p>



</div>





</div>



{/* Suggestions */}


<div className="card suggestionBox">


<h3>
💡 Suggestions
</h3>



<ul>


{

result.suggestions?.length


?


result.suggestions.map(

(item,index)=>(


<li key={index}>

{item}

</li>


)

)


:


<li>
No suggestions available
</li>


}



</ul>



</div>







</div>


)

}








{/* HISTORY */}



{

reports.length > 0 && (


<div className="result">


<h2>
Previous Reports
</h2>



{

reports.map(

(report)=>(


<div


className="card"


key={report._id}


onClick={()=>fetchReportById(report._id)}


style={{
cursor:"pointer"
}}


>



<h3>

{report.url}

</h3>




<p>

SEO Score:

{report.score}/100

</p>




<p>

Date:

{

new Date(

report.createdAt

).toLocaleDateString()

}


</p>



</div>


)


)


}




</div>


)


}










{/* SINGLE REPORT */}



{

selectedReport && (



<div className="result">



<h2>
Report Details
</h2>




<div className="card">



<h3>

{selectedReport.url}

</h3>




<p>

SEO Score:

{selectedReport.score}/100

</p>




<p>

Title:

{

selectedReport.title

||

"Not Available"

}

</p>





<p>

Meta Description:

{

selectedReport.metaDescription

||

"Not Available"

}

</p>







<p>

HTTPS:


{

selectedReport.httpsCheck?.isHttps


?


"✅ Enabled"


:


"❌ Disabled"


}


</p>







<p>

Internal Links:

{

selectedReport.internalLinks?.length || 0

}

</p>







<p>

External Links:

{

selectedReport.externalLinks?.length || 0

}

</p>






<p>

Images:

{

selectedReport.images?.length || 0

}

</p>








<h3>
Suggestions
</h3>



<ul>


{

selectedReport.suggestions?.map(


(item,index)=>(


<li key={index}>

{item}

</li>


)


)


}



</ul>





</div>






</div>


)


}






</div>


);

}


export default App;