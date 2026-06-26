// "this" reference doesn't work with fat arrow func declarations
// ----------------------------------------------------------------------

// const person1 = {
//     firstName: "Lionel",
//     lastName: "Messi",
//     age: 39,
//     isEmployed: true,
//     sayHello: function() {console.log(`Hello I'm ${this.firstName}`)},
// }

// const person2 = {
//     firstName: "Lionel",
//     lastName: "Messi",
//     age: 50,
//     isEmployed: true
// }

// person2.age = 99;

// person1.sayHello();
// console.log(person2.age);

// ----------------------------Constructor--------------------------------

// function Car(make, model, year, color){
//     this.make = make;
//     this.model = model;
//     this.year = year;
//     this.color = color;
//     this.drive = function(){console.log(`Driving ${this.make}`)}
// }

// const car1 = new Car("BMW", "M3", 2021, "Black");
// const car2 = new Car("AUDI", "Golf", 2023, "White");

// console.log(car1.year);
// car1.drive();

// console.log(car2.model);

// ----------------------------Class--------------------------------

class Product{
    constructor(name, price){
        this.name = name;
        this.price = price;
    }

    displayProduct(){
        console.log(`Product: ${this.name}`);
        console.log(`Price: $${this.price.toFixed(2)}`);
    }

    calculateTotal(salesTax){
        return this.price + this.price * salesTax;
    }
}

const salesTax = 0.05;

product1 = new Product("Laptop", 800);

product1.displayProduct();

console.log(`Price Including tax: ${product1.calculateTotal(salesTax)}`);