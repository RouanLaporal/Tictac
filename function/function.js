module.exports.newSpace = function (string) {
    const nbChar = 80;
    var newLine = string.split(/(\n)/);
    var q = 1;
    for (var i = 0; i < newLine.length; i++) {
        var line = newLine[i].trim();
        if (line.length >= nbChar) {
            continue;
        }
        for (var j = 0; j < line.length; j++) {
            if (line[j] == " " && line.length < nbChar) {
                line = setCharAt(line, j, " ");
                j = j + q;
            }
            if (j == line.length - 1 && line.length < nbChar) {
                j = 0;
                q++;
            }
        }
        newLine[i] = line;
    }
    return newLine.join("\n");

}
function setCharAt(string, index, char) {
    if (index > string.length - 1)
        return string;
    return string.substring(0, index) + char + string.substring(index + 1);
}