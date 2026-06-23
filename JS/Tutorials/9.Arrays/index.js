let nums = [0,1,2,3,4,5];

nums.push(6);

// adds in front
nums.unshift(-1);

// deletes from front
nums.shift();

nums.pop();

nums.sort().reverse();

for(let num of nums){
    // console.log(num);
}

console.log(nums);
console.log(nums.length);
console.log(nums.indexOf(4));