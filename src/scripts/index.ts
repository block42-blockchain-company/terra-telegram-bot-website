import '../styles/style.css'
import {Extension, MsgVote} from "@terra-money/terra.js";
import {Convert} from "@terra-money/terra.js/dist/util/convert";
import toNumber = Convert.toNumber;
import {NoStationExtension} from "./errors";

const extension = new Extension();

main().catch(e => {
        if (e instanceof NoStationExtension) {
            console.log("No extension")
            const noExtension = document.getElementById("no-extension");
            noExtension.classList.remove("hide");
        } else {
            appendError(e.message)
        }
    }
)

async function main() {
    let isAvailable = extension.isAvailable
    if (!isAvailable) {
        console.log("No station extension");
        throw new NoStationExtension()
    }

    let address = (await extension.request("connect")).payload["address"]

    let urlParams = new URL(window.location.href).searchParams
    let id = toNumber(urlParams.get('id'))
    let voteOptionParam = urlParams.get('vote')?.toUpperCase()
    let voteOption: MsgVote.Option = MsgVote.Option[voteOptionParam]

    if (id == null || voteOption == null) {
        console.log("Incorrect args");
        throw new Error("HTML arguments are incorrect!");
    }

    setup_handlers()

    let vote_message = new MsgVote(id, address, voteOption)

    extension.post({
        msgs: [vote_message]
    });


}

function setup_handlers() {
    extension.on(async (payload) => {
        if (payload.hasOwnProperty('success')) {
            if (payload.success) {
                console.log('success:');
            } else {
                appendError("Something went wrong! Please refresh this page to try again.")
            }
        }
    })
}


function appendError(message) {
    let error = document.createElement("div");
    error.classList.add("notification", "is-danger", "has-text-centered")
    error.innerHTML = message
    document.querySelector("div.container").appendChild(error);
}




