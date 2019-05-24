const readline = require('readline-sync')
const robots = {

    text: require('./robots/text')
}

async function start(){

    const contet = {}
    contet.searchTerm = askAndReturnSearchTerm()
    contet.prefix = askAndReturnPrefix()

    await robots.text(contet)
    function askAndReturnSearchTerm(){
        return readline.question('Type a wikipedia search Term:')
    }

    function askAndReturnPrefix(){
        const prefixess = ['Who is', 'What is', 'The history of']
        const selectedPrefixIndex = readline.keyInSelect(prefixess,  'Choose one opinion: ')
        const selectedPrefixText = prefixess[selectedPrefixIndex]

        return selectedPrefixText
    }

    console.log(contet)
}
start()