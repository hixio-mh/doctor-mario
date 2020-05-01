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
    onFocus() {}
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

class TabManager extends Component {
    constructor() {
        super();
        this.tabIndex = 0;
        this.tabNames = ["Controls", "Appearance", "Game Settings", "Audio"];
    }

    tabHeader() {
        let tabButtons = _.range(0, this.tabNames.length).map((i) => {
            let tabName = this.tabNames[i];
            let thisTabSelected = this.tabIndex === i;

            return div(tabName)
                .class("settings-tab")
                .class(thisTabSelected ? "selected" : null)
                .onClick(() => {
                    this.tabIndex = i;
                    htmless.rerender(this);
                });
        });
        return span(...tabButtons).class("tabnav");
    }

    tabBody() {
        let tabBodyRenderer = [
            () => {
                return div(
                    new InputConfigWidget("Move Left", "LEFT"),
                    new InputConfigWidget("Move Right", "RIGHT"),
                    new InputConfigWidget(
                        "Rotate Clockwise",
                        "ROTATE_CLOCKWISE"
                    ),
                    new InputConfigWidget(
                        "Rotate Counterclockwise",
                        "ROTATE_COUNTERCLOCKWISE"
                    ),
                    new InputConfigWidget("Soft Drop", "SOFT_DROP"),
                    new InputConfigWidget("Hard Drop", "HARD_DROP")
                ).class("controls");
            },
            () => {
                return div("WIP: Will control aspects such as theme etc.");
            },
            () => {
                return div("WIP: Will control aspects such as ARR and DAS");
            },
            () => {
                return div(
                    "WIP: Will control aspects such as volume and sound effects"
                );
            },
        ][this.tabIndex];

        return tabBodyRenderer();
    }

    body() {
        return div(
            this.tabHeader(),
            div(this.tabBody()).class("settings-tab-body")
        );
    }
}

let settingsWindow = div(
    new TabManager(),
    div(
        button("Save and close").onClick(() => {
            closeSettingsWindow();
        })
    ).class("settings-footer")
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
    localStorage.setItem("keybinds", JSON.stringify(KEY_BINDS)); // local storage doesn't accept objects :(
    document.getElementById("settings-container").innerHTML = "";
}
