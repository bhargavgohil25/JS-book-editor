import { useEffect,useRef } from 'react';
import './preview.css';

interface PreviewProps{
    code : string;
    err : string;
}

const html = `
        <html>
            <head>
                <style> html { background-color : white; } </style>
            </head>
            <body>
                <div id="root"></div>
                <script>
                    const handleError = (err) => {
                        const root = document.querySelector('#root');
                        root.innerHTML = '<div style="color: red"><h4> Runtime Error</h4>' + err + '</div>';
                        console.error(err);
                    };
                    // handling the asynchronous error
                    window.addEventListener('error', (event) => {
                        event.preventDefault();
                        handleError(event.error);
                    })

                    window.addEventListener('message',(event) => {
                        try{
                            eval(event.data);
                        }catch (err){
                            handleError(err);
                        }
                    },false);
                </script>
            </body>
        </html>
    `;

const Preview: React.FC<PreviewProps> = ({ code ,err }) => {
    const iframe = useRef<any>(); // rather than updating the state we will directly pass the bundled code to the iframe just after bundling is done...
    
    useEffect(() => {
        iframe.current.srdoc = html; // this is done because incase if we remove the #root class from the body in iframe, and render something afterwards we might not have to get a an error
        // but on doing this we are reseting the iframe html.. before bundling the code. 
        setTimeout(() => {
            iframe.current.contentWindow.postMessage(code,'*');
        },50);
    }, [code]);
    return (
        <div className="preview-wrapper">
            <iframe 
                title="preview" 
                ref={iframe} 
                sandbox ="allow-scripts" 
                srcDoc={html} 
            />
            {err && <div className="preview-error">{err}</div>}
        </div>
        
    );
}

export default Preview;
