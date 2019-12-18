const core = require("@actions/core");
const github = require("@actions/github");
const fetch = require("node-fetch");
const _ = require("underscore");

const HASHTAGS = [
  "#good-work",
  "#awesome",
  "#PR-strong",
  "#tech-chops",
  "#hustle",
  "extra-mile"
];
const QUOTES = [
  "Good job closing that PR!",
  "Nailing it!",
  "Keep up the good work!",
  "Go Team!",
  "Hey, GREAT JOB!",
  "That's a great PR"
];

async function main() {
  try {
    const bonuslyToken = core.getInput("bonusly_token");
    const userMap = JSON.parse(core.getInput("user_map"));
    const highFiveCount = core.getInput("point_count");

    if (
      github.context.payload.action === "closed" &&
      github.context.payload.pull_request.merged
    ) {
      const pullRequestFiler = github.context.payload.pull_request.user.login;
      console.log(`User who filed the PR: ${pullRequestFiler}`);
      if (userMap[pullRequestFiler]) {
        const bonusReciever = userMap[pullRequestFiler];
        const body = {
          reason: `+${highFiveCount} ${bonusReciever} ${_.sample(
            QUOTES
          )} ${_.sample(HASHTAGS)} ${_.sample(HASHTAGS)} #bonuslyBot`
        };
        console.log(body);
        const response = await fetch("https://bonus.ly/api/v1/bonuses", {
          method: "post",
          body: JSON.stringify(body),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${bonuslyToken}`
          }
        });

        const data = await response.json();
        console.log(`success: ${data.success}`);
        if (!data.success) {
          console.log(data.message);
        }
      } else {
        console.log(`User, ${pullRequestFiler}, not found in Bonusly object`);
      }
    }
  } catch (error) {
    console.log(error);
  }
}

main();
