initialize = ()=>{
    const text = texts[0]
    const textContainer = document.getElementById('text-container')
    textContainer.innerText = text.text;
}

typing = (e) => {
    e = e || window.event
    var char = e.key || e.which
    // console.log(char)
}