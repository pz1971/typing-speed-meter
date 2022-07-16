// a text object
var text
// text splitting into characters will be stored in charList
var charList 

initialize = ()=>{
    text = texts[0]
    const textContainer = document.getElementById('text-container')

    // split into list of single characters
    charList = text.text.split('')
    
    for(let i = 0; i < charList.length; i++){
        const span = document.createElement('span')
        span.innerHTML = charList[i]
        // initially all characters are untyped
        span.className = 'untyped'
        span.id = 'ch-' + i
        
        if(i == 0)
            span.className += ' typing-cursor'

        // append this span to textContainer
        textContainer.appendChild(span)
    }
}

// currently typing position
var pos = 0

const typing = (e) => {
    e = e || window.event
    var key = e.key || e.which

    // if already completed typing, do nothing
    if(pos >= charList.length)
        return
    
    if(key == charList[pos]){
        // change class to correctly-typed
        document.getElementById('ch-' + pos).className = 'correctly-typed'
        pos++
    }
    else if(key == ' '){
        // whitespace completes a word
        // move pos to the begin of the next word
        var pos2 = charList.indexOf(' ', pos) + 1
        if(pos2 == 0)
            pos2 = charList.length
        while(pos < pos2){
            // change class to incorrectly-typed
            if(charList[pos] != ' ')
                document.getElementById('ch-' + pos).className = 'skipped'
            pos++
        }
    }
    else{
        // change class to incorrectly-typed
        document.getElementById('ch-' + pos).className = 'incorrectly-typed'
        pos++
    }

    // change class to typing-cursor
    document.getElementById('ch-' + pos).className += ' typing-cursor'
}

const checkIfBackspace = (e) => {
    e = e || window.event
    var key = e.key || e.which

    if(key === 'Backspace'){
        // if pos is at beginning of a (word / text) or at the end of the text, do nothing
        if(pos == 0 || pos == charList.length || charList[pos - 1] == ' ')
            return
        // change class to untyped
        document.getElementById('ch-' + pos).className = 'untyped'
        pos--
        document.getElementById('ch-' + pos).className = 'untyped typing-cursor'
    }
}