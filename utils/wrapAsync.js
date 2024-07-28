// utils wrapAsync.js code

module.exports = (fn) => {
    return function(req, res, next){
        fn(req, res, next).catch(next);
    };
};

// The fn takes a function as an argument and returns a new function. The new function takes three
// arguments: req, res, and next. The new function calls the original fn with the same
// arguments, and then calls the next middleware function in the stack. If the original fn throws
// an error, the new function catches it and calls the next middleware function with the error as an
// argument. This allows the error to be handled by the next middleware function in the stack.