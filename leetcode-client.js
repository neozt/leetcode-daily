import {DAILY_QUESTION_QUERY} from './leetcode-queries.js'
import axios from 'axios'

const LEETCODE_API_URL = process.env.LEETCODE_API_URL || 'https://leetcode.com/graphql';
const LEETCODE_URL = process.env.LEETCODE_URL || 'https://leetcode.com';


export async function getDailyQuestion() {
    return queryLeetCodeAPI(DAILY_QUESTION_QUERY, {});
}

export function constructDailyQuestionUrl(link, date) {
    return `${LEETCODE_URL}${link}?envType=daily-question&envId=${date}`
}

async function queryLeetCodeAPI(query, variables) {
    try {
        const response = await axios.post(LEETCODE_API_URL, { query, variables });
        if (response.data.errors) {
            throw new Error(response.data.errors[0].message);
        }
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(`Error from LeetCode API: ${JSON.stringify(error.response.data)}`);
        } else if (error.request) {
            throw new Error('No response received from LeetCode API');
        } else {
            throw new Error(`Error in setting up the request: ${error.message}`);
        }
    }
}