import { Cell } from '../state';
import CodeCell from './code-cell'
import TextEditor from './text-editor'
import ActionBar from './action-bar'
import './cell-list-item.css'

interface CellListItemProps {
    cell : Cell
}

const CellListItem: React.FC<CellListItemProps> = ({ cell }) => {
    let child : JSX.Element; // to get what cell is passed and according to that render the correct cell
    if(cell.type === 'code'){
        child = <>
            <div className="action-bar-wrapper">
                <ActionBar id={cell.id}/>
            </div>
            <CodeCell cell={cell}/>
        </>
    }else{
        child = (
            <>
                <TextEditor cell={cell}/>
                <ActionBar id={cell.id}/>
            </>
        );
    }

    return (
        <div className="cell-list-item">
            {child}
        </div>
    );
};

export default CellListItem;
