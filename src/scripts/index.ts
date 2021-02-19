import {Wallet, MsgSend, Extension, LCDClient, MsgVote} from "@terra-money/terra.js";
import {AccAddress} from "@terra-money/terra.js/dist/core/strings";
import {Convert} from "@terra-money/terra.js/dist/util/convert";
import toNumber = Convert.toNumber;

const extension = new Extension();

setup_handlers()
main().catch(e => {
        const error = document.getElementById("error");
        error.innerText = e.message;
        // error.classList.toggle('hide')
    }
)

async function main() {
    let isAvailable = extension.isAvailable
    let urlParams = new URL(window.location.href).searchParams

    let id = toNumber(urlParams.get('id'))
    let voteOptionParam = urlParams.get('vote')
    let voteOption: MsgVote.Option = MsgVote.Option[voteOptionParam]

    if (id == null || voteOption == null) {
        throw new Error("HTML arguments are incorrect!");
    }

    await extension.connect();
    let address = (await extension.request("connect")).payload["address"]

    let vote_message = new MsgVote(id, address, voteOption)


    extension.post({
        msgs: [vote_message]
    });


}

/*
*    if not wallet:
        raise Exception("No MNEMONIC provided.")

    vote_message = MsgVote(
        proposal_id=proposal_id,
        voter=AccAddress(wallet.address),
        option=vote_option,
    )

    # TODO remove this when bug in jigu Terra.estimate_fee() function is fixed
    fee = estimate_vote_fee(proposal_id, wallet.address, vote_option)
    gas = fee['result']['gas']
    uluna_fee = int(next(filter(lambda d: d['denom'] == 'uluna', fee['result']['fees']))['amount']) * 10

    tx = wallet.create_and_sign_tx(
        vote_message,
        fee=StdFee.make(gas=gas, uluna=uluna_fee),
    )

    # TODO change mode to 'block' when jigu bug fixed (throws error "SUCCESS" even when broadcasted successfully)
    return terra.broadcast(tx, mode="sync")


*
* */


function setup_handlers() {
    extension.on('connect', async (payload) => {
        console.log("connected!")
        console.log(payload)
    });

    extension.on('post', async (payload) => {
        console.log("Posted!")
    });
}
