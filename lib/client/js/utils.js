const capitalize = (s) => {
    if (typeof s !== "string") return "";
    return s.charAt(0).toUpperCase() + s.slice(1);
};

export function randomUsername() {
    let vowels = "aeiou";
    let cons = "bcdfghjklmnprstvwyz"; // removed some more uncommon consonants

    let s = "";
    let pairs = _.random(3, 5);

    for (let i = 0; i < pairs; i++) {
        s += _.sample(cons) + _.sample(vowels);
    }
    return capitalize(s);
}
