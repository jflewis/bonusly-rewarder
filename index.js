const core = require("@actions/core");
const github = require("@actions/github");
const fetch = require("node-fetch");

async function main() {
  try {
    const bonuslyToken = core.getInput("bonusly_token");
    const userMap = JSON.parse(core.getInput("user_map"));
    const highFiveCount = core.getInput("point_count");

    const payload = JSON.stringify(github.context.payload);
    console.log(`The event payload: ${payload}`);

    if (payload.action === "closed" && payload.pull_request.merged) {
      const pullRequestFiler = payload.pull_request.user.login;
      if (userMap[pullRequestFiler]) {
        const bonusReciever = userMap[pullRequestFiler];
        const body = {
          reason: `+${highFiveCount} ${bonusReciever} for closing that PR! #good-work #proud #PR-strong #bot`
        };

        console.log(body);

        await fetch("https://bonus.ly/api/v1/bonuses", {
          method: "post",
          body: JSON.stringify(body),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${bonuslyToken}`
          }
        });
      }
    }
  } catch (error) {}
}

main();
