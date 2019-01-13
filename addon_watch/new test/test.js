function makePerson(first, last) {
    return {
        first: first,
        last: last,
        fullName: function() {
            return this.first + ' ' + this.last;
        },
        fullNameReversed: function() {
            return this.last + ', ' + this.first;
        }
    }
}
s = makePerson("Simon", "Willison");
s.fullName(); // Simon Willison
s.fullNameReversed(); // Willison, Simon
console.log(s.fullName());
console.log(s.fullNameReversed());

var fullName = s.fullName;
var first = "test";
var last = "demo"; 
console.log(fullName);
console.log(fullName());
console.log(s.fullName());


console.log("========================");
