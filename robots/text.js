const algorithmia = require('algorithmia')
const algorithmiaApiKey = require('../credentials/algorithmia').apiKey
const senteceBoundaryDetection = require('sbd')


async function robot(content) {
    await fetchContentFromWikipedia(content)
    sanitizeContent(content)
    breakContentIntoSentence(content)

    async function fetchContentFromWikipedia(content){
        const algorithmiaAuthenticated = algorithmia(algorithmiaApiKey)
        const wikipediaAlgorithmia = algorithmiaAuthenticated.algo('web/WikipediaParser/0.1.2')
        const wikipediaResponde = await wikipediaAlgorithmia.pipe(content.searchTerm)
        const wikipediaContent = wikipediaResponde.get()

        content.sourceContentOriginal = wikipediaContent.content
    }

    function sanitizeContent (content){
        const withoutblankLinesAndMarkdown = removeBlankLinesAndMarkdown(content.sourceContentOriginal)
        const withoutDateInParentheses = removeDateInParentheses(withoutblankLinesAndMarkdown)
       
        content.sourceContentSanitizado = withoutDateInParentheses

        function removeBlankLinesAndMarkdown(text){
            const allLines = text.split('\n')

            const withoutblankLinesAndMarkdown = allLines.filter((lines) =>{
                if (lines.trim().length === 0 || lines.trim().startsWith('=')){
                    return false
                }
 
                return true
                
            })
            
            return withoutblankLinesAndMarkdown.join(' ')
            
        }

        function removeDateInParentheses(text){
            return text.replace(/\((?:\([^()]*\)|[^()])*\)/gm, '').replace(/  /g,' ')


        }

      
    }

    function breakContentIntoSentence(content){
         content.sentences = []

        const sentences = senteceBoundaryDetection.sentences(content.sourceContentSanitizado)
        sentences.forEach((sentence) => {
            content.sentences.push({
                text: sentence,
                keywords: [],
                images: []
            })
        })
    }

}


module.exports = robot