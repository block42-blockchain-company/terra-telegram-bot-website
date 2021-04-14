import {MsgVote} from "@terra-money/terra.js";
import {Convert} from "@terra-money/terra.js/dist/util/convert";
import toNumber = Convert.toNumber;
import {appendError, appendSuccess, checkExtensionAvailability, extension} from "./common";

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
    extension.on('onPost', onPost)

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
        msgs: [vote_message],
        purgeQueue: true,
    });
}

async function onPost(payload) {
    if (payload.hasOwnProperty('success') && payload.success) {

        // Make sure transaction comes from this website
        if (payload.origin == location.origin) {
            let sentTransactionResult = JSON.parse(payload.msgs[0])
            if (sentTransactionResult.type.includes('MsgVote')) {
                console.log(sentTransactionResult);
                let html = `<p>Successfully voted <b>${sentTransactionResult.value.option}</b>! 🙌</p>`
                html += `<p>This site can be closed.</p>`
                appendSuccess(html)
            }
        }

    } else {
        console.error(payload.error);
        if (payload.error.code == 1) {
            appendError("Transaction canceled!")
        } else {
            let message = `Something went wrong! Did you send the vote to the correct network?`
            message += `<p>Code: ${payload.error.code}</p>`
            if (payload.error.hasOwnProperty("message")) {
                message += `<p>Message: ${payload.error.message}</p>`
            }

            appendError(message)
        }
    }

}
