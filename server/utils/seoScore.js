const calculateSEOScore = (data) => {

    let score = 0;

    // Title check
    if (data.title && data.title.trim() !== "") {
        score += 15;
    }

    // Meta description check
    if (data.metaDescription && data.metaDescription.trim() !== "") {
        score += 15;
    }

    // Heading check
    if (data.headings && data.headings.length > 0) {
        score += 15;
    }

    // Images alt check
    if (data.images && data.images.length > 0) {
        const imagesWithAlt = data.images.filter(
            img => img.alt && img.alt.trim() !== ""
        );

        if (imagesWithAlt.length === data.images.length) {
            score += 15;
        } else {
            score += 5;
        }
    }

    // HTTPS check
    if (data.httpsCheck === true) {
        score += 10;
    }

    // Internal links
    if (data.internalLinks && data.internalLinks.length > 0) {
        score += 10;
    }

    // External links
    if (data.externalLinks && data.externalLinks.length > 0) {
        score += 10;
    }

    // URL structure
    if (data.urlStructure) {
        score += 10;
    }


    return score;
};


module.exports = calculateSEOScore;