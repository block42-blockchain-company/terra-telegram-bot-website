import {MsgGrantAuthorization} from "@terra-money/terra.js";
import {appendError, appendSuccess, checkExtensionAvailability, extension, setIsLoading} from "./common";
import axios from "axios";

main().catch(e => {
        console.log(e);
        appendError(e.message)
    }
)

let walletAddress: string;
let network: string;
const backendUrl = 'http://terra-api.b42.tech/';
let telegramAuthParams: string;

async function main() {
    if (!checkExtensionAvailability()) {
        return
    }

    let params = new URL(window.location.href).searchParams;
    network = params.get('network')
    params.delete('network');
    telegramAuthParams = params.toString();

    checkNetwork(network);

    await delegateVoting()
}


async function delegateVoting() {
    const connect = await extension.request("connect");
    walletAddress = connect.payload["address"]
    appendWalletAddressInfo(walletAddress);

    extension.on('onPost', onPost)

    let msgGrant: MsgGrantAuthorization;
    try {
        const msgResult = await axios.get(`${backendUrl}${network}/msgauth/generate/${walletAddress}?${telegramAuthParams}`);
        msgGrant = MsgGrantAuthorization.fromData(msgResult.data.result)
    } catch (e) {
        console.log(e);
        throw Error("Error while preparing MsgGrantAuthorization. This may indicate webserver problems.")
    }

    extension.post({
        msgs: [msgGrant],
        purgeQueue: true
    });
}


async function onPost(payload) {
    if (payload.hasOwnProperty('success') && payload.success) {

        // Make sure transaction comes from this website
        if (payload.origin == location.origin) {
            let sentTransactionResult = JSON.parse(payload.msgs[0])
            if (sentTransactionResult.type.includes('MsgGrantAuthorization')) {
                let approval;

                setIsLoading(true);
                try {
                    approval = await axios.post(`${backendUrl}${network}/msgauth/confirm/${walletAddress}?${telegramAuthParams}`);
                } catch (e) {
                    console.error(e);
                    appendError("Error while delegating your vote. Try again later.")
                    setIsLoading(false);
                    return
                }

                if (approval.status == 200) {
                    const result = approval.data.result;
                    let html = `<p>Successfully authorized voting for telegram user <b>${result.saved.telegramId}</b>! 🙌</p>`
                    html += `<p>You can now vote directly from Telegram Terra Bot with your wallet <b>${result.saved.walletAddress}</b></p>`
                    html += `<p>This site can be closed.</p>`
                    appendSuccess(html)
                } else {
                    console.log(`error: ${approval}`)
                    appendError("Error while delegating your vote. Try again later.")
                }

                setIsLoading(false);
            }
        }

    } else {
        console.error(payload.error);
        if (payload.error.code == 1) {
            appendError("Transaction canceled!")
        } else {
            let message = `Something went wrong! Did you broadcast to the correct network?`
            message += `<p>Code: ${payload.error.code}</p>`
            if (payload.error.hasOwnProperty("message")) {
                message += `<p>Message: ${payload.error.message}</p>`
            }

            appendError(message)
        }
    }

}

function checkNetwork(net: string) {
    if (isCorrectNetwork(net)) {
        displayInfoAboutNetwork(net)
    } else {
        throw Error("Network HTTP parameter is incorrect!")
    }
}


function isCorrectNetwork(networkName) {
    const availableNetworks = ['localterra', 'testnet', 'mainnet'];

    return availableNetworks.includes(networkName)
}

function displayInfoAboutNetwork(networkName) {
    let info = document.createElement("div",);
    info.classList.add("notification", "is-warning", "has-text-centered")
    info.id = 'network-info'
    info.innerHTML = `Make sure that you picked <b>${networkName.toUpperCase()}</b> network in Station Extension!`
    document.querySelector("div.container").appendChild(info);
}


function appendWalletAddressInfo(addr) {
    const el = document.getElementById('network-info');
    el.innerHTML += `<p>You will delegate voting from this address, make sure it's correct: <b>${addr}</b></p>`
}