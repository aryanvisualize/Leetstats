export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const username = req.query.username;
  if (!username) {
    return res.status(400).json({ message: "Username is required" });
  }

  try {
    const graphql = JSON.stringify({
      query: `
        query userSessionProgress($username: String!) {
          allQuestionsCount {
            difficulty  
            count
          }
          matchedUser(username: $username) {
            username
            submitStatsGlobal {
              acSubmissionNum {
                difficulty
                count
                submissions
              }
            }
          }
        }
      `,
      variables: { username }
    });

    const response = await fetch("https://leetcode.com/graphql/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: graphql,
    });

    if (!response.ok) {
      return res.status(response.status).json({ message: "LeetCode request failed" });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}