import { Link } from "react-router-dom";
import '../css/Buscar.css';

function BTNVolta() {
    return (
        <div style={styles.DivBTNVolta}>
            <button className="btnVolta">
                <Link to={"/"}>← Voltar</Link>
            </button>
        </div>

    );
}
export default BTNVolta;

const styles = {
DivBTNVolta: {
    display: 'flex',
    marginTop: '1rem',
    width: '15%',
    display: 'flex',
    }
}

{/*.btn-back {
  background: none;
  border: 1px solid var(--border);
  color: var(--text-muted);
  border-radius: var(--radius-sm);
  padding: 8px 16px;
  font-size: 13px;
  font-family: var(--font-body);
  cursor: pointer;
  transition: all .18s;
}*/}