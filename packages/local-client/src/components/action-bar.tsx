import { useActions } from "../hooks/use-actions";
import "./action-bar.css";
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import { IconButton } from '@material-ui/core';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import DeleteIcon from '@material-ui/icons/Delete';

interface ActionBarProps {
  id: string;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    margin: {
      margin: theme.spacing(1),
      bottom: '5px'
    },
    extendedIcon: {
      marginRight: theme.spacing(1),
    },
  }),
);

const ActionBar: React.FC<ActionBarProps> = ({ id }) => {
  const classes = useStyles();
  const { moveCell, deleteCell } = useActions();

  return (
    <div className="action-bar">

      <IconButton 
        color="inherit"
        aria-label="delete"
        disableRipple 
        className={classes.margin} 
        size="small"
        onClick={() => moveCell(id, "up")}
      >
        <ArrowUpwardIcon fontSize="inherit" />
      </IconButton>
      
      <IconButton 
        color="inherit"
        aria-label="delete" 
        disableRipple 
        className={classes.margin} 
        size="small"
        onClick={() => moveCell(id, "down")}
      >
        <ArrowDownwardIcon fontSize="inherit" />
      </IconButton>

      <IconButton 
        color="inherit"
        aria-label="delete" 
        disableRipple 
        className={classes.margin} 
        size="small"
        onClick={() => deleteCell(id)}
      >
        <DeleteIcon fontSize="inherit" />
      </IconButton>
    </div>
  );
};

export default ActionBar;
