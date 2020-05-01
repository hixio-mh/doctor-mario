import fs from "fs";

let list = fs.readFileSync("./lib/server/profanity_list.txt", "utf-8").split("\n");

function escapeRegExp(string) {
    return string.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

export default function censor(string) {
    for (let word of list) { // censor swears w/ word boundary
        let pattern = new RegExp(`\\b${escapeRegExp(word)}\\b`, "gi");
        string = string.replace(pattern, "*".repeat(word.length))
    }
    for (let word of list) { // censor long swears w/o word boundary
        if (word.length < 5) {
            continue
        }
        let pattern = new RegExp(escapeRegExp(word), "gi");
        string = string.replace(pattern, "*".repeat(word.length))
    }
    return string;
}
