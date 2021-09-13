import ProgressBar from "progress";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const numberOfClients = 10;
const progressBar = new ProgressBar(
  "  creating clients [:bar] :percent :etas",
  {
    complete: "=",
    incomplete: " ",
    width: 40,
    total: numberOfClients,
  }
);
// const digitsRequired = digitCount(numberOfClients);
const main = async () => {
  const createdClients = [];
  for (let clientNumber = 1; clientNumber <= numberOfClients; clientNumber++) {
    await sleep(2000);
    progressBar.tick();
    createdClients.push(clientNumber);
  }
  console.log("createdClients: ", createdClients);
};

main().catch(() => {});
