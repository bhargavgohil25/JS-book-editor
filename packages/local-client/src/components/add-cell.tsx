import "./add-cell.css";
import { useActions } from "../hooks/use-actions";
import Button from '@material-ui/core/Button';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';


interface AddCellProps {
  prevCellId: string | null;
  forceVisible?: boolean;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      margin: theme.spacing(1),
      borderRadius: '50px',
    },
  }),
);

const AddCell: React.FC<AddCellProps> = ({ forceVisible, prevCellId }) => {
  const { insertCellAfter } = useActions();
  const classes = useStyles();

  return (
    <div className={`add-cell ${forceVisible && "force-visible"}`}>
      <div className="add-buttons">


        <Button
          variant="contained"
          color="default"
          size= "small"
          onClick={() => insertCellAfter(prevCellId, "code")}
          className={classes.button}
          startIcon={<AddIcon />}
        >
          Code
        </Button>

        <Button
          variant="contained"
          color="default"
          size= "small"
          onClick={() => insertCellAfter(prevCellId, "text")}
          className={classes.button}
          startIcon={<AddIcon />}
        >
          Text
        </Button>
        
      </div>
      <div className="divider"></div>
    </div>
  );
};

export default AddCell;
