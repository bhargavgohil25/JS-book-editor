import  { useEffect,useState } from 'react'
import { ResizableBox, ResizableBoxProps } from 'react-resizable'
import './resizable.css'

interface ResizableProps {
    direction: 'horizontal' | 'vertical';

}

const Resizable: React.FC<ResizableProps> = ({ direction, children }) => {
    let resizableProps : ResizableBoxProps;
    const [innerHeight, setInnerHeight] = useState(window.innerHeight);
    const [innerWidth, setInnerWidth] = useState(window.innerWidth); 
    const [width,setWidth] = useState(window.innerWidth * 0.75);

    useEffect(() => {
        let timer : any;
        const listener = () => {
            if(timer){
                clearTimeout(timer);
            }
            timer = setTimeout(() => {
                setInnerHeight(window.innerHeight);
                setInnerWidth(window.innerWidth);
                if(window.innerWidth*0.75 < width){
                    setWidth(window.innerWidth*0.75);
                }
            },100);
        }
        window.addEventListener('resize',listener);
        
        return () => {
            window.removeEventListener('resize', listener);
        }
    },[]);

    if(direction === 'vertical'){
        resizableProps = {
            height : 300,
            width : Infinity,
            maxConstraints : [Infinity,innerHeight * 0.9], // downward constraints 90% of the window browser Height
            minConstraints : [Infinity, 50], // upper constraints 
            resizeHandles: ['s'],
        };
    }else{
        resizableProps = {
            className : 'resize-horizontal',
            height : Infinity,
            width : width,
            minConstraints : [innerWidth * 0.2,Infinity], // upper constraints 
            maxConstraints : [innerWidth * 0.75,Infinity], // downward constraints 90% of the window browser Height
            resizeHandles: ['e'],
            onResizeStop : (event, data) => {
                // console.log(data);
                setWidth(data.size.width);
            }
        };
    }
    
    return (
    <ResizableBox { ...resizableProps }>
        {children}
    </ResizableBox>
    );
};



export default Resizable;