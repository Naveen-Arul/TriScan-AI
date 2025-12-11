const diff = require('diff');
const { distance } = require('fastest-levenshtein');
const { extractTextFromFile } = require('./ocrService');

/**
 * Compare two text strings and return differences, similarities, and unique content
 * @param {string} text1 - First text
 * @param {string} text2 - Second text
 * @param {string} label1 - Label for first text
 * @param {string} label2 - Label for second text
 * @returns {Object} Comparison results
 */
function compareTexts(text1, text2, label1 = 'File 1', label2 = 'File 2') {
  // Calculate differences using diff library
  const differences = diff.diffLines(text1, text2);
  
  const added = [];
  const removed = [];
  const unchanged = [];
  
  differences.forEach(part => {
    if (part.added) {
      added.push(part.value);
    } else if (part.removed) {
      removed.push(part.value);
    } else {
      unchanged.push(part.value);
    }
  });

  // Calculate similarity percentage using Levenshtein distance
  const maxLength = Math.max(text1.length, text2.length);
  const levenshteinDistance = distance(text1, text2);
  const similarityPercentage = ((1 - levenshteinDistance / maxLength) * 100).toFixed(2);

  // Find common content
  const commonContent = unchanged.join('').trim();
  
  // Find unique content
  const uniqueInFirst = removed.join('').trim();
  const uniqueInSecond = added.join('').trim();

  return {
    summary: {
      [label1]: {
        totalCharacters: text1.length,
        uniqueCharacters: uniqueInFirst.length
      },
      [label2]: {
        totalCharacters: text2.length,
        uniqueCharacters: uniqueInSecond.length
      },
      commonCharacters: commonContent.length,
      similarityPercentage: parseFloat(similarityPercentage),
      levenshteinDistance
    },
    differences: {
      addedIn: label2,
      added: added.join('').trim(),
      removedFrom: label1,
      removed: removed.join('').trim()
    },
    similarities: commonContent,
    unique: {
      [label1]: uniqueInFirst,
      [label2]: uniqueInSecond
    }
  };
}

/**
 * Compare multiple files
 * @param {Array} files - Array of file objects from multer
 * @returns {Promise<Object>} Comparison results
 */
async function compareMultipleFiles(files) {
  if (files.length < 2) {
    throw new Error('At least 2 files are required for comparison');
  }

  // Extract text from all files
  const extractedTexts = await Promise.all(
    files.map(async (file) => {
      const text = await extractTextFromFile(file);
      return {
        filename: file.originalname,
        text,
        length: text.length
      };
    })
  );

  // If exactly 2 files, do detailed comparison
  if (files.length === 2) {
    const result = compareTexts(
      extractedTexts[0].text,
      extractedTexts[1].text,
      extractedTexts[0].filename,
      extractedTexts[1].filename
    );
    
    return {
      type: 'two-file-comparison',
      files: [extractedTexts[0].filename, extractedTexts[1].filename],
      ...result
    };
  }

  // For 3+ files, compare each pair and provide summary
  const pairwiseComparisons = [];
  
  for (let i = 0; i < extractedTexts.length - 1; i++) {
    for (let j = i + 1; j < extractedTexts.length; j++) {
      const comparison = compareTexts(
        extractedTexts[i].text,
        extractedTexts[j].text,
        extractedTexts[i].filename,
        extractedTexts[j].filename
      );
      
      pairwiseComparisons.push({
        file1: extractedTexts[i].filename,
        file2: extractedTexts[j].filename,
        similarityPercentage: comparison.summary.similarityPercentage
      });
    }
  }

  // Find most similar and most different pairs
  const sortedBysimilarity = [...pairwiseComparisons].sort(
    (a, b) => b.similarityPercentage - a.similarityPercentage
  );

  return {
    type: 'multi-file-comparison',
    fileCount: files.length,
    files: extractedTexts.map(et => ({
      filename: et.filename,
      characterCount: et.length
    })),
    pairwiseComparisons,
    mostSimilar: sortedBysimilarity[0],
    mostDifferent: sortedBysimilarity[sortedBysimilarity.length - 1],
    averageSimilarity: (
      pairwiseComparisons.reduce((sum, c) => sum + c.similarityPercentage, 0) /
      pairwiseComparisons.length
    ).toFixed(2)
  };
}

/**
 * Generate a readable summary from comparison results
 * @param {Object} comparisonResult - Result from compareMultipleFiles
 * @returns {string} Human-readable summary
 */
function generateComparisonSummary(comparisonResult) {
  if (comparisonResult.type === 'two-file-comparison') {
    const { files, summary, differences, similarities, unique } = comparisonResult;
    
    let summaryText = `Comparison of ${files[0]} and ${files[1]}\n\n`;
    summaryText += `Similarity: ${summary.similarityPercentage}%\n\n`;
    summaryText += `Common Content (${summary.commonCharacters} chars):\n${similarities.substring(0, 500)}...\n\n`;
    summaryText += `Unique to ${files[0]} (${summary[files[0]].uniqueCharacters} chars):\n${unique[files[0]].substring(0, 300)}...\n\n`;
    summaryText += `Unique to ${files[1]} (${summary[files[1]].uniqueCharacters} chars):\n${unique[files[1]].substring(0, 300)}...\n`;
    
    return summaryText;
  } else {
    let summaryText = `Multi-File Comparison (${comparisonResult.fileCount} files)\n\n`;
    summaryText += `Average Similarity: ${comparisonResult.averageSimilarity}%\n\n`;
    summaryText += `Most Similar: ${comparisonResult.mostSimilar.file1} vs ${comparisonResult.mostSimilar.file2} (${comparisonResult.mostSimilar.similarityPercentage}%)\n`;
    summaryText += `Most Different: ${comparisonResult.mostDifferent.file1} vs ${comparisonResult.mostDifferent.file2} (${comparisonResult.mostDifferent.similarityPercentage}%)\n`;
    
    return summaryText;
  }
}

module.exports = {
  compareTexts,
  compareMultipleFiles,
  generateComparisonSummary
};
