const core = require("@actions/core");
const github = require("@actions/github");
const fetch = require("node-fetch");

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
          reason: `+${highFiveCount} ${bonusReciever} for closing that PR! #good-work #proud #PR-strong #bot`
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
      } else {
        console.log(`User, ${pullRequestFiler}, not found in Bonusly object`);
      }
    }
  } catch (error) {
    console.log(error);
  }
}

main();
