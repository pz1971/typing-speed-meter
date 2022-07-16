initialize = ()=>{
    const text = texts[0]
    const textContainer = document.getElementById('text-container')
    const ar = text.text.split('')
    for(let i = 0; i < ar.length; i++){
        const span = document.createElement('span')
        span.innerHTML = ar[i]
        span.id = i
        textContainer.appendChild(span)
    }
    console.log(ar)
}

typing = (e) => {
    e = e || window.event
    var char = e.key || e.which
    // console.log(char)
}