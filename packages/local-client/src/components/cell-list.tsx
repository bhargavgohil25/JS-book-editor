import { Fragment,useEffect } from "react";
import { useTypedSelector } from "../hooks/use-typed-selector";
import CellListItem from "./cell-list-item";
import AddCell from "./add-cell";
import './cell-list.css'
import { useActions } from '../hooks/use-actions'

const CellList: React.FC = () => {
  const cells = useTypedSelector(({ cells: { order, data } }) => {
    return order.map((id) => {
      return data[id]; // we are returning the list of data which are in the order....
    });
  });

  // We have to fetch The Cells Only one time when we we load up the App initially..
  const { fetchCells } = useActions();

  useEffect(() =>{
    fetchCells();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  

  const renderedCells = cells.map((cell) => (
    <Fragment key={cell.id}>
      <CellListItem key={cell.id} cell={cell} />
      <AddCell prevCellId={cell.id} />
    </Fragment>
  ));

  return (
    <div className="cell-list">
      <AddCell forceVisible={cells.length === 0} prevCellId={null} />
      {renderedCells}
    </div>
  );
};

export default CellList;
