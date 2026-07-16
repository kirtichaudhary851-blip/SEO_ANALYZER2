const { analyzeSEO } = require("../services/seoAnalyzer.js");
const SEOReport = require("../models/SEOReport");


// Analyze Website

const analyzeWebsite = async(req,res)=>{


const {url}=req.body;



if(!url){

return res.status(400).json({

success:false,

message:"Website URL is required"

});

}



try{


const seoData = await analyzeSEO(url);



//await SEOReport.deleteMany({
//url:url
//});



const savedReport = {
_id:"temporary"
};






res.json({

success:true,

message:"SEO analysis completed",

reportId:savedReport._id,

url,

score:seoData.score,


suggestions:seoData.suggestions,


analysis:seoData.analysis


});




}

catch(error){


console.log(
"SEO Analysis Error:",
error
);



res.status(500).json({

success:false,

message:error.message

});


}



};








// Get All Reports


const getReports = async(req,res)=>{


try{


const reports =
await SEOReport.find()
.limit(10)
.sort({
createdAt:-1
});



res.json({

success:true,

reports

});



}

catch(error){


res.status(500).json({

success:false,

message:error.message

});


}



};








// Get Single Report


const getReportById = async(req,res)=>{


try{


const report =
await SEOReport.findById(
req.params.id
);



if(!report){


return res.status(404).json({

success:false,

message:"Report not found"

});


}



res.json({

success:true,

report

});



}

catch(error){


res.status(500).json({

success:false,

message:error.message

});


}



};







module.exports={

analyzeWebsite,

getReports,

getReportById

};