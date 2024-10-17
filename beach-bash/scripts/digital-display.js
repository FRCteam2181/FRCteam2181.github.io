namespace("2181robotics.beach-bash.DigitalDisplay", () => {
  const digits = {
    "0": "zero",
    "1": "one",
    "2": "two",
    "3": "three",
    "4": "four",
    "5": "five",
    "6": "six",
    "7": "seven",
    "8": "eight",
    "9": "nine"
  };
  const template = function(digit, index) {
    return `<use href="#${digits[digit]}" x="${index * 10}"/>`;
  }
  const DigitalDisplay = function(id, digitCount) {
    this.update = function(value) {
      const digits = value.toString().split("");
      while(digits.length < digitCount) {
        digits.unshift("0")
      };
      document.getElementById(id).innerHTML = digits.map(template).join("");
    }
  }
  return DigitalDisplay;
});