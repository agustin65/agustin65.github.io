let haberes=document.querySelector("#haberes");
let descuentos=document.querySelector("#descuentos");

var hab = [];
var des = []

haberes.addEventListener('submit', e => {
    e.preventDefault();
    let input = haberes.querySelector('input').value;
    if(input!=''){
        hab.push(input)
        haberes.reset();
        display('#dhaberes',hab);
    }
})

document.querySelector('#bhaberes').addEventListener('click', () => {
    if(hab.length>0){
        hab.pop();
        display('#dhaberes',hab)
    }   
})

descuentos.addEventListener('submit', e => {
    e.preventDefault();
    let input = descuentos.querySelector('input').value;
    if(input!=''){
        des.push(input)
        descuentos.reset();
        display('#ddescuentos',des);
    }
})

document.querySelector('#bdescuentos').addEventListener('click', () => {
    if(des.length>0){
        des.pop();
        display('#ddescuentos',des)
    }   
})

function display(donde,que){
    document.querySelector(donde).value=que.map(q=>(q));
}

