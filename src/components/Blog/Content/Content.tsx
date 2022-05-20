import ReactMarkdown from 'react-markdown'
const craReadme = ` 

## May 20 2022
This is the first blog post, and a placeholder. I was thinking of adding a fancy blog but I did not end up having enough time. So I will sumarize the tech stack used for this app.

This app is written in Typescript, React, and [Regl](http://regl.party/) (a small functional abstraction for WebGL). The frontend code is hosted on GitHub and there is no backend.
`
const text = () => <ReactMarkdown>{craReadme}</ReactMarkdown>

export default text
