import React from "react";

function Report({ result })  {

  if (!result) {
    return (
      <div>
        <h2>No Report Available</h2>
      </div>
    );
  }

  return (
    <div className="report">

      <h1>SEO Report</h1>

      <h3>Website URL</h3>
      <p>{result.url}</p>


      <div className="card">
        <h3>SEO Score</h3>
        <h2>
          {result.score || 0}/100
        </h2>
      </div>


      <div className="card">
        <h3>Title</h3>
        <p>
          {result.analysis?.title || "Title Not Found"}
        </p>
      </div>


      <div className="card">
        <h3>Meta Description</h3>
        <p>
          {result.analysis?.metaDescription || "Meta Description Not Found"}
        </p>
      </div>


      <div className="card">
        <h3>HTTPS Check</h3>

        {
          result.analysis?.httpsCheck ?

          <p className="success">
            ✅ HTTPS Enabled
          </p>

          :

          <p className="error">
            ❌ HTTPS Not Enabled
          </p>
        }

      </div>


      <div className="card">
        <h3>Robots.txt Check</h3>

        {
          result.analysis?.robotsCheck?.exists ?

          <p className="success">
            ✅ Robots.txt Available
          </p>

          :

          <p className="error">
            ❌ Robots.txt Not Found
          </p>
        }

      </div>


      <div className="card">
        <h3>Sitemap.xml Check</h3>

        {
          result.analysis?.sitemapCheck?.exists ?

          <p className="success">
            ✅ Sitemap Available
          </p>

          :

          <p className="error">
            ❌ Sitemap Not Found
          </p>
        }

      </div>


    </div>
  );
}

export default Report;