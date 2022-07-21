// textId is the id of the text in texts array
var textId
// a text object
var text
// text splitting into characters will be stored in charList
var charList 
// flags if the ith character has not ever typed wrong
var isCorrect
// currently typing position
var pos = 0
// flag if scores has already been calculated
var scoresCalculated = false
// timer variable
var timer = null
// start time
var startTime = null
// elapse time
var timeElapsed = 0.0

const initialize = () => {
    // generate a random number between 0 and length of texts array
    textId = Math.floor(Math.random() * texts.length)
    initialize2()
}

const initialize2 = ()=>{
    text = texts[textId]
    const textContainer = document.getElementById('text-container')
    // clear text container
    textContainer.innerHTML = ''

    // split into list of single characters
    charList = text.text.split('')
    
    for(let i = 0; i < charList.length; i++){
        const span = document.createElement('span')
        span.innerHTML = charList[i]
        // initially all characters are untyped
        span.className = 'untyped'
        span.id = 'ch-' + i
        
        // cursor at the beginning of the text
        if(i == 0)
            span.className += ' typing-cursor'

        // append this span to textContainer
        textContainer.appendChild(span)
    }

    // initialize all the variables and flags
    isCorrect = new Array(charList.length).fill(true)
    pos = 0
    scoresCalculated = false
    startTime = null
    timeElapsed = 0.0
    if(timer != null)
        clearInterval(timer)
    timer = null

    // make time, accuracy, and wpm elements invisible
    document.getElementById('time').style.display = 'none'
    document.getElementById('accuracy').style.display = 'none'
    document.getElementById('wpm').style.display = 'none'
}

const typing = (e) => {
    e = e || window.event
    var key = e.key || e.which

    // if already completed typing, do nothing
    if(pos >= charList.length)
        return
    
    // if timer hasn't started, start it
    if(!timer)
    {
        startTime = new Date()
        timer = setInterval(() => {
            // calculate time elapsed since start upto three decimal places
            timeElapsed = (new Date() - startTime) / 1000
            document.getElementById('time').innerHTML = "Time : " + timeElapsed.toFixed(3)
        }, 1)
        // make time visible
        document.getElementById('time').style.display = 'block'
    }
    
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
            
            isCorrect[pos] = false
            pos++
        }
    }
    else{
        // change class to incorrectly-typed
        document.getElementById('ch-' + pos).className = 'incorrectly-typed'
        isCorrect[pos] = false
        pos++
    }

    // if pos is at the end of the text, calculate scores
    if(pos == charList.length && !scoresCalculated){
        // stop timer
        clearInterval(timer)
        calculateScores()
        scoresCalculated = true
        // make accuracy, wpm, and visible
        document.getElementById('accuracy').style.display = 'block'
        document.getElementById('wpm').style.display = 'block'
    }
    else{
        // if pos is at the end of the text, move cursor to the next word
        document.getElementById('ch-' + pos).className += ' typing-cursor'
    }
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

const calculateScores = () => {
    // accyracy = number of correctly typed characters / number of characters * 100
    var correctCount = 0
    for(let i = 0; i < isCorrect.length; i++)
        if(isCorrect[i] && charList[i] != ' ')
            correctCount++
    var spaceCount = 0
    for(let i = 0; i < charList.length; i++)
        if(charList[i] == ' ')
            spaceCount++
    const accuracy = correctCount / (charList.length - spaceCount) * 100

    document.getElementById('accuracy').innerHTML = "Accuracy : " + accuracy.toFixed(2) + '%'

    // ref = https://www.speedtypingonline.com/typing-equations
    // grossWPM = (number of typed characters / 5) / time elapsed * 60
    // netWPM = grossWPM - (uncorrected errors) / (time in minutes)
    
    const numberOfTypedCharacters = charList.filter((c, i) => {
        // check the class of ith character
        const className = document.getElementById('ch-' + i).className
        if(className != 'skipped' && className != 'untyped')
            return true
        return false
    }).length
 
    const grossWPM = (numberOfTypedCharacters / 5) / timeElapsed * 60

    // number of uncorrected errors
    const uncorrectedErrors = charList.filter((c, i) => {
        // check the class of ith character
        const className = document.getElementById('ch-' + i).className
        if(className == 'incorrectly-typed')
            return true
        return false
    }).length

    var netWPM = grossWPM - uncorrectedErrors / (timeElapsed / 60)
    // minimum wpm is 0
    netWPM = netWPM < 0 ? 0 : netWPM
    document.getElementById('wpm').innerHTML = "WPM : " + netWPM.toFixed(0)
}

const repeat = () => {
    console.log('repeat')
    initialize2()
}

const next = () => {
    console.log('next')
    initialize()
}