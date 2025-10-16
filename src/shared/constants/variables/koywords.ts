// Define an interface for the average search volume.

import errorRepository from "@/shared/repositories/error_repository";

// It contains separate 'min' and 'max' fields.
interface Avg {
    min: number;
    max: number;
}

// Define an interface for a keyword entry.
// Each entry includes:
//  - The keyword text
//  - The average search volume (using the Avg interface)
//  - A competition level ('Low', 'Medium', 'High', or '---' if not applicable)
interface KeywordItem {
    keyword: string;
    avg: Avg;
    competition: 'Low' | 'Medium' | 'High' | '---';
}

// ----------------------------------------------------------------------
// All Keyword Entries
// ----------------------------------------------------------------------
// To add a new keyword, simply create a new object using the template below:
// {
//     keyword: 'Your Keyword',
//     avg: {
//         min: yourMinValue,
//         max: yourMaxValue
//     },
//     competition: 'Low'
// }
const allKeywords: KeywordItem[] = [
];

// ----------------------------------------------------------------------
// Filter and Sort Function
// ----------------------------------------------------------------------
// This function filters the keywords based on the minimum search volume (using the 'min' value)
// and sorts them in descending order (largest 'min' value first).
// It returns only the keyword text as an array of strings.
const filterKeywordsByAvg = (
    keywords: KeywordItem[],
    minAvg: Avg = { min: 10, max: 100, },
): string[] => {
    try {
        const filteredAndSorted = keywords
            // Filter out keywords that low then minAvg
            .filter(item => item.avg.min > minAvg.min && item.avg.max > minAvg.max)
            // Sort in descending order based on the min value (largest first),
            // and then by max value (largest first) as a secondary sort
            .sort((a, b) => b.avg.min - a.avg.min)
            // Map to only the keyword string
            .map(item => item.keyword);

        // console.info('Current keywords length: ', filteredAndSorted.length);
        return filteredAndSorted;
    } catch (e) {
        errorRepository.sendErrorReport({ error: e, params: { keywords, minAvg }, classOrMethodName: 'filterKeywordsByAvg' });
        return [];
    }
};

const keywords: string[] = filterKeywordsByAvg(allKeywords);

export default keywords;