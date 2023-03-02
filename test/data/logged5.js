const arrowFunction = a => {
    console.log(`Entering <anonymous function>(${ a }) at line 1`);
    const abc = function (a, b, c) {
        console.log(`Entering <anonymous function>(${ a }, ${ b }, ${ c }) at line 2`);
    };
    abc(4, 5, 6);
    const def = function (d, e, f) {
        console.log(`Entering <anonymous function>(${ d }, ${ e }, ${ f }) at line 4`);
    };
    def(7, 8, 9);
};
arrowFunction(1, 2, 3);