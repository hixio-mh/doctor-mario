import { keyboardMap } from "./keycodes.js";

let keyBindSettings = {}; // temporary; used only by settings.js

class InputConfigWidget extends InlineComponent {
    constructor(displayName, kbName) {
        super(kbName);
        this.displayName = displayName;
        this.kbName = kbName;
    }
    getKeyCode() {
        return keyBindSettings[this.kbName];
    }
    onFocus() {

    }
    onModify(ev) {
        keyBindSettings[this.kbName] = ev.keyCode;
        ev.preventDefault();
        htmless.rerender(this);
    }
    body() {
        return span(
            paragraph(this.displayName),
            input
                .text()
                .placeholder(keyboardMap[this.getKeyCode()])
                .onEvent("focus", this.onFocus)
                .onEvent("keydown", this.onModify.bind(this), true)
                .class("input-capture")
        ).class("input-config");
    }
}

let settingsWindow = div(
    headers.h1("Settings"),
    div(new InputConfigWidget("Move Left", "LEFT")).class("controls"),
    div(new InputConfigWidget("Move Right", "RIGHT")).class("controls"),
    div(new InputConfigWidget("Rotate Clockwise", "ROTATE_CLOCKWISE")).class("controls"),
    div(new InputConfigWidget("Rotate Counterclockwise", "ROTATE_COUNTERCLOCKWISE")).class("controls"),
    div(new InputConfigWidget("Soft Drop", "SOFT_DROP")).class("controls"),
    div(new InputConfigWidget("Hard Drop", "HARD_DROP")).class("controls"),
    button("Save and close").onClick(()=>{
        closeSettingsWindow();
    })
).id("settings-window");

export function openSettingsWindow() {
    // load global KEY_BINDS into widget state
    for (let [code, name] of Object.entries(KEY_BINDS)) {
        keyBindSettings[name] = code;
    }

    document
        .getElementById("settings-container")
        .appendChild(settingsWindow.render());
}

export function closeSettingsWindow() {
    // export widget state to global KEY_BINDS

    KEY_BINDS = {}; // clear
    for (let [name, code] of Object.entries(keyBindSettings)) {
        KEY_BINDS[code] = name;
    }
    document.getElementById("settings-container").innerHTML = "";
}