const mongoose = require("mongoose");

const seoReportSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true
    },

    score: {
      type: Number,
      required: true
    },


    title: {
      type: String
    },


    metaDescription: {
      type: String
    },


    headings: {
      h1: [String],
      h2: [String],
      h3: [String]
    },


    images: [
      {
        src: String,
        alt: String
      }
    ],


    urlStructure: {
      fullUrl: String,
      protocol: String,
      hostname: String,
      pathname: String
    },


    httpsCheck: {
      isHttps: Boolean
    },


    robotsCheck: {
      exists: Boolean,
      url: String
    },


    sitemapCheck: {
      exists: Boolean,
      url: String
    },


    canonicalCheck: {
      exists: Boolean
    },


    mobileFriendly: {
      exists: Boolean
    },


    socialTags: {

      ogTitle: Boolean,

      ogImage: Boolean,

      twitterCard: Boolean

    },


    responseTime: {
      type: Number
    },


    internalLinks: [
      String
    ],


    externalLinks: [
      String
    ],


    suggestions: [
      String
    ]

  },
  {
    timestamps: true
  }
);


module.exports = mongoose.model("SEOReport", seoReportSchema);