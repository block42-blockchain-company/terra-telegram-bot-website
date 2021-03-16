import {MsgVote} from "@terra-money/terra.js";
import {Convert} from "@terra-money/terra.js/dist/util/convert";
import toNumber = Convert.toNumber;
import {appendError, checkExtensionAvailability, extension} from "./common";

main().catch(e => {
        console.log(e);
        appendError(e.message)
    }
)

async function main() {
    if (!checkExtensionAvailability()) {
        return
    }

    let address = (await extension.request("connect")).payload["address"]
    let urlParams = new URL(window.location.href).searchParams
    let votingId = toNumber(urlParams.get('id'))
    let voteOptionParam = urlParams.get('vote')
    const voteOption: MsgVote.Option = voteOptionParam as MsgVote.Option;

    const isCorrectVotingOption = Object.values(MsgVote.Option).indexOf(voteOption) >= 0;
    if (!isCorrectVotingOption || votingId == null) {
        console.log("Incorrect args");
        throw new Error("HTTP arguments incorrect! This website should be used only with " +
            "<a href=\"https://github.com/block42-blockchain-company/terra-node-telegram-bot\">Terra Telegram Bot</a>.");
    }

    let vote_message = new MsgVote(votingId, address, voteOption)

    extension.post({
        msgs: [vote_message]
    });
}
