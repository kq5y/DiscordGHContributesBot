const properties = PropertiesService.getScriptProperties();
const USERNAME = properties.getProperty("GH_USERNAME");
const GITHUB_TOKEN = properties.getProperty("GH_TOKEN");
const DISCORD_URL = properties.getProperty("DISCORD_URL");
const GITHUB_URL = "https://api.github.com/graphql";

const NOW = new Date();
const TODAY = Utilities.formatDate(NOW, "Asia/Tokyo", "yyyy-MM-dd");
const TODAY_ZERO = new Date(`${TODAY}T00:00:00+09:00`);

function getNumOfContributions() {
    let options = {
        "method": "GET",
        "headers": {
            "Authorization": `Bearer ${GITHUB_TOKEN}`,
            "Content-Type": "application/json"
        },
        "payload": JSON.stringify({
            query: `query contributions {
                user(login: "${USERNAME}") {
                    contributionsCollection(to: "${TODAY_ZERO.toISOString()}", from: "${TODAY_ZERO.toISOString()}") {
                        contributionCalendar {
                            weeks {
                                contributionDays {
                                    date
                                    contributionCount
                                }
                            }
                        }
                    }
                }
            }`
        })
    };
    
    let response = UrlFetchApp.fetch(GITHUB_URL, options);
    
    if (response.getResponseCode() === 200) {
        let datas = JSON.parse(response.getContentText());
        let contribution = datas.data.user.contributionsCollection.contributionCalendar.weeks[0].contributionDays[0].contributionCount;
        return contribution;
    } else {
        throw new Error("Unable to access the Github API.");
    }
}

function postMessage(message) {
    let options = {
        "method": "POST",
        "payload": {
            "content": message
        }
    };
    UrlFetchApp.fetch(DISCORD_URL, options);
}

function formatDate(date) {
    const year = String(date.getFullYear()).padStart(4, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
}

function main() {
    try {
        let contribution = getNumOfContributions();
        postMessage(`${formatDate(TODAY_ZERO)} ${"█".repeat(Math.min(10, Number    (contribution) * 10 / 15))}> ${String(contribution)}`);
    } catch (e) {
        console.error(e);
        postMessage(`[An error has occurred] ${e}`);
    }
}
