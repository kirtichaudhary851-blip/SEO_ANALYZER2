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

    headings: [
      {
        tag: String,
        text: String
      }
    ],

    images: [
      {
        src: String,
        alt: String
      }
    ],

    urlStructure: {
      fullUrl: String
    },

    httpsCheck: {
      isHttps: Boolean
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